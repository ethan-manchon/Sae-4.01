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
      <div className="h-full w-full">{children}</div>

      {isHovered && (
        <div className="absolute right-0 mt-2 w-auto max-w-xs rounded-lg bg-bg p-3 text-sm text-fg shadow-lg md:max-w-md">
          {content}
        </div>
      )}
    </div>
  );
}
