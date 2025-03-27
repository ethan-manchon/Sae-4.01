import React, { useEffect, useState } from "react";
import { loadMe, loadFeedPosts } from "../lib/loader";
import NavBar from "../component/navBar";
import Publish from "../component/publish";
import Feeds from "../component/feed";
import Button from "../ui/button";
import Content from "../ui/content";

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
<div className="min-h-screen bg-bg text-element flex flex-col md:flex-row">
  <NavBar user={user} />

  <main className="flex-1 md:ml-64 flex flex-col items-center pt-[4.5rem] md:pt-8 px-4">
    <div className="w-full max-w-[600px]">
      <section className="mb-6">
        <Publish OnClick={triggerRefresh} />
      </section>

      <div className="flex justify-between mb-4">
        <Content size="xl">Vos abonnements</Content>
        <Button onClick={triggerRefresh}>
          <span>🔄</span>
          <span className="hidden md:inline">Rafraîchir</span>
        </Button>
      </div>

      <section className="space-y-4">
      <Feeds refresh={reset} loader={loadFeedPosts} />
      </section>
    </div>
  </main>
</div>

  );
  
  
}
