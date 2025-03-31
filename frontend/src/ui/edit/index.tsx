import React, { useState } from "react";
import { editPost } from "../../lib/PostService";

interface TrashButtonProps {
  postId: number;
  data: string;
  onEdit?: () => void;
}

export default function EditButton({ postId, data, onEdit }: TrashButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleEdit = async () => {

    setLoading(true);
    const res = await editPost(postId, data);
    setLoading(false);

    if (!res.error && onEdit) {
      onEdit();
    }
  };

  return (
    <button onClick={handleEdit} className="" disabled={loading} title="Modifier le post">✏️</button>
  );
}
