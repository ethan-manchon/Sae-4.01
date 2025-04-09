import React, { useState, useEffect } from "react";
import { blockUser, unblockUser } from "../../lib/BlockedService";
import { isUserBlocked } from "../../lib/BlockedService";

interface BlockedProps {
  userId: number;
}

export default function BlockButton({ userId }: BlockedProps) {
  const [blocked, setBlocked] = useState<boolean>(false);

  useEffect(() => {
    async function fetchBlockStatus() {
      const BlockStatus = await isUserBlocked(userId);
      setBlocked(BlockStatus.blocked);
      console.log("État blocked :", blocked);
    }
    fetchBlockStatus();
  }, [userId]);

  useEffect(() => {
    console.log("État blocked mis à jour :", blocked);
  }, [blocked]);

  const toggleBlock = async () => {
    try {
      if (blocked) {
        const res = await unblockUser(userId);
        if (!res.error) {
          setBlocked(false);
        }
      } else {
        const res = await blockUser(userId);
        if (!res.error) {
          setBlocked(true);
        }
      }
    } catch (error) {
      console.error("Error toggling block:", error);
    }
  };

  return (
    <button
      onClick={toggleBlock}
      className={`rounded-full px-4 py-2 font-medium text-bg transition-colors ${
        blocked
          ? "bg-red hover:bg-red-light"
          : "bg-primary hover:bg-primary-hover"
      }`}
    >
      {blocked ? "Débloquer" : "Bloquer"}
    </button>
  );
}
