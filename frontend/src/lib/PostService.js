const API_BASE = "http://localhost:8080/api/posts";
const API_ADMIN = "http://localhost:8080/admin/posts";

function getTokenHeaders() {
  const token = localStorage.getItem("token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    : null;
}

export async function adminLoadPosts(page = 1) {
  const headers = getTokenHeaders();
  if (!headers) return { posts: [], error: "Unauthorized" };

  try {
    const response = await fetch(`${API_ADMIN}?page=${page}`, { headers });
    if (!response.ok) throw new Error("Failed to load posts");
    return await response.json();
  } catch (error) {
    console.error("Error loading admin posts:", error);
    return { posts: [], previous_page: null, next_page: null, error: error.message };
  }
}

export async function adminEditPost(postId, data) {
  const tokenHeaders = getTokenHeaders();
  if (!tokenHeaders) return { error: "Unauthorized" };

  let body, headers;
  if (data instanceof FormData) {
    data.append("_method", "PATCH");
    body = data;
    headers = { ...tokenHeaders };
    delete headers["Content-Type"];
  } else {
    body = JSON.stringify({ ...data, _method: "PATCH" });
    headers = tokenHeaders;
  }

  try {
    const response = await fetch(`${API_ADMIN}/${postId}`, {
      method: "POST",
      headers,
      body,
    });
    if (!response.ok) throw new Error("Failed to patch post");
    return await response.json();
  } catch (error) {
    console.error("Admin patch post error:", error);
    return { error: error.message };
  }
}

export async function adminDeletePost(postId) {
  const tokenHeaders = getTokenHeaders();
  if (!tokenHeaders) return { error: "Unauthorized" };

  try {
    const response = await fetch(`${API_ADMIN}/${postId}`, {
      method: "DELETE",
      headers: tokenHeaders,
    });
    if (!response.ok) throw new Error("Failed to delete post");
    return await response.json();
  } catch (error) {
    console.error("Admin delete post error:", error);
    return { error: error.message };
  }
}



export async function loadPosts(page = 1, subscribe) {
  const headers = getTokenHeaders();
  if (!headers) return { posts: [], error: "Unauthorized" };
  const body = { 'subscribe': subscribe };

  try {
    const response = await fetch(`${API_BASE}?page=${page}&subscribe=${subscribe}`, { method: 'GET', headers});
    if (!response.ok) throw new Error("Failed to load posts");
    return await response.json();
  } catch (error) {
    console.error("Error loading posts:", error);
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
  const tokenHeaders = getTokenHeaders();
  if (!tokenHeaders) return { error: "Unauthorized" };

  let body, headers;
  if (data instanceof FormData) {
    data.append("_method", "PATCH");
    body = data;
    headers = { ...tokenHeaders };
    delete headers["Content-Type"];
  } else {
    body = JSON.stringify(data);
    headers = tokenHeaders;
  }

  try {
    const response = await fetch(`${API_BASE}/${postId}`, {
      method: "POST",
      headers,
      body,
    });

    if (!response.ok) throw new Error("Failed to patch post");
    return await response.json();
  } catch (error) {
    console.error("Patch post error:", error);
    return { error: error.message };
  }
}

export async function publishPost(data) {
  const tokenHeaders = getTokenHeaders();
  if (!tokenHeaders) return { error: "Unauthorized" };

  let body, headers;
  // Si data est un FormData, on laisse le navigateur gérer le header Content-Type
  if (data instanceof FormData) {
    body = data;
    headers = { ...tokenHeaders };
    delete headers["Content-Type"];
  } else {
    body = JSON.stringify({ content: data });
    headers = tokenHeaders;
  }

  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers,
      body,
    });
    if (!response.ok) throw new Error("Failed to publish post");
    return await response.json();
  } catch (error) {
    console.error("Error publishing post:", error);
    return { error: error.message };
  }
}