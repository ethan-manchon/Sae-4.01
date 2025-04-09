const API_URL = import.meta.env.VITE_API_URL;
const API_BASE = `${API_URL}/api/reposts`;

function getTokenHeaders() {
  const token = localStorage.getItem("token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    : null;
}

export async function createRepost(postId, comment) {
  const headers = getTokenHeaders();
  if (!headers) return { error: "Unauthorized" };
  console.log("Creating repost with postId:", postId, "and comment:", comment);

  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers,
      body: JSON.stringify({ 
        post_id: postId, 
        comment: comment.toString()
      }),
    });
    const result = await response.json();
    return response.ok ? result : { error: result.error };
  } catch (error) {
    console.error("Error creating repost:", error);
    return { error: error.message };
  }
}

export async function deleteRepost(repostId) {
  const headers = getTokenHeaders();
  if (!headers) return { error: "Unauthorized" };

  try {
    const response = await fetch(`${API_BASE}/${repostId}`, {
      method: "DELETE",
      headers,
    });
    const result = await response.json();
    return response.ok ? result : { error: result.error };
  } catch (error) {
    console.error("Error deleting repost:", error);
    return { error: error.message };
  }
}

export async function loadRepost(postId) {
  const headers = getTokenHeaders();
  if (!headers) return [];

  try {
    const response = await fetch(`${API_BASE}/${postId}`, { headers });
    const result = await response.json();
    return response.ok ? result : [];
  } catch (error) {
    console.error("Error loading reposts:", error);
    return [];
  }
}

