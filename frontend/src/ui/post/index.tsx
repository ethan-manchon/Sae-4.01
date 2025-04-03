import React, { useState, useRef } from 'react';
import { editPost } from '../../lib/PostService';
import Content from '../content';
import Pdp from '../pdp';
import Like from '../like';
import Button from '../button';
import TrashButton from '../trash';
import Date from '../date';
import Answer from '../answer';
import { EditSvg, AnswerSvg } from "../../assets/svg/svg";

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
  media: string[];
  censored?: boolean;
  onDeleted?: () => void;
}

export default function Post({ pseudo,  post_id, content, createdAt, pdp, userId,  meId,  banned,  count, media, onDeleted, censored }: PostProps) {
  const [disappearing, setDisappearing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newContent, setNewContent] = useState(content);
  const [currentMedia, setCurrentMedia] = useState<string[]>(media || []);
  const [newMediaFiles, setNewMediaFiles] = useState<File[]>([]);
  const [removedMedia, setRemovedMedia] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localCount, setLocalCount] = useState<number>(count);
  const [censor, setCensor] = useState<boolean>(censored || false);

  const handleDeleted = () => {
    setDisappearing(true);
    setTimeout(() => {
      onDeleted?.();
    }, 300);
  };

  const handleEdit = () => setEditing(true);

  const handleRemoveCurrentMedia = (url: string) => {
    setCurrentMedia((prev) => prev.filter((m) => m !== url));
    setRemovedMedia((prev) => [...prev, url]);
  };

  const handleNewMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewMediaFiles((prev) => [...prev, ...files]);
      e.target.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    if (!newContent.trim()) return alert("Le contenu ne peut pas être vide.");

    setLoading(true);
    const formData = new FormData();
    formData.append("content", newContent);
    newMediaFiles.forEach((file) => {
      formData.append("media[]", file);
    });
    if (removedMedia.length > 0) {
      formData.append("removedMedia", JSON.stringify(removedMedia));
    }

    const res = await editPost(post_id, formData);
    setLoading(false);

    if (!res.error) {
      setEditing(false);
      window.location.reload();
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
            <Date date={createdAt} />
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

        <div className="mt-6 text-fg text-sm">
          {editing ? (
            <>
              <textarea
                className="w-full h-24 border rounded p-2"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />
              <div className="mt-4">
                <p className="font-bold mb-2">Médias existants :</p>
                {currentMedia.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {currentMedia.map((url, index) => (
                      <div key={index} className="relative">
                        {url.match(/\.(mp4|webm|ogg)$/i) ? (
                          <video src={`http://localhost:8080/${url}`} controls className="w-full h-auto rounded" />
                        ) : (
                          <img src={`http://localhost:8080/${url}`} alt={`media-${index}`} className="w-full h-auto object-cover rounded" />
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveCurrentMedia(url)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Aucun média associé.</p>
                )}
                <div className="mt-4">
                  <Button onClick={triggerFileInput} variant="transparent">
                    Ajouter des médias
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleNewMediaChange}
                    multiple
                    accept="image/*,video/*"
                    style={{ display: "none" }}
                  />
                </div>
                {newMediaFiles.length > 0 && (
                  <div className="mt-4">
                    <p className="font-bold mb-2">Nouveaux médias ajoutés :</p>
                    <div className="grid grid-cols-2 gap-2">
                      {newMediaFiles.map((file, index) => {
                        const previewUrl = URL.createObjectURL(file);
                        return (
                          <div key={index} className="relative">
                            {file.type.startsWith("video/") ? (
                              <video src={previewUrl} controls className="w-full h-auto rounded" />
                            ) : (
                              <img src={previewUrl} alt={`new-media-${index}`} className="w-full h-auto object-cover rounded" />
                            )}
                            <button
                              type="button"
                              onClick={() => setNewMediaFiles((prev) => prev.filter((_, i) => i !== index))}
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                            >
                              X
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

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

        {!editing && currentMedia.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {currentMedia.map((url, index) => {
              if (url.match(/\.(mp4|webm|ogg)$/i)) {
                return (
                  <video key={index} src={`http://localhost:8080/${url}`} controls className="w-full h-auto rounded" />
                );
              }
              return (
                <img key={index} src={`http://localhost:8080/${url}`} alt={`media-${index}`} className="w-full h-auto object-cover rounded" />
              );
            })}
          </div>
        )}

        {!banned && !editing && !censor && (
          <>
            <Answer postId={post_id} isReplying={isReplying} setIsReplying={setIsReplying} onCountChange={setLocalCount} />
            <div className="mt-3 flex items-center justify-end">
              <Button onClick={() => setIsReplying(!isReplying)} variant='transparent' className='text-primary hover:text-red'>
                <div className="flex items-center space-x-2 transition-colors duration-200 ease-in-out">
                  <AnswerSvg className="w-8 h-8" />
                  <span className="w-8 text-left">{localCount}</span>
                </div>
              </Button>
              <Like postId={post_id} />
            </div>
          </>
        )}
      </div>
    </li>
  );
}
 