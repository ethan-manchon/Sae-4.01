import React from "react";
import { useEffect, useState } from "react";
import { loadMe } from "../lib/loader";
import Button from "../ui/button";
import UsersList from "../component/usersList";
import NavBar from "../component/navBar";

export default function BackOffice() {
      const [user, setUser] = useState(null);
    
      useEffect(() => {
        loadMe().then(setUser);
      }, []);
    return (
            <div className="flex flex-col md:flex-row md:h-screen">
                <NavBar user={user} />
                <div className="pt-28 md:pt-0 md:pl-64 w-full">
                    <UsersList />
                </div>
                
            </div>
    );
}