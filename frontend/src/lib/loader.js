const API_BASE = "http://localhost:8080/api";
const ADMIN_BASE = "http://localhost:8080/admin";

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
    const response = await fetch(`${API_BASE}/posts?page=${page}`, { headers });
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
    const response = await fetch(`${API_BASE}/feed?page=${page}`, { headers });
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
    const response = await fetch(`${API_BASE}/posts/${postId}`, {
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

export async function loadUsers(page = 1) {
  const headers = getTokenHeaders();
  if (!headers) return { users: [], error: "Unauthorized" };

  try {
    const response = await fetch(`${ADMIN_BASE}/users?page=${page}`, { headers });
    if (!response.ok) throw new Error("Failed to load users");
    return await response.json();
  } catch (error) {
    console.error("Error loading users:", error);
    return { users: [], error: error.message };
  }
}

export async function loadMe() {
  const headers = getTokenHeaders();
  if (!headers) return null;

  try {
    const response = await fetch(`${API_BASE}/me`, { headers });
    if (!response.ok) throw new Error("Unauthorized");
    return await response.json();
  } catch (error) {
    console.error("Error loading user:", error);
    return null;
  }
}

export async function loadProfil(pseudo) {
  const headers = getTokenHeaders();
  if (!headers) return null;

  try {
    const response = await fetch(`${API_BASE}/profil/${pseudo}`, { headers });
    if (!response.ok) throw new Error("Unauthorized");
    return await response.json();
  } catch (error) {
    console.error("Error loading profile:", error);
    return null;
  }
}

export async function loadFollowers(userId) {
  const headers = getTokenHeaders();
  if (!headers) return [];

  try {
    const response = await fetch(`${API_BASE}/user/${userId}/followers`, { headers });
    if (!response.ok) throw new Error("Failed to load followers");
    return await response.json();
  } catch (error) {
    console.error("Error loading followers:", error);
    return [];
  }
}
export async function subscribeToUser(userId) {
  const headers = getTokenHeaders();
  if (!headers) return { error: "Unauthorized" };

  try {
    const response = await fetch(`${API_BASE}/subscribe/${userId}`, {
      method: "POST",
      headers,
    });
    return await response.json();
  } catch (error) {
    console.error("Subscribe error:", error);
    return { error: error.message };
  }
}

export async function unsubscribeFromUser(userId) {
  const headers = getTokenHeaders();
  if (!headers) return { error: "Unauthorized" };

  try {
    const response = await fetch(`${API_BASE}/subscribe/${userId}`, {
      method: "DELETE",
      headers,
    });
    return await response.json();
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return { error: error.message };
  }
}

export async function isUserFollowed(userId) {
  const headers = getTokenHeaders();
  if (!headers) return false;

  try {
    const response = await fetch(`${API_BASE}/user/${userId}/followers`, { headers });
    if (!response.ok) throw new Error("Failed to fetch followers");
    const followers = await response.json();
    const meResponse = await fetch(`${API_BASE}/me`, { headers });
    if (!meResponse.ok) throw new Error("Failed to fetch current user");
    const me = await meResponse.json();

    return followers.some(f => f.id === me.id);
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
}

export async function updateRefreshSetting(userId, refresh) {
  const headers = getTokenHeaders();
  if (!headers) return { error: "Unauthorized" };

  try {
    const response = await fetch(`${API_BASE}/users/${userId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) throw new Error("Failed to update refresh setting");

    return await response.json();
  } catch (error) {
    console.error("Error updating refresh:", error);
    return { error: error.message };
  }
}

export async function loadLikes(postId) {
  const headers = getTokenHeaders();
  if (!headers) return [];

  try {
    const response = await fetch(`${API_BASE}/likes`, { headers });
    if (!response.ok) throw new Error("Failed to load likes");
    const allLikes = await response.json();
    return allLikes.filter(like => like.post === postId);
  } catch (error) {
    console.error("Error loading likes:", error);
    return [];
  }
}

export async function likePost(postId) {
  const token = localStorage.getItem("token");
  if (!token) return { error: "Unauthorized" };

  const headers = {
    Authorization: `Bearer ${token}`
  };

  const formData = new FormData();
  formData.append("post_id", postId);

  try {
    const response = await fetch(`${API_BASE}/likes`, {
      method: "POST",
      headers,
      body: formData,
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
    const response = await fetch(`${API_BASE}/likes/${likeId}`, {
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
