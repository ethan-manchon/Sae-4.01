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
    <div className="flex min-h-screen flex-col bg-white text-element lg:flex-row">
      <NavBar user={user} />

      <main className="flex flex-1 flex-col items-center px-4 pt-[4.5rem] lg:ml-64 lg:pt-8">
        <Publish OnClick={triggerRefresh} />
        <div className="mt-8 w-full max-w-[600px] rounded-lg border border-border bg-white p-4 shadow-md">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
              className="flex w-full items-center justify-center gap-2 self-end rounded bg-primary px-4 py-2 font-semibold text-white shadow hover:bg-primary-hover lg:w-auto lg:self-auto"
            >
              🔄 <span className="hidden lg:inline">Rafraîchir</span>
            </Button>
          </div>
        </div>

        <section className="w-full space-y-4">
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
