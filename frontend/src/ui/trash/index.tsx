import React, { useState } from "react";
import { deletePost } from "../../lib/PostService";
import { deleteResponse } from "../../lib/ResponseService";
import {TrashSvg} from "../../assets/svg/svg";

interface TrashButtonDataProps {
  postId: number;
  type: "post" | "response";
  onDeleted?: () => void;
}

interface TrashButtonStyleProps {
  className?: string;
}

interface TrashButtonProps extends TrashButtonDataProps, TrashButtonStyleProps {}

export default function TrashButton({ postId, type, className, onDeleted }: TrashButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (type === "post") {
      if (!confirm("Supprimer ce post ?")) return;
    }
    if (type === "response") {
      if (!confirm("Supprimer cette réponse ?")) return;
    }

    setLoading(true);
    let res;
    if (type === "post") {
      res = await deletePost(postId);
    }
    if (type === "response") {
      res = await deleteResponse(postId);
    }
    setLoading(false);

    if (res && !res.error && onDeleted) {
      onDeleted();
    }
  };

  return (
    <button onClick={handleDelete} className={`text-primary hover:text-red ${className}`} disabled={loading} title="Supprimer le post"><TrashSvg className="w-8 h-8"/></button>
  );
}
