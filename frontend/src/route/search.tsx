import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadMe } from "../lib/UserService";
import { searchByHashtag } from "../lib/PostService";
import NavBar from "../component/navBar";
import Publish from "../component/publish";
import Feeds from "../component/feed";
import Button from "../ui/button";

interface User {
  refresh: boolean;
  pseudo: string;
  pdp: string;
}

export default function HashtagFeed() {
  const { tag } = useParams();

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
    <div className="flex min-h-screen flex-col bg-white text-element lg:flex-row">
      <NavBar user={user} />

      <main className="flex flex-1 flex-col items-center px-4 pt-[4.5rem] lg:ml-64 lg:pt-8">
        <div className="w-full max-w-[600px]">
          <section className="mb-6">
            <Publish OnClick={triggerRefresh} />
          </section>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-primary">
              Résultats pour <span className="text-primary-hover">#{tag}</span>
            </h2>
            <Button onClick={triggerRefresh}>
              <span>🔄</span>
              <span className="hidden lg:inline">Rafraîchir</span>
            </Button>
          </div>

          <section className="w-full space-y-4">
            <Feeds
              refresh={reset}
              loader={(page) =>
                searchByHashtag(tag, page).then((result) =>
                  "error" in result ? { posts: [], next_page: null } : result,
                )
              }
              subscribe={false}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
