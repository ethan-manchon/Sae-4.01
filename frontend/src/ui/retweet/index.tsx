import React, { useEffect, useRef, useState } from "react";
import { loadMe } from "../../lib/UserService";
import {
  loadRepost,
  createRepost,
  deleteRepost,
} from "../../lib/RepostService";
import Button from "../button";
import { RetweetSvg } from "../../assets/svg/svg";

interface RetweetProps {
  postId: number;
}

export default function Retweet({ postId }: RetweetProps) {
  const [reposts, setReposts] = useState<any[]>([]);
  const [meId, setMeId] = useState<number | null>(null);
  const [blocked, setBlocked] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const refreshReposts = () => {
    loadRepost(postId)
      .then((data) => {
        setReposts(data.reposts || []);
        setBlocked(data.isBlocked);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des reposts :", error);
      });
  };

  useEffect(() => {
    refreshReposts();
  }, [postId]);

  useEffect(() => {
    loadMe()
      .then((me) => me && setMeId(me.id))
      .catch(console.error);
  }, []);

  const handleRepostSubmit = async () => {
    if (!meId || blocked) return;
    const res = await createRepost(postId, comment);
    if (!res.error) {
      refreshReposts();
      setOpen(false);
      setComment("");
    }
  };

  const handleToggle = async () => {
    const userRepost = reposts.find((repost) => repost.user.id === meId);
    if (userRepost) {
      const res = await deleteRepost(userRepost.id);
      if (!res.error) refreshReposts();
    } else {
      setOpen(true);
    }
  };

  const userHasRepostd = reposts.some((repost) => repost.user.id === meId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative inline-block">
      <Button
        onClick={handleToggle}
        variant="transparent"
        className="flex items-center space-x-2 transition-colors duration-200 ease-in-out"
      >
        <RetweetSvg
          color={blocked ? "disabled" : userHasRepostd ? "active" : "default"}
        />
        <span>{reposts.length}</span>
      </Button>

      {open && (
        <div
          ref={popoverRef}
          className="absolute right-0 bottom-full z-50 mb-2 w-80 space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-lg"
        >
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ajoutez un commentaire (optionnel)"
            className="w-full resize-none rounded-md border border-gray-300 bg-gray-50 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={3}
          />
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setOpen(false)} variant="transparent">
              Annuler
            </Button>
            <Button onClick={handleRepostSubmit}>Retweeter</Button>
          </div>
        </div>
      )}
    </div>
  );
}
