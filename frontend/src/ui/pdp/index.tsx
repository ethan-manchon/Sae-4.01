import React from "react";
import Content from "../content";
import Button from "../button";

interface PictureProps {
    pdp?: any;
    pseudo?: string;
    link?: string;
    className?: string;
}

export default function Picture({ pdp, pseudo, link, className }: PictureProps) {
    const profilePicture = pdp || "/assets/pdp/default.webp";

    return ( 
        <Button variant="transparent" link={link} className={`flex items-center gap-2`}>
            <img src={`http://localhost:8080/${profilePicture}`} alt="Photo de profil" className={`w-12 h-12 rounded-full border-2 shadow-md ${className}`}/>
            <Content>{pseudo}</Content>
        </Button>
    );
}