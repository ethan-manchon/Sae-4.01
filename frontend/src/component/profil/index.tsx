import React, { useEffect, useState } from "react";
import Settings from "../settings/";
import Icon from "../../ui/icon";
import Pdp from "../../ui/pdp";
import Subscribe from "../../ui/subscribe";
import Block from "../../ui/blocked";

interface UserProps {
  user: {
    id: number;
    pdp: any;
    pseudo: string;
    bio: string;
    banniere: string;
    locate: string;
    url: string;
  };
  type: any;
}

export default function ProfilComponent({ user, type }: UserProps) {
  if (user.bio === undefined) {
    return <div></div>;
  }
  if (user.banniere === undefined) {
    return <div>Default</div>;
  }
  if (user.locate === undefined) {
    return <div>Non spécifié</div>;
  }
  if (user.url === undefined) {
    return <div>Default</div>;
  }

  let bannerImage ;
  if (user.banniere === null || user.banniere === "" || user.banniere === undefined) {
    bannerImage = "/assets/banner/default.webp"
  } else {
    bannerImage = "/assets/banner/" + user.banniere
  }

  const [bioState, setBioState] = useState(!!user.bio);
  const [locateState, setLocateState] = useState(!!user.locate);

  useEffect(() => {
    setBioState(!!user.bio);
  }, [user.bio]);
  useEffect(() => {
    setLocateState(!!user.locate);
  }, [user.locate]);

  return (
    <div className="w-full border-b border-border bg-white">
      <div className="relative">
        <img
          src={`http://localhost:8080/${bannerImage}`}
          alt="Bannière"
          className="h-40 w-full object-cover"
        />

        <div className="absolute -bottom-4 left-6">
          <Pdp
            pdp={user.pdp}
            className="h-24 w-24 rounded-full border-4 bg-white shadow-lg"
          />
        </div>
      </div>

      <div className="mx-auto max-w-[600px] px-6 pt-16 pb-6">
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold text-primary">{user.pseudo}</h2>
          {user.url && (
            <a
              href={user.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <Icon url={user.url} className="h-6 w-6" />
            </a>
          )}
        </div>

        {bioState && <p className="mb-2 text-sm text-fg">{user.bio}</p>}

        {locateState && (
          <p className="mb-4 flex items-center justify-end gap-1 text-sm text-fg">
            {user.locate}
          </p>
        )}

        <div className="flex justify-end">
          {type === "me" ? (
            <Settings />
          ) : (
            <>
              <Subscribe userId={user.id} />
              <Block userId={user.id} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
