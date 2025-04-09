import React, { useEffect, useState } from "react";
import { loadMe } from "../lib/UserService";
import { searchPosts } from "../lib/PostService";
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

export default function Root() {
  const [user, setUser] = useState<User | null>(null);
  const [reset, setReset] = useState(false);
  const [search, setSearch] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDate, setFilterDate] = useState("");
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
      <Publish OnClick={triggerRefresh} />        
      <div className="w-full max-w-[600px] mt-8 border border-border rounded-lg bg-white shadow-md p-4">
        
        <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
          <Search
            search={search}
            setSearch={setSearch}
            filterUser={filterUser}
            setFilterUser={setFilterUser}
            filterType={filterType}
            setFilterType={setFilterType}
            filterDate={filterDate}
            setFilterDate={setFilterDate}
          />
  
          <Button
            onClick={triggerRefresh}
            className="self-end md:self-auto w-full md:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded shadow"
          >
            🔄 <span className="hidden md:inline">Rafraîchir</span>
          </Button>
        </div>
        </div>

        <section className="space-y-4">
          <Feeds
            refresh={reset}
            loader={(page) =>
              searchPosts({
                page,
                query: search,
                user: filterUser,
                type: filterType,
                date: filterDate,
              })
            }
          />
        </section>
    </main>
  </div>
  
  );
}
