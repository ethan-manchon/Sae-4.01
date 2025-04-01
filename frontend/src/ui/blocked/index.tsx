import React, { useState } from "react";
import { blockUser, unblockUser } from "../../lib/BlockedService";

interface BlockedProps {
  isBlocked: boolean;
  userId: number;
  setIsBlocked: (val: boolean) => void;
}

export default function BlockButton({ isBlocked, userId, setIsBlocked }: BlockedProps) {
  const [loading, setLoading] = useState(false);

  const toggleBlock = async () => {
    setLoading(true);
    try {
      if (isBlocked) {
        const res = await unblockUser(userId);
        if (!res.error) setIsBlocked(false);
      } else {
        const res = await blockUser(userId);
        if (!res.error) setIsBlocked(true);
      }
    } catch (error) {
      console.error("Error toggling block:", error);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggleBlock}
      disabled={loading}
      className={`px-4 py-2 rounded-full font-medium transition-colors text-bg ${
        isBlocked
          ? "bg-red hover:bg-red-light"
          : "bg-primary hover:bg-primary-hover"
      }`}
    >
      {loading ? "Chargement..." : isBlocked ? "Unblock" : "Block"}
    </button>
  );
}
