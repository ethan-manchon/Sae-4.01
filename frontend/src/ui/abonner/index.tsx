import React, { useState } from "react";
import { subscribeToUser, unsubscribeFromUser } from "../../lib/loader";

interface AbonnerProps {
  isFollowing: boolean;
  userId: number;
  setIsFollowing: (val: boolean) => void;
}

export default function Abonner({ isFollowing, userId, setIsFollowing }: AbonnerProps) {
  const [loading, setLoading] = useState(false);

  const toggleFollow = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        const res = await unsubscribeFromUser(userId);
        if (!res.error) setIsFollowing(false);
      } else {
        const res = await subscribeToUser(userId);
        if (!res.error) setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggleFollow}
      disabled={loading}
      className={`px-4 py-2 rounded-full font-medium transition-colors text-bg ${
        isFollowing
          ? "bg-red hover:bg-red-light"
          : "bg-primary hover:bg-primary-hover"
      }`}
    >
      {loading ? "Chargement..." : isFollowing ? "Se désabonner" : "S'abonner"}
    </button>
  );
}
