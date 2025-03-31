import React from "react";
import Info from "../../ui/info";

interface IconProps {
    url?: string;
    className?: string;
}

export default function Icon({ className, url }: IconProps) {
    const icons = {
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
        unilim: "/assets/icon/devicon_unilim.svg",
    };

    // Fix: vérifier si url est bien défini avant d'appeler toLowerCase()
    const found = url ? Object.keys(icons).find(key => url.toLowerCase().includes(key)) : undefined;
    const icon = found || "default";

    const media = icon.toLowerCase() as keyof typeof icons;
    const img = icons[media] ?? icons.default;

    return (
        <Info className="cursor-pointer" content={url}>
            <img className="h-8 w-8" src={img} alt={"Icon de " + media} />
        </Info>
    );
}