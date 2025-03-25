import React, { useEffect, useState } from "react";
import { loadMe } from "../lib/loader";
import NavBar from "../component/navBar";
import Publish from "../component/publish";
import Feeds from "../component/feed";

export default function Root() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadMe().then(setUser);
  }, []);

    return (
        <div className="flex flex-col md:flex-row md:h-screen">
            <NavBar user={user} />
            <div className="pt-28 md:pt-0 md:pl-64 w-full">
            <Publish onTweetSent={(tweet) => console.log("Tweet sent:", tweet)} />
            <Feeds />
            </div>
        </div>
    );
}
