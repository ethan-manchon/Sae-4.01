import React from "react";
import Info from "../../ui/info";

interface IconProps {
    icon: string;
    url?: string;
    className?: string;
}

export default function Icon({ icon, className, url }: IconProps) {
    const icons = {
        logo: "/assets/twitter-logo.svg",
        undefined: "/assets/icon/undefined.webp",
        default: "/assets/icon/devicon_default.svg",
        facebook: "/assets/icon/devicon_facebook.svg",
        github: "/assets/icon/devicon_github.svg",
        linkedin: "/assets/icon/devicon_linkedin.svg",
        instagram: "/assets/icon/devicon_instagram.svg",
        wikipedia: "/assets/icon/devicon_wikipedia.svg",
        google: "/assets/icon/devicon_google.svg",
        youtube: "/assets/icon/devicon_youtube.svg",
        twitch: "/assets/icon/devicon_twitch.svg",

    };
    if (icon === null || icon === undefined) {
        icon = "default";
    }
    let media = icon.toLowerCase() as keyof typeof icons;
    const img = icons[media] !== undefined ? icons[media] : icons.default;

    if (url === undefined) {
        return <img className={className} src={img} alt={"Icon de " + img}/>;
    }
    return <Info className="cursor-pointer" content={url}><img className={className} src={img} alt={"Icon de " + img}/></Info>

}