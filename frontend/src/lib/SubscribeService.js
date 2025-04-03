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

export async function isUserFollowed(targetUserId) {
    const headers = getTokenHeaders();
    if (!headers) return false;

    try {
        const response = await fetch(`${API_BASE}/${targetUserId}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch blocked users");
        const data = await response.json();
        // console.log("Fetched data:", data);
        return data;
    } catch (error) {
        console.error("Error checking block status:", error);
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