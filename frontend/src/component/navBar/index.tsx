import { loadMe } from "../../lib/loader"; 
import { useEffect, useState } from "react";

import React from "react";
import Button from "../../ui/button";
import Icon from "../../ui/icon";
import Content from "../../ui/content";
import Pdp from "../../ui/pdp";

interface Props {
  user: { pseudo: string, pdp: string} | null;
}

export default function NavBar({ user }: Props) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
      const checkAdmin = async () => {
          const user = await loadMe();
          if (user?.roles?.includes("ROLE_ADMIN")) {
              setIsAdmin(true);
          }
      };

      checkAdmin();
  }, []);

  const handleDisconnect = () => {
    localStorage.removeItem("token");
  };

  return (
    <>
      <div className="hidden md:flex fixed top-0 left-0 h-screen w-64 flex-col border-r border-border bg-bg p-4">
        <Button link="/" variant="transparent" className="flex items-center gap-2 mb-6">
          <Icon icon="logo" className="w-8 h-8" />
          <p className="text-2xl text-primary font-bold">Twitter</p>
        </Button>
  
        <div className="flex flex-col gap-4">
          <Pdp pdp={user?.pdp} pseudo={user?.pseudo} link={`/profil/${user?.pseudo}`} />
          <Button variant="transparent" link="/foryoupage">Pour moi</Button>
          {isAdmin && (
            <Button variant="transparent" link="/backoffice">Back Office</Button>
          )}
          <Button variant="transparent" link="/login" onClick={handleDisconnect}>Logout</Button>
        </div>
      </div>
  
      <div className="md:hidden fixed top-0 left-0 w-full bg-bg border-b border-border flex items-center justify-between px-4 py-2 z-50">
        <div className="flex items-center gap-2">
          <Icon icon="logo" className="w-6 h-6" />
          <p className="text-xl text-primary font-bold">Twitter</p>
        </div>
        <Pdp pdp={user?.pdp} pseudo={user?.pseudo} link={`/profil/${user?.pseudo}`} />
      </div>
  
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-bg border-t border-border flex justify-around items-center py-2 z-50">
        <Button variant="transparent" link="/">Home</Button>
        {isAdmin && (
          <Button variant="transparent" link="/backoffice">Admin</Button>
        )}
        <Button variant="transparent" onClick={handleDisconnect}>Logout</Button>
      </div>
    </>
  );
}