import React from "react";

interface IconProps {
    url: string;
    className?: string;
}

export default function Icon({ url, className }: IconProps) {
    const icons = {
        logo: "./assets/twitter-logo.svg",
        undefined: "/assets/undefined.webp"
    };
    let media = url.toLowerCase() as keyof typeof icons;
    const icon = icons[media] !== undefined ? icons[media] : icons.undefined;

    return <img className={ className } src={icon} alt={"Icon de" + url}/>;
}