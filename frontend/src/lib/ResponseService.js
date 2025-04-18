const API_URL = import.meta.env.VITE_API_URL;
const API_BASE = API_URL + "/api/responds";

function getTokenHeaders() {
  const token = localStorage.getItem("token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : null;
}

export async function loadResponse(postId) {
  const headers = getTokenHeaders();
  if (!headers) return [];

  try {
    const response = await fetch(`${API_BASE}/${postId}`, { headers });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading responses:", error);
    return [];
  }
}

export async function sendResponse(postId, content) {
  const headers = getTokenHeaders();
  if (!headers) return { error: "Unauthorized" };

  try {
    const response = await fetch(`${API_BASE}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ id_post: postId, content }),
    });
    if (!response.ok) throw new Error("Failed to send response");
    return await response.json();
  } catch (error) {
    console.error("Error sending response:", error);
    return { error: error.message };
  }
}

export async function deleteResponse(responseId) {
  const headers = getTokenHeaders();
  if (!headers) return { error: "Unauthorized" };

  try {
    const response = await fetch(`${API_BASE}/${responseId}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) throw new Error("Failed to delete response");
    return await response.json();
  } catch (error) {
    console.error("Error deleting response:", error);
    return { error: error.message };
  }
}
