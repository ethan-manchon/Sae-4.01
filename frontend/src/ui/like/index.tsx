import React, { useEffect, useState } from "react";
import { loadMe } from "../../lib/UserService";
import { loadLikes, postLike, deleteLike } from "../../lib/LikeService";
import Button from "../button";
import { LikeSvg } from "../../assets/svg/svg";

interface LikeButtonProps {
  postId: number;
}

export default function LikeButton({ postId }: LikeButtonProps) {
  const [likes, setLikes] = useState<any[]>([]);
  const [meId, setMeId] = useState<number | null>(null);
  const [blocked, setBlocked] = useState<boolean>(false);

  const refreshLikes = () => {
    loadLikes(postId)
      .then((data) => {
        setLikes(data.likes || []);
        setBlocked(data.isBlocked);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des likes :", error);
      });
  };

  useEffect(() => {
    refreshLikes();
  }, [postId]);

  useEffect(() => {
    loadMe()
      .then((me) => {
        if (me) {
          setMeId(me.id);
        }
      })
      .catch(console.error);
  }, []);

  const toggleLike = async () => {
    if (!meId || blocked) return;
    const userLike = likes.find((like) => like.user.id === meId);
    if (userLike) {
      const res = await deleteLike(userLike.id);
      if (!res.error) refreshLikes();
    } else {
      const res = await postLike(postId);
      if (!res.error) refreshLikes();
    }
  };

  const userHasLiked = likes.some((like) => like.user.id === meId);

  return (
    <Button
      onClick={toggleLike}
      variant="transparent"
      className={`flex items-center space-x-2 transition-colors duration-200 ease-in-out`}
    >
      <LikeSvg
        color={blocked ? "disabled" : userHasLiked ? "active" : "default"}
      />
      <span>{likes.length}</span>
    </Button>
  );
}
