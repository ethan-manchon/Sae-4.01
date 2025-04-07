import React, { useEffect, useState } from "react";
import { loadMe } from "../lib/UserService";
import { loadPosts } from "../lib/PostService";
import NavBar from "../component/navBar";
import Publish from "../component/publish";
import Feeds from "../component/feed";
import Button from "../ui/button";

interface User {
  refresh: boolean;
  pseudo: string;
  pdp: string;
}

export default function Root() {
  const [user, setUser] = useState<User | null>(null);
  const [reset, setReset] = useState(false);

  useEffect(() => {
    loadMe().then(setUser);
  }, []);

  useEffect(() => {
    if (user?.refresh) {
      const interval = setInterval(() => {
        console.log("Auto-refresh because user.refresh === true");
        setReset((prev) => !prev);
      }, 1000 * 60 * 3); 

      return () => clearInterval(interval);
    }
  }, [user]);


  const triggerRefresh = () => {
    setReset((prev) => !prev);
  };

  return (
<div className="min-h-screen bg-white text-element flex flex-col md:flex-row">
  <NavBar user={user} />

  <main className="flex-1 md:ml-64 flex flex-col items-center pt-[4.5rem] md:pt-8 px-4">
    <div className="w-full max-w-[600px]">
      <section className="mb-6">
        <Publish OnClick={triggerRefresh} />
      </section>

      <div className="flex justify-end mb-4">
        <Button onClick={triggerRefresh}>
          <span>🔄</span>
          <span className="hidden md:inline">Rafraîchir</span>
        </Button>
      </div>

      <section className="space-y-4">
      <Feeds refresh={reset} loader={loadPosts} subscribe={false} />
      </section>
    </div>
  </main>
</div>

  );
  
  
}
