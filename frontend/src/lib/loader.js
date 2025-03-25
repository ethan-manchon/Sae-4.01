export async function loadPosts(page) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`http://localhost:8080/api/posts?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
      if (!response.ok) {
          throw new Error("Failed to load posts");
      }
      return await response.json();
  } catch (error) {
      console.error(error);
      return { posts: [], previous_page: null, next_page: null, error: error.message };
  }
}

export async function loadUsers(page) {
  const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8080/admin/users?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });        
        if (!response.ok) {
            throw new Error("Failed to load users");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return { users: [], error: error.message };
    }
}
export async function loadMe() {
    const token = localStorage.getItem("token");
    console.log("Token envoyé :", token); // ⬅️ ici
  
    if (!token) return null;
  
    try {
      const response = await fetch("http://localhost:8080/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
  
      if (!response.ok) {
        throw new Error("Unauthorized");
      }
  
      const user = await response.json();
      return user;
    } catch (error) {
      console.error("Error loading user:", error);
      return null;
    }
  }