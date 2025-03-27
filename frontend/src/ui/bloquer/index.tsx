import React, { useState } from "react";
import Button from "../button";

interface BloquerProps {
  id: number;
  bloquer?: boolean;
  onUpdated?: () => void;
}

export default function Bloquer({ id, bloquer = false, onUpdated }: BloquerProps) {
  const [isBlocked, setIsBlocked] = useState(bloquer);

  const handleBlock = async () => {
    if (!confirm("Bloquer cet utilisateur ?")) return;
  
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8080/admin/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isBlocked: true }),
    });
  
    if (response.ok) {
      setIsBlocked(true);
      onUpdated?.();
    } else {
      alert("Erreur lors du blocage.");
    }
  };

  const handleUnblock = async () => {
    if (!confirm("Débloquer cet utilisateur ?")) return;

    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8080/admin/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isBlocked: false }),
    });

    if (response.ok) {
      setIsBlocked(false);
      onUpdated?.();
    } else {
      alert("Erreur lors du déblocage.");
    }
  };

  return (
    <div className="ml-2">
      {isBlocked ? (
        <Button
          size="sm"
          variant="transparent"
          className="bg-red"
          onClick={handleUnblock}
        >
          🔒
        </Button>
      ) : (
        <Button
          size="sm"
          variant="transparent"
          className="bg-green"
          onClick={handleBlock}
        >
          🔓
        </Button>
      )}
    </div>
  );
}
