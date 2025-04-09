import React, { useState, useEffect } from "react";
import { loadMe } from "../../lib/UserService";
import Date from "../date";
import Post from "../post";
import Pdp from "../pdp";
import Trash from "../trash";

interface User {
  id: number;
  pseudo: string;
  pdp: string;
}

interface RepostProps {
  repostUser: User;
  comment: string;
  postId: number;
  repost_id: number;
  pdp: string;
  post_id: number;
  pseudo: string;
  content: string;
  userId: number;
  meId: number;
  banned: boolean;
  count: any;
  media: any;
  created_at: string;
  createdAt: string;
  censored: boolean;
  onDeleted: () => void;
}
export default function Repost({
  repostUser,
  comment,
  repost_id,
  pdp,
  post_id,
  pseudo,
  content,
  userId,
  meId,
  banned,
  count,
  media,
  created_at,
  createdAt,
  censored,
  onDeleted,
}: RepostProps) {
  const [commentaire, SetCommentaire] = useState<string>(comment || "");
  const [disappearing, setDisappearing] = useState(false);
  const [me, setMe] = useState<number | null>(null);
  
  useEffect(() => {
    loadMe()
      .then((me) => {
        if (me) {
          setMe(me.id);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (comment !== null) {
      SetCommentaire(comment);
    }
  }, [comment]);

  const handleDeleted = () => {
    setDisappearing(true);
    setTimeout(() => {
      onDeleted?.();
    }, 300);
  };

  return (
    <div className={`mx-auto my-6 flex w-full max-w-xl flex-col overflow-hidden rounded-lg border border-element bg-white shadow-md${disappearing ? "scale-95 opacity-0" : ""}`}>
      <div className="flex items-center justify-between border-b border-element bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-3">
        <Pdp
          pdp={repostUser.pdp}
          pseudo={repostUser.pseudo}
          link={`/profil/${repostUser.pseudo}`}
        />
        <div className="flex items-center space-x-2">
          <Date date={created_at} />
          {repostUser.id === me && <Trash postId={repost_id} type="repost" onDeleted={handleDeleted}/>}
        </div>
      </div>

      {commentaire && (
        <div className="border-b border-element px-5 py-3 text-sm text-fg">
          <span>{commentaire}</span>
        </div>
      )}
        <Post
          post_id={post_id}
          pseudo={pseudo}
          content={content}
          createdAt={createdAt}
          pdp={pdp}
          userId={userId}
          meId={meId}
          banned={banned}
          count={count}
          media={media}
          censored={censored}
          onDeleted={onDeleted}
        />
    </div>
  );
}
