import React, { useState, useEffect } from "react";
import { isUserFollowed, subscribeToUser, unsubscribeFromUser } from "../../lib/SubscribeService";

interface SubscribeProps {
  userId: number;
}

export default function Subscribe({ userId }: SubscribeProps) {
  const [follow, setFollow] = useState<boolean>(false);
  const [blocked, setBlocked] = useState<boolean>(false);

    useEffect(() => {
      async function fetchFollowStatus() {
        const followStatus = await isUserFollowed(userId);
        setFollow(followStatus.follower);
        setBlocked(followStatus.isBlocked);
        console.log("État blocked :", followStatus.isBlocked);

      }
      fetchFollowStatus();
    }, [userId]);


      useEffect(() => {
        console.log("État blocked mis à jour :", follow);
      }, [follow]);
    

    const toggleBlock = async () => {
      try {
        if (follow) {
          const res = await unsubscribeFromUser(userId);
          if (!res.error) {
            setFollow(false);
          }
        } else {
          const res = await subscribeToUser(userId);
          if (!res.error) {
            setFollow(true);
          }
        }
      } catch (error) {
        console.error("Error toggling block:", error);
      }
    };
  return (
    <button
      onClick={toggleBlock}
      
      className={`px-4 py-2 rounded-full font-medium transition-colors text-bg 
      ${follow ? "bg-red hover:bg-red-light" : "bg-primary hover:bg-primary-hover"} 
      ${blocked ? "cursor-not-allowed" : "cursor-pointer"}`}>
      {follow ? "Unfollow" : "Follow"}
    </button>
  );
}
