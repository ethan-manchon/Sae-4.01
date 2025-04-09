import React from "react";
import { Link } from "react-router-dom";

export function parseContent(text: string): React.ReactNode[] {
  const parts = text.split(/([#@][\w]+)/g);

  return parts.map((part, i) => {
    if (part.startsWith("#")) {
      const tag = part.slice(1);
      return (
        <Link
          key={i}
          to={`/search/${encodeURIComponent(tag)}`}
          className="text-primary hover:underline"
        >
          {part}
        </Link>
      );
    } else if (part.startsWith("@")) {
      const username = part.slice(1);
      return (
        <Link
          key={i}
          to={`/profil/${encodeURIComponent(username)}`}
          className="text-green hover:underline"
        >
          {part}
        </Link>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
