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


