import React from "react";
import Content from "../content";
import Button from "../button";

interface PictureProps {
  pdp?: any;
  pseudo?: string;
  link?: string;
  className?: string;
}

export default function Picture({
  pdp,
  pseudo,
  link,
  className,
}: PictureProps) {
  const profilePicture = pdp || "/assets/pdp/default.webp";

  return (
    <Button
      variant="transparent"
      link={link}
      className={`} flex h-12 items-center gap-2`}
    >
      <img
        src={`http://localhost:8080/${profilePicture}`}
        alt="Photo de profil"
        className={`h-12 w-12 rounded-full border-2 shadow-md ${className}`}
        loading="lazy"
      />
      <Content>{pseudo}</Content>
    </Button>
  );
}
