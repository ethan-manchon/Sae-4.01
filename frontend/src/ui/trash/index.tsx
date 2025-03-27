import React, { useState } from "react";
import { deletePost } from "../../lib/loader";

interface TrashButtonProps {
  postId: number;
  onDeleted?: () => void;
}

export default function TrashButton({ postId, onDeleted }: TrashButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Supprimer ce post ?")) return;

    setLoading(true);
    const res = await deletePost(postId);
    setLoading(false);

    if (!res.error && onDeleted) {
      onDeleted();
    }
  };

  return (
    <button onClick={handleDelete} className="text-red hover:text-red-light" disabled={loading} title="Supprimer le post">🗑️</button>
  );
}
