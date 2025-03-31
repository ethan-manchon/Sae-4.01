const API_BASE = "http://localhost:8080/api/posts";

function getTokenHeaders() {
  const token = localStorage.getItem("token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    : null;
}

export async function loadPosts(page = 1) {
  const headers = getTokenHeaders();
  if (!headers) return { posts: [], error: "Unauthorized" };

  try {
    const response = await fetch(`${API_BASE}?page=${page}`, { headers });
    if (!response.ok) throw new Error("Failed to load posts");
    return await response.json();
  } catch (error) {
    console.error("Error loading posts:", error);
    return { posts: [], previous_page: null, next_page: null, error: error.message };
  }
}

export async function loadFeedPosts(page = 1) {
  const headers = getTokenHeaders();
  if (!headers) return { posts: [], error: "Unauthorized" };

  try {
    const response = await fetch(`http://localhost:8080/api/feed?page=${page}`, { headers });
    if (!response.ok) throw new Error("Failed to load feed posts");
    return await response.json();
  } catch (error) {
    console.error("Error loading feed posts:", error);
    return { posts: [], previous_page: null, next_page: null, error: error.message };
  }
}

export async function deletePost(postId) {
  const headers = getTokenHeaders();
  if (!headers) return { error: "Unauthorized" };

  try {
    const response = await fetch(`${API_BASE}/${postId}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) throw new Error("Failed to delete post");
    return await response.json();
  } catch (error) {
    console.error("Delete post error:", error);
    return { error: error.message };
  }
}

export async function editPost(postId, data) {
  const headers = getTokenHeaders();
  if (!headers) return { error: "Unauthorized" };

  try {
    const response = await fetch(`${API_BASE}/${postId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Failed to patch post");
    return await response.json();
  } catch (error) {
    console.error("Patch post error:", error);
    return { error: error.message };
  }
}