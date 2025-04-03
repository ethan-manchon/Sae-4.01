import React, { useEffect, useState } from "react";
import { loadMe } from "../lib/UserService";
import UsersList from "../component/adminUsers";
import AdminPosts from "../component/adminPosts";
import NavBar from "../component/navBar";

export default function BackOffice() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("posts");

  useEffect(() => {
    loadMe().then(setUser);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <NavBar user={user} />
      <div className="pt-20 md:pt-0 md:pl-64 flex-1 w-full overflow-hidden">
        <div className="h-full flex flex-col">
          <header className="border-b border-border bg-white p-4 shadow-sm sticky top-0 z-20">
            <div className="w-full max-w-5xl mx-auto flex flex-wrap gap-2 sm:gap-4">
              <button
                onClick={() => setTab("posts")}
                className={`text-sm font-medium px-4 py-2 rounded-full transition-all ${
                  tab === "posts" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => setTab("users")}
                className={`text-sm font-medium px-4 py-2 rounded-full transition-all ${
                  tab === "users" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                Utilisateurs
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-gray-50">
            {tab === "posts" && <AdminPosts />}
            {tab === "users" && <UsersList />}
          </main>
        </div>
      </div>
    </div>
  );
}