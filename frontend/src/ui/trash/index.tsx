import React, { useState } from "react";
import { deletePost } from "../../lib/PostService";
import { deleteResponse } from "../../lib/ResponseService";
import { deleteRepost } from "../../lib/RepostService";
import { TrashSvg } from "../../assets/svg/svg";
import Button from "../button";

interface TrashButtonDataProps {
  postId: number;
  type: "post" | "response" | "repost";
  onDeleted?: () => void;
}

interface TrashButtonStyleProps {
  className?: string;
}

interface TrashButtonProps
  extends TrashButtonDataProps,
    TrashButtonStyleProps {}

export default function TrashButton({
  postId,
  type,
  className,
  onDeleted,
}: TrashButtonProps) {
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    let res;
    if (type === "post") {
      res = await deletePost(postId);
    } else if (type === "response") {
      res = await deleteResponse(postId);
    } else if (type === "repost") {
      res = await deleteRepost(postId);
    }
    setLoading(false);

    if (res && !res.error && onDeleted) {
      onDeleted();
    }

    setConfirmOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setConfirmOpen(true)}
        className={className}
        disabled={loading}
        title="Supprimer le post"
      >
        <TrashSvg color={confirmOpen ? "active" : "default"} />
      </button>

      {confirmOpen && (
        <div className="absolute right-0 z-50 mt-2 w-56 space-y-3 rounded-lg border border-border bg-white p-4 text-center text-sm shadow-xl">
          <p className="text-fg">
            Supprimer {type === "post" ? "ce post" : "cette réponse"} ?
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleDelete}
              className="rounded bg-primary px-3 py-1 text-white hover:bg-primary-hover"
            >
              Oui
            </Button>
            <Button
              onClick={() => setConfirmOpen(false)}
              className="hover:bg-red-hover rounded bg-red px-3 py-1 text-white"
            >
              Non
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
