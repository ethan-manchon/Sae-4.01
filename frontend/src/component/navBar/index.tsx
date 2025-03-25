import { loadMe } from "../../lib/loader"; 
import { useEffect, useState } from "react";

import React from "react";
import Button from "../../ui/button";
import Icon from "../../ui/icon";
import Content from "../../ui/content";

interface Props {
  user: { pseudo: string } | null;
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
  return (
    <div className="flex flex-col md:flex-row md:h-screen">
      <div className="flex justify-between items-center p-4 border-border w-full bg-bg fixed md:flex-col md:justify-start md:items-start md:w-64 md:h-screen md:border-r md:border-b-0">
        <div className="flex justify-center items-center flex-row w-full">
          <Icon url="logo" className="w-8 h-8" />
          <p className="text-2xl text-primary font-bold">Twitter</p>
        </div>

        <div className="flex gap-4 md:flex-col mt-4">
          {!user ? null : <Content>{`Welcome, ${user.pseudo}`}</Content>}
          <Button variant="transparent" link="/">Home</Button>
          <Button variant="transparent">Profile</Button>
          {isAdmin && (
            <Button variant="transparent" link="/backoffice">Back Office</Button>
                )}
          <Button variant="transparent" link="/login">Logout</Button>
        </div>
      </div>
    </div>
  );
}