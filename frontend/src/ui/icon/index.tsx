import React from "react";
import Info from "../../ui/info";

interface IconProps {
  url?: string;
  className?: string;
}

export default function Icon({ className, url }: IconProps) {
  const icons = {
    undefined: `http://localhost:8090/assets/icon/undefined.webp`,
    default: `http://localhost:8090/assets/icon/devicon_default.svg`,
    facebook: `http://localhost:8090/assets/icon/devicon_facebook.svg`,
    github: `http://localhost:8090/assets/icon/devicon_github.svg`,
    linkedin: `http://localhost:8090/assets/icon/devicon_linkedin.svg`,
    instagram: `http://localhost:8090/assets/icon/devicon_instagram.svg`,
    wikipedia: `http://localhost:8090/assets/icon/devicon_wikipedia.svg`,
    google: `http://localhost:8090/assets/icon/devicon_google.svg`,
    youtube: `http://localhost:8090/assets/icon/devicon_youtube.svg`,
    twitch: `http://localhost:8090/assets/icon/devicon_twitch.svg`,
    unilim: `http://localhost:8090/assets/icon/devicon_unilim.svg`,
  };

  const found = url
    ? Object.keys(icons).find((key) => url.toLowerCase().includes(key))
    : undefined;
  const icon = found || "default";

  const media = icon.toLowerCase() as keyof typeof icons;
  const img = icons[media] ?? icons.default;

  return (
    <Info className="cursor-pointer" content={url}>
      <img
        className={`h-8 w-8 ${className}`}
        src={img}
        alt={"Icon de " + media}
      />
    </Info>
  );
}
