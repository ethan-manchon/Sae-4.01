import { loadMe } from "../../lib/UserService";
import { useEffect, useState } from "react";

import React from "react";
import Button from "../../ui/button";
import Pdp from "../../ui/pdp";

interface Props {
  user: { pseudo: string; pdp: string } | null;
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
      <div className="fixed top-0 left-0 hidden h-screen w-64 flex-col border-r border-border bg-bg p-4 lg:flex">
        <Button
          link="/"
          variant="transparent"
          className="mb-6 flex items-center gap-2"
        >
          <img src={`http://localhost:8090/assets/twitter-logo.svg`} className="h-8 w-8" />
          <p className="text-2xl font-bold text-primary">Twitter</p>
        </Button>

        <div className="flex flex-col gap-4">
          <Pdp
            pdp={user?.pdp}
            pseudo={user?.pseudo}
            link={`/profil/${user?.pseudo}`}
          />
          <Button variant="transparent" link="/foryoupage">
            Pour moi
          </Button>
          {isAdmin && (
            <Button variant="transparent" link="/backoffice">
              Back Office
            </Button>
          )}
          <Button
            variant="transparent"
            link="/login"
            onClick={handleDisconnect}
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="fixed top-0 left-0 z-50 flex w-full items-center justify-between border-border bg-bg px-4 py-2 lg:hidden">
        <div className="flex items-center gap-2">
        <Button
          link="/"
          variant="transparent"
          className="mb-6 flex items-center gap-2"
        >
          <img src={`http://localhost:8090/assets/twitter-logo.svg`} className="h-8 w-8" />
          <p className="text-2xl font-bold text-primary">Twitter</p>
        </Button>
        </div>
        <Pdp
          pdp={user?.pdp}
          pseudo={user?.pseudo}
          link={`/profil/${user?.pseudo}`}
        />
      </div>

      <div className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-border bg-bg py-2 lg:hidden">
      <Button variant="transparent" link="/foryoupage">
            Pour moi
          </Button>
        {isAdmin && (
            <Button variant="transparent" link="/backoffice">
              Back Office
            </Button>
          )}
          <Button
            variant="transparent"
            link="/login"
            onClick={handleDisconnect}
          >
            Logout
          </Button>
      </div>
    </>
  );
}
