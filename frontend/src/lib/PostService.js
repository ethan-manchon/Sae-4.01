const API_URL = import.meta.env.VITE_API_URL;
const API_BASE = API_URL + "/api/posts";
const API_ADMIN = API_URL + "/admin/posts";

function getTokenHeaders() {
  const token = localStorage.getItem("token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
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
    return {
      posts: [],
      previous_page: null,
      next_page: null,
      error: error.message,
    };
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
    console.log(data);
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

export async function togglePin(postId, pin) {
  console.log("Toggling pin for post:", postId, pin);
  const headers = getTokenHeaders();
  if (!headers) return { success: false, error: "Unauthorized" };
  const body = new URLSearchParams();
  body.append("pin", pin.toString()); 
  try {
    const response = await fetch(`${API_BASE}/${postId}`, {
      method: "POST", 
      headers: { 
        ...headers, 
        Accept: "application/json", 
        "Content-Type": "application/x-www-form-urlencoded"  
      },
      body: body.toString(),
    });

    if (!response.ok) throw new Error("Failed to toggle pin", error);
    const data = await response.json();
    return { success: true, pinned: data.pin };
  } catch (error) {
    console.error("Error toggling pin:", error);
    return { success: false, error: error.message };
  }
}

export async function loadPosts(page = 1, subscribe = false, userId) {
  const headers = getTokenHeaders();
  if (!headers) return { posts: [], error: "Unauthorized" };

  let url = `${API_BASE}?page=${page}&subscribe=${subscribe}`;
  if (userId) {
    url += `&userId=${userId}`;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers
    });
    if (!response.ok) throw new Error("Failed to load posts");

    const result = await response.json();

    return {
      posts: result.items,
      next_page: result.items.length === 10 ? page + 1 : null
    };
  } catch (error) {
    console.error("Error loading posts:", error);
    return { posts: [], next_page: null, error: error.message };
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

export async function searchByHashtag(tag, page = 1) {
  console.log("Tag:", tag);
  console.log("Page:", page);
  const headers = getTokenHeaders();
  if (!headers) return { posts: [], error: "Unauthorized" };

  try {
    const response = await fetch(`${API_BASE}/hashtag/${tag}?page=${page}`, {
      method: "GET",
      headers
    });
    if (!response.ok) throw new Error("Failed to search posts by hashtag");

    const result = await response.json();
    
    return {
      posts: result.items || [],
      next_page: result.items && result.items.length === 10 ? page + 1 : null
    };
  } catch (error) {
    console.error("Error searching posts by hashtag:", error);
    return { posts: [], next_page: null, error: error.message };
  }
}

export async function searchPosts({
  page = 1,
  query = "",
  user = "",
  type = "",
  date = "",
}) {
  const params = new URLSearchParams({ page: String(page) });

  if (query?.trim()) params.append("query", query.trim());
  if (user) params.append("user", user);
  if (type) params.append("type", type);
  if (date) params.append("date", date);

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/search?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!res.ok) throw new Error("Erreur lors de la recherche des posts");

    const result = await res.json();

    return {
      posts: result.items || [],
      next_page: result.items.length === 10 ? page + 1 : null,
    };
  } catch (e) {
    console.error("Erreur searchPosts :", e.message);
    return { posts: [], next_page: null, error: e.message };
  }
}

