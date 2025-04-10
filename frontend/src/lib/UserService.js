const API_URL = import.meta.env.VITE_API_URL;
const API_BASE = API_URL + "/api/users";
const ADMIN_BASE = API_URL + "/admin/users";

let cachedMe = null;

function getTokenHeaders() {
  const token = localStorage.getItem("token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : null;
}

export async function loadUsers(page = 1) {
  const headers = getTokenHeaders();
  if (!headers) return { users: [], error: "Unauthorized" };

  try {
    const response = await fetch(`${ADMIN_BASE}?page=${page}`, { headers });
    if (!response.ok) throw new Error("Failed to load users");
    return await response.json();
  } catch (error) {
    console.error("Error loading users:", error);
    return { users: [], error: error.message };
  }
}

export async function loadUserById(id) {
  const headers = getTokenHeaders();
  if (!headers) return null;

  try {
    const response = await fetch(`${ADMIN_BASE}/${id}`, { headers });
    if (!response.ok) throw new Error("Unauthorized");
    return await response.json();
  } catch (error) {
    console.error("Error loading user:", error);
    return null;
  }
}

export async function patchUsers(id, patch) {
  const headers = getTokenHeaders();
  if (!headers) return { users: [], error: "Unauthorized" };

  try {
    const response = await fetch(`${ADMIN_BASE}/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(patch),
    });
    if (!response.ok) throw new Error("Failed to patch user");
    return await response.json();
  } catch (error) {
    console.error("Error patching user:", error);
    return { users: [], error: error.message };
  }
}

export async function loadMe() {
  if (cachedMe) return cachedMe;

  const headers = getTokenHeaders();
  if (!headers) return null;

  try {
    const response = await fetch(`${API_BASE}`, { headers });
    if (!response.ok) throw new Error("Erreur de chargement de profil");
    const user = await response.json();
    cachedMe = user;
    return user;
  } catch (error) {
    console.error("Error loading user:", error);
    return null;
  }
}

export async function loadProfil(pseudo) {
  const headers = getTokenHeaders();
  if (!headers) return null;

  try {
    const response = await fetch(`${API_BASE}/${pseudo}`, { headers });
    if (!response.ok) throw new Error("Unauthorized");
    return await response.json();
  } catch (error) {
    console.error("Error loading profile:", error);
    return null;
  }
}

export async function updateUser(userId, data) {
  const headers = getTokenHeaders();
  if (!headers) return { error: "Unauthorized" };

  try {
    const response = await fetch(`${API_BASE}/${userId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });
    console.log(data);
    if (!response.ok) throw new Error("Failed to update user");

    return await response.json();
  } catch (error) {
    console.error("Error updating user:", error);
    return { error: error.message };
  }
}

export async function uploadImage(file, type) {
  console.log("Uploading image", file);
  console.log("Type", type);
  const formData = new FormData();
  formData.append("file", file);

  const endpoint =
    type === "pdp" ? `${API_BASE}/upload-pdp` : `${API_BASE}/upload-banner`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  });

  const text = await res.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch (err) {
    throw new Error("Le serveur n'a pas retourné un JSON valide.");
  }

  if (!res.ok) throw new Error(data.error || "Upload failed");

  return data;
}
