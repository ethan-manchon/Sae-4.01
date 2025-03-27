import React, { useState } from "react";

interface InfoProps {
    children: React.ReactNode;
    content?: string;
    className?: string;
}

export default function Info({ children, content, className }: InfoProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`relative inline-block ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* L’élément cible à survoler (icône) */}
            <div className="w-full h-full">
                {children}
            </div>
            {/* Tooltip */}
            {isHovered && (
                <div className="absolute right-0 mt-2 w-auto max-w-xs md:max-w-md bg-bg text-fg text-sm rounded-lg shadow-lg p-3">
                {content}
                </div>
            )}
        </div>
    );
}