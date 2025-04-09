import React, { useState, useEffect, useCallback } from "react";
import { loadResponse, sendResponse } from "../../lib/ResponseService";
import { loadMe } from "../../lib/UserService";
import Comment from "../comment";
import Button from "../button";
import Trash from "../trash";
import { usePopover } from "../popover/context";

interface AnswerProps {
  postId: number;
  isReplying: boolean;
  setIsReplying: React.Dispatch<React.SetStateAction<boolean>>;
  onCountChange?: (newCount: number) => void;
}

export default function Answer({
  postId,
  isReplying,
  setIsReplying,
  onCountChange,
}: AnswerProps) {
  const [responses, setResponses] = useState<any[]>([]);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [meId, setMeId] = useState<number | null>(null);
  const [blocked, setBlocked] = useState<boolean>(false);
  const { showPopover } = usePopover();

  const refreshResponses = useCallback(() => {
    loadResponse(postId)
      .then((data) => {
        const newResponses = data.responses || [];
        setResponses(newResponses);
        setBlocked(data.isBlocked);
        if (onCountChange) {
          onCountChange(newResponses.length);
        }
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des réponses :", error);
      });
  }, [postId, onCountChange]);

  useEffect(() => {
    refreshResponses();
  }, [postId, refreshResponses]);

  useEffect(() => {
    loadMe()
      .then((me) => {
        if (me && me.id) setMeId(me.id);
      })
      .catch(console.error);
  }, []);

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) {
      showPopover("Le contenu ne peut pas être vide.");
      return;
    }
    setLoading(true);
    try {
      const res = await sendResponse(postId, replyContent);
      if (!res.error) {
        refreshResponses();
        setReplyContent("");
        setIsReplying(false);
      } else {
        showPopover("Erreur lors de la publication : " + res.error);
      }
    } catch (err) {
      console.error(err);
      showPopover("Erreur lors de la publication.");
    }
    setLoading(false);
  };

  return (
    <div className="px-4 pb-4">
      {isReplying && (
        <>
          <hr className="mt-4 mb-4 text-fg" />
          {!blocked && (
            <div className="mt-2 rounded-lg border border-fg bg-grey-dark p-3">
              <input
                type="text"
                className="w-full rounded border-none p-2 text-sm focus:border-none focus:outline-none"
                placeholder="Écrivez votre réponse..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <div className="mt-2 flex justify-end">
                <Button onClick={handleReplySubmit}>
                  {loading ? "Envoi..." : "Répondre"}
                </Button>
              </div>
            </div>
          )}
          <div
            className={`scrollBar mt-4 space-y-2 pr-4 ${responses.length > 3 ? "max-h-72 overflow-y-auto" : ""}`}
          >
            {responses.map((resp) => (
              <div
                key={resp.id}
                className="relative flex items-start justify-between rounded-lg p-4"
              >
                <Comment comment={resp} />
                {meId && resp.user.id === meId && (
                  <Trash
                    postId={resp.id}
                    type="response"
                    onDeleted={refreshResponses}
                    className="absolute top-2 right-2"
                  />
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
