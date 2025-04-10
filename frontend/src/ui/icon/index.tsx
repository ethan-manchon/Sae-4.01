import React from "react";
import Info from "../../ui/info";

interface IconProps {
  url?: string;
  className?: string;
}

export default function Icon({ className, url }: IconProps) {
  const icons = {
    undefined: `${(import.meta as any).env.BASE_URL}/assets/icon/undefined.webp`,
    default: `${(import.meta as any).env.BASE_URL}/assets/icon/devicon_default.svg`,
    facebook: `${(import.meta as any).env.BASE_URL}/assets/icon/devicon_facebook.svg`,
    github: `${(import.meta as any).env.BASE_URL}/assets/icon/devicon_github.svg`,
    linkedin: `${(import.meta as any).env.BASE_URL}/assets/icon/devicon_linkedin.svg`,
    instagram: `${(import.meta as any).env.BASE_URL}/assets/icon/devicon_instagram.svg`,
    wikipedia: `${(import.meta as any).env.BASE_URL}/assets/icon/devicon_wikipedia.svg`,
    google: `${(import.meta as any).env.BASE_URL}/assets/icon/devicon_google.svg`,
    youtube: `${(import.meta as any).env.BASE_URL}/assets/icon/devicon_youtube.svg`,
    twitch: `${(import.meta as any).env.BASE_URL}/assets/icon/devicon_twitch.svg`,
    unilim: `${(import.meta as any).env.BASE_URL}/assets/icon/devicon_unilim.svg`,
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
