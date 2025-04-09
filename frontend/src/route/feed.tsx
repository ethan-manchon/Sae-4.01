import React, { useEffect, useState } from "react";
import { loadMe } from "../lib/UserService";
import { loadPosts } from "../lib/PostService";
import NavBar from "../component/navBar";
import Publish from "../component/publish";
import Feeds from "../component/feed";
import Button from "../ui/button";
import Content from "../ui/content";

interface User {
  refresh: number;
  pseudo: string;
  pdp: string;
}

export default function Feed() {
  const [user, setUser] = useState<User | null>(null);
  const [refreshFeed, setRefreshFeed] = useState<boolean>(false);

  useEffect(() => {
    loadMe().then(setUser);
  }, []);

  useEffect(() => {
    if (user?.refresh) {
      const interval = setInterval(() => {
        console.log("Auto-refresh because user.refresh === true");
        setRefreshFeed(prev => !prev);
      }, 1000 * 60 * 3); 

      return () => clearInterval(interval);
    }
  }, [user]);


  const triggerRefresh = () => {
    setRefreshFeed(prev => !prev);
  };

  return (
<div className="min-h-screen bg-bg text-element flex flex-col md:flex-row">
  <NavBar user={user} />

  <main className="flex-1 md:ml-64 flex flex-col items-center pt-16 md:pt-8 px-4">
    <div className="w-full">
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
      <Feeds loader={loadPosts} subscribe={true} />
      </section>
    </div>
  </main>
</div>

  );
  
  
}
