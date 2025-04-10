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
    <div className="flex h-screen flex-col">
      <NavBar user={user} />
      <div className="w-full flex-1 overflow-hidden pt-20 lg:pt-0 lg:pl-64">
        <div className="flex h-full flex-col">
          <header className="sticky top-0 z-20 border-b border-border bg-white p-4 shadow-sm">
            <div className="mx-auto flex w-full max-w-5xl flex-wrap gap-2 sm:gap-4">
              <button
                onClick={() => setTab("posts")}
                className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  tab === "posts"
                    ? "bg-grey-very-light text-primary"
                    : "text-element hover:bg-grey-very-light hover:text-primary"
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => setTab("users")}
                className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  tab === "users"
                    ? "bg-grey-very-light text-primary"
                    : "text-element hover:bg-grey-very-light hover:text-primary"
                }`}
              >
                Utilisateurs
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-grey-very-light p-4">
            {tab === "posts" && <AdminPosts />}
            {tab === "users" && <UsersList />}
          </main>
        </div>
      </div>
    </div>
  );
}
