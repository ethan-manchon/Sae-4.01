import React, { useState, useEffect, useCallback } from 'react';
import { loadResponse, sendResponse } from '../../lib/ResponseService';
import { loadMe } from '../../lib/UserService';
import Comment from '../comment'; 
import Trash from '../trash';

interface AnswerProps {
  postId: number;
  isReplying: boolean;
  setIsReplying: React.Dispatch<React.SetStateAction<boolean>>;
  onCountChange?: (newCount: number) => void;
}

export default function Answer({ postId, isReplying, setIsReplying, onCountChange }: AnswerProps) {
  const [responses, setResponses] = useState<any[]>([]);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [meId, setMeId] = useState<number | null>(null);
  const [blocked, setBlocked] = useState<boolean>(false);

  const refreshResponses = useCallback(() => {
    loadResponse(postId)
      .then((data) => {
        const newResponses = data.responses || [];
        setResponses(newResponses);
        setBlocked(data.isBlocked);
        // Met à jour le compteur via le callback si fourni
        if (onCountChange) {
          onCountChange(newResponses.length);
        }
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des réponses :', error);
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
      alert('Le contenu ne peut pas être vide.');
      return;
    }
    setLoading(true);
    try {
      const res = await sendResponse(postId, replyContent);
      if (!res.error) {
        refreshResponses();
        setReplyContent('');
        setIsReplying(false);
      } else {
        alert('Erreur lors de la publication : ' + res.error);
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la publication.');
    }
    setLoading(false);
  };

  return (
    <div className="px-4 pb-4">
      {isReplying && ( 
        <>
          { !blocked && (
            <div className="mt-2 p-3 border rounded-lg bg-grey-dark">
              <input
                type="text"
                className="w-full border-none focus:ring-0 rounded p-2 text-sm"
                placeholder="Écrivez votre réponse..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleReplySubmit}
                  disabled={loading}
                  className="bg-primary text-white px-4 py-1 rounded-full hover:bg-primary-hover transition-colors"
                >
                  {loading ? "Envoi..." : "Répondre"}
                </button>
              </div>
            </div>
          )}
          <div className={`mt-4 space-y-2 scrollBar pr-4 ${responses.length > 3 ? 'max-h-72 overflow-y-auto' : ''}`}>
            {responses.filter(resp => resp && resp.id).map((resp) => (
              <div key={resp.id} className="relative ">
                <Comment comment={resp} />
                {meId && resp.user.id === meId && (
                  <Trash postId={resp.id} type="response" onDeleted={refreshResponses} className="absolute top-0 right-0"/>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
