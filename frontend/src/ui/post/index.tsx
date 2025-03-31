import React, { useState, useEffect } from 'react';
import Content from '../content';
import Pdp from '../pdp';
import Like from '../like';
import Button from '../button';
import TrashButton from '../trash';
import Date from '../date';
import { editPost } from '../../lib/PostService';
import Answer from '../answer';
import { EditSvg, AnswerSvg} from "../../assets/svg/svg";

interface PostProps { 
  pseudo: string;
  pdp: string;
  post_id: number;
  content: string;
  createdAt: string;
  userId: number;
  meId: number;
  banned: boolean;
  count: number;
  onDeleted?: () => void;
}

export default function Post({pseudo, post_id, content, createdAt, pdp, userId, meId, banned, count, onDeleted}: PostProps) {
  const [disappearing, setDisappearing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newContent, setNewContent] = useState(content);
  const [loading, setLoading] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [answerCount, setAnswerCount] = useState(count);



  const handleDeleted = () => {
    setDisappearing(true);
    setTimeout(() => {
      onDeleted?.();
    }, 300);
  };

  const handleEdit = () => setEditing(true);

  const handleSave = async () => {
    if (!newContent.trim()) return alert("Le contenu ne peut pas être vide.");

    setLoading(true);
    const res = await editPost(post_id, { content: newContent });
    setLoading(false);

    if (!res.error) {
      setEditing(false);
    } else {
      alert("Erreur lors de l'édition : " + res.error);
    }
  };

  return (
    <li className={`w-full bg-bg shadow-lg hover:shadow-xl max-w-xl mx-auto border border-border rounded-lg transition transform duration-150 ease-out ${disappearing ? 'opacity-0 scale-95' : ''} my-4`}>
      <div className="p-4">

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Pdp pdp={pdp} pseudo={pseudo} link={`/profil/${pseudo}`} />
            <Date date={createdAt}/>
          </div>
          {userId === meId && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8">
              <TrashButton postId={post_id} type="post" onDeleted={handleDeleted} />
              </div>
              <Button onClick={handleEdit} variant="transparent" className="w-8 h-8 p-0 flex items-center justify-center text-primary hover:text-red">
                <EditSvg className="w-8 h-8" />
              </Button>
            </div>
          )}
        </div>

        <div className="mt-6 text-gray-800 text-sm">
          {editing ? (
            <>
              <textarea
                className="w-full h-24 border rounded p-2"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />
              <div className="flex space-x-2 mt-2">
                <Button onClick={handleSave}>
                  {loading ? "Saving..." : "Save"}
                </Button>
                <Button onClick={() => setEditing(false)} variant="transparent">
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <Content className={banned ? "text-element" : ""}>{newContent}</Content>
          )}
        </div>

        {!banned && (
          <>
           <Answer postId={post_id} isReplying={isReplying} setIsReplying={setIsReplying} setAnswerCount={setAnswerCount} />
            <div className="mt-3 flex items-center justify-end">
              <Button onClick={() => setIsReplying(!isReplying)} variant='transparent' className='text-primary hover:text-red'>
                <div className="flex items-center space-x-2 transition-colors duration-200 ease-in-out">
                <AnswerSvg className="w-8 h-8"/>
                <span className="w-8 text-left">{answerCount}</span>
                </div >
              </Button>
              <Like postId={post_id} />
            </div>
          </>
        )}
      </div>


    </li>
  );
}
