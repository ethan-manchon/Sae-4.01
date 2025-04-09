import React, { useEffect, useState } from "react";
import { loadMe } from "../../lib/UserService";
import { loadRepost, createRepost, deleteRepost } from "../../lib/RepostService";
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
      .then((me) => {
        if (me) {
          setMeId(me.id);
        }
      })
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

  const handleCancel = () => {
    setOpen(false);
    setComment("");
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

  return (
    <div className="relative w-full max-w-xl">
      <Button
        onClick={handleToggle}
        variant="transparent"
        className={`flex items-center space-x-2 transition-colors duration-200 ease-in-out`}
      >
        <RetweetSvg color={blocked ? "disabled" : userHasRepostd ? "active" : "default"} />
        <span>{reposts.length}</span>
      </Button>

      {open && (
        <div className="mt-2 rounded border border-border bg-white p-4 shadow-xl space-y-3">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ajoutez un commentaire (optionnel)"
            className="w-full resize-none rounded border p-2 text-sm"
            rows={3}
          />

          <div className="flex justify-end space-x-2">
            <Button onClick={handleCancel} variant="transparent">
              Annuler
            </Button>
            <Button onClick={handleRepostSubmit}>
              Retweeter
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
