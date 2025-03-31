const API_BASE = "http://localhost:8080/api/subscribes";

function getTokenHeaders() {
  const token = localStorage.getItem("token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    : null;
}

export async function loadFollowers(userId) {
  const headers = getTokenHeaders();
  if (!headers) return [];

  try {
    const response = await fetch(`${API_BASE}/${userId}`, { headers });
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
    const response = await fetch(`${API_BASE}/${userId}`, {
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
    const response = await fetch(`${API_BASE}/${userId}`, {
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
    const response = await fetch(`${API_BASE}/${userId}`, { headers });
    if (!response.ok) throw new Error("Failed to fetch followers");
    const followers = await response.json();
    const meResponse = await fetch(`http://localhost:8080/api/users`, { headers });
    if (!meResponse.ok) throw new Error("Failed to fetch current user");
    const me = await meResponse.json();

    return followers.some(f => f.id === me.id);
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
}

export async function loadSubscriptions(userId) {
  const headers = getTokenHeaders();
  if (!headers) return [];

  try {
    const response = await fetch(`${API_BASE}/${userId}`, { headers });
    if (!response.ok) throw new Error("Failed to load subscriptions");
    return await response.json();
  } catch (error) {
    console.error("Error loading subscriptions:", error);
    return [];
  }
}