import React, { useState } from "react";

interface InfoProps {
    children: string;
    className?: string;
}

export default function Info({ children, className }: InfoProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <>
            <div
                className={`relative inline-block ${className}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}>
                <p className="rounded p-2 cursor-pointer text-dark border-gray-200">?</p>
            <div className={`absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 md:w-96 bg-dark text-light text-sm rounded p-2 ${isHovered ? "flex" : "hidden"}`}>
                {children}
            </div>
            </div>
        </>
    );

}