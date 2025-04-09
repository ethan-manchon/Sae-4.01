import React, { useEffect, useState } from "react";
import { loadMe } from "../lib/UserService";
import { loadPosts } from "../lib/PostService";
import NavBar from "../component/navBar";
import Publish from "../component/publish";
import Feeds from "../component/feed";
import Button from "../ui/button";
import Search from "../ui/search";

interface User {
  refresh: boolean;
  pseudo: string;
  pdp: string;
}

export default function Feed() {
  const [user, setUser] = useState<User | null>(null);
  const [reset, setReset] = useState(false);

  useEffect(() => {
    loadMe().then(setUser);
  }, []);

  useEffect(() => {
    if (user?.refresh) {
      const interval = setInterval(
        () => {
          console.log("Auto-refresh because user.refresh === true");
          setReset((prev) => !prev);
        },
        1000 * 60 * 3,
      );

      return () => clearInterval(interval);
    }
  }, [user]);

  const triggerRefresh = () => {
    setReset((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-element md:flex-row">
      <NavBar user={user} />

      <main className="flex flex-1 flex-col items-center px-4 pt-[4.5rem] md:ml-64 md:pt-8">
        <div className="w-full max-w-[600px]">
          <section className="mb-6">
            <Publish OnClick={triggerRefresh} />
          </section>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-primary">
              Fil d'actualité
            </h2>
            <Button onClick={triggerRefresh}>
              <span>🔄</span>
              <span className="hidden md:inline">Rafraîchir</span>
            </Button>
          </div>

          <section className="space-y-4">

            <Feeds
              refresh={reset}
              loader={(page, subscribe) =>
                loadPosts(page, subscribe).then((result) =>
                  "error" in result ? { posts: [], next_page: null } : result,
                )
              }
              subscribe={true}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
