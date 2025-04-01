import React, { useEffect, useState } from "react";
import { loadMe } from "../../lib/UserService";
import { loadLikes, likePost, deleteLike } from "../../lib/LikeService";
import Button from "../button";
import { LikeSvg } from "../../assets/svg/svg";

interface LikeButtonProps {
  postId: number;
}

export default function LikeButton({ postId }: LikeButtonProps) {
  interface Like {
    id: number;
    user: number;
  }

  const [likes, setLikes] = useState<Like[]>([]);
  const [meId, setMeId] = useState<number | null>(null);
  const [myLikeId, setMyLikeId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      const me = await loadMe();
      if (!me) return;

      setMeId(me.id);

      const postLikes = await loadLikes(postId);
      setLikes(postLikes);

      const myLike = postLikes.find(like => like.user === me.id);
      setMyLikeId(myLike ? myLike.id : null);
    }

    fetchData();
  }, [postId]);

  const toggleLike = async () => {
    if (!meId) return;

    if (myLikeId) {
      const res = await deleteLike(myLikeId);
      if (!res.error) {
        setLikes(likes.filter(l => l.id !== myLikeId));
        setMyLikeId(null);
      }
    } else {
      const res = await likePost(postId);
      if (!res.error) {
        const updatedLikes = await loadLikes(postId);
        const myNewLike = updatedLikes.find(l => l.user === meId);
        setLikes(updatedLikes);
        setMyLikeId(myNewLike ? myNewLike.id : null);
      }
    }
  };

  return (
    <Button
      onClick={toggleLike}
      variant="transparent"
      className={`flex items-center space-x-2 transition-colors duration-200 ease-in-out ${myLikeId ? "text-red" : "text-element"} hover:text-red-light`}
    >
      <LikeSvg className="w-8 h-8" />
      <span className="w-8 text-left">{likes.length}</span>
    </Button>
  );
}
