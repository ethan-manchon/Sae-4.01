import React, { useEffect, useState }from "react";
import { isUserFollowed } from "../../lib/SubscribeService";
import { isUserBlocked } from "../../lib/BlockedService";
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

  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    async function fetchFollowStatus() {
      if (type !== "me") {
        const followed = await isUserFollowed(user.id);
        setIsFollowing(followed);
      }
    }
    fetchFollowStatus();
  }, [user.id]);

  useEffect(() => {
    async function fetchBlockStatus() {
      if (type !== "me") {
        const blocked = await isUserBlocked(user.id);
        setIsBlocked(blocked);
      }
    }
    fetchBlockStatus();
  }, [user.id]);

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

  const bannerImage = "/assets/banner/"+user.banniere || "/assets/banner/default.webp";

  const [bioState, setBioState] = useState(!!user.bio);
  const [locateState, setLocateState] = useState(!!user.locate);

  useEffect(() => {
    setBioState(!!user.bio);
  }, [user.bio]);

 
  return (
<div className="w-full bg-white border-b border-border">
  <div className="relative">
    <img
      src={`http://localhost:8080/${bannerImage}`}
      alt="Bannière"
      className="w-full h-40 object-cover"
    />

    <div className="absolute -bottom-4 left-6">
      <Pdp pdp={user.pdp} className="w-24 h-24 rounded-full border-4 border-white shadow-lg" />
    </div>
  </div>

  <div className="pt-16 px-6 pb-6 max-w-[600px] mx-auto">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
      <h2 className="text-xl font-semibold text-primary">{user.pseudo}</h2>
      {user.url && (
        <a href={user.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline" >
          <Icon url={user.url} className="w-6 h-6" />
        </a>
      )}
    </div>

    {bioState && (
      <p className="text-sm text-fg mb-2">{user.bio}</p>
    )}

    {locateState && (
      <p className="text-sm text-fg mb-4 flex items-center justify-end gap-1">
        {user.locate}
      </p>
    )}

    <div className="flex justify-end">
      {type === "me" ? (
      <Settings />
      ) : (
        <>
        <Subscribe
          isFollowing={isFollowing}
          userId={user.id}
          setIsFollowing={setIsFollowing}
          />
        <Block
        isBlocked={isBlocked}
        userId={user.id}
        setIsBlocked={setIsBlocked}/>
        
      </>
  )}
    </div>
  </div>
</div>
  );

}