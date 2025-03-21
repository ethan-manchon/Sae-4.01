export async function loadPosts(page) {
  try {
      const response = await fetch(`http://localhost:8080/posts?page=${page}`);
      if (!response.ok) {
          throw new Error("Failed to load posts");
      }
      return await response.json();
  } catch (error) {
      console.error(error);
      return { posts: [], previous_page: null, next_page: null, error: error.message };
  }
}

export async function loadUsers() {
    try {
        const response = await fetch("http://localhost:8080/users");
        if (!response.ok) {
            throw new Error("Failed to load users");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return { users: [], error: error.message };
    }
}