const API_URL = import.meta.env.VITE_API_URL;
const API_BASE = API_URL + "/api/blockeds";

function getTokenHeaders() {
  const token = localStorage.getItem("token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : null;
}

export async function loadBlocked() {
  const headers = getTokenHeaders();
  try {
    const response = await fetch(`${API_BASE}`, { headers });
    if (!response.ok) throw new Error("Failed to load blocked users");
    return await response.json();
  } catch (error) {
    console.error("Error loading blocked users:", error);
    return{ error: error.message };
  }
}

export async function blockUser(userId) {
  const headers = getTokenHeaders();
  if (!headers) return { error: "Unauthorized" };

  try {
    const response = await fetch(`${API_BASE}/${userId}`, {
      method: "POST",
      headers,
    });
    return await response.json();
  } catch (error) {
    console.error("Block user error:", error);
    return { error: error.message };
  }
}

export async function unblockUser(userId) {
  const headers = getTokenHeaders();
  if (!headers) return { error: "Unauthorized" };

  try {
    const response = await fetch(`${API_BASE}/${userId}`, {
      method: "DELETE",
      headers,
    });
    return await response.json();
  } catch (error) {
    console.error("Unblock user error:", error);
    return { error: error.message };
  }
}

export async function isUserBlocked(targetUserId) {
  const headers = getTokenHeaders();
  if (!headers) return false;

  try {
    const response = await fetch(`${API_BASE}/${targetUserId}`, { headers });
    if (!response.ok) throw new Error("Failed to fetch blocked users");
    const data = await response.json();
    console.log("BlockedService : ", data);
    return data;
  } catch (error) {
    console.error("Error checking block status:", error);
    return false;
  }
}
