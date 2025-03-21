import React, { useState } from "react";

import Feeds from "../component/feed/index";
import Publish from "../component/publish";
import NavBar from "../component/navBar";

export default function Root() {
    
    return (
        <div className="flex flex-col md:flex-row md:h-screen">
            <NavBar />
            <div className="w-full">
            <Publish onTweetSent={(tweet) => console.log("Tweet sent:", tweet)} />
            <Feeds />
            </div>
        </div>
    );
}
