const API_BASE = "http://localhost:8080/api/likes";

function getTokenHeaders() {
  const token = localStorage.getItem("token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    : null;
}

export async function loadLikes(postId) {
  const headers = getTokenHeaders();
  if (!headers) return [];

  try {
    const response = await fetch(`${API_BASE}/${postId}`, { headers });
    if (!response.ok) throw new Error("Failed to load responds");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading responses:", error);
    return [];
  }
}

  
  export async function postLike(postId) {
    const token = localStorage.getItem("token");
    if (!token) return { error: "Unauthorized" };
  
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    };
  
    try {
      const response = await fetch(`${API_BASE}`, {
        method: "POST",
        headers,
        body: JSON.stringify({ post_id: postId })
      });
  
      const json = await response.json();
      return json;
    } catch (error) {
      console.error("Like error:", error);
      return { error: error.message };
    }
  }
  
  export async function deleteLike(likeId) {
    const headers = getTokenHeaders();
    if (!headers) return { error: "Unauthorized" };
  
    try {
      const response = await fetch(`${API_BASE}/${likeId}`, {
        method: "DELETE",
        headers,
      });
  
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch {
        console.error("Invalid JSON from deleteLike:", text);
        return { error: "Invalid response from server" };
      }
    } catch (error) {
      console.error("Unlike error:", error);
      return { error: error.message };
    }
  }