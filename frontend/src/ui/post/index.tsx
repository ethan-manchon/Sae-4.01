import React, { useState, useRef } from "react";
import { editPost } from "../../lib/PostService";
import Content from "../content";
import Pdp from "../pdp";
import Like from "../like";
import Button from "../button";
import TrashButton from "../trash";
import Date from "../date";
import Answer from "../answer";
import Pin from "../pin";
import { EditSvg, AnswerSvg, PinSvg } from "../../assets/svg/svg";
import { usePopover } from "../popover/context";
import Retweet from "../retweet";
import { parseContent } from "../parseContent";

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
  readOnly?: boolean;
  pinned?: boolean;
  onDeleted?: () => void;
}

export default function Post({
  pseudo,
  post_id,
  content,
  createdAt,
  pdp,
  userId,
  meId,
  banned,
  count,
  media,
  onDeleted,
  censored,
  readOnly,
  pinned,
}: PostProps) {
  const { showPopover } = usePopover();

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
  const [noComment, setNoComment] = useState<boolean>(readOnly || false);
  const [pinnedState, setPinnedState] = useState<boolean>(pinned || false);
  const [readOnlyState, setReadOnlyState] = useState<boolean>(
    readOnly || false,
  );

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
    if (!newContent.trim())
      return showPopover("Le contenu ne peut pas être vide.", "error");

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
      showPopover("Erreur lors de l'édition : " + res.error);
    }
  };

  return (
    <li
      className={`mx-auto w-full max-w-xl transform rounded-lg border border-border bg-bg shadow-lg transition duration-150 ease-out hover:shadow-xl ${disappearing ? "scale-95 opacity-0" : ""} my-4`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {pinned && userId !== meId && (
              <PinSvg className="cursor-default hover:text-primary" />
            )}
            <Pdp pdp={pdp} pseudo={pseudo} link={`/profil/${pseudo}`} />
            <Date date={createdAt} />
          </div>
          {userId === meId && (
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center">
                <TrashButton
                  postId={post_id}
                  type="post"
                  onDeleted={handleDeleted}
                />
              </div>
              <Button
                onClick={editing ? () => setEditing(false) : handleEdit}
                variant="transparent"
                className="flex items-center justify-center"
              >
                <EditSvg color={editing ? "active" : "default"} />
              </Button>
              {pinned !== undefined ? (
                <Pin postId={post_id} pinned={pinnedState} />
              ) : (
                ""
              )}
            </div>
          )}
        </div>

        <div className="mt-6 text-sm text-fg">
          {editing ? (
            <>
              <textarea
                className="h-24 w-full rounded border p-2"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />
              <div className="mt-4">
                {currentMedia.length > 0 ? (
                  <>
                    <p className="mb-2 font-bold">Médias existants :</p>
                    <div className="grid grid-cols-2 gap-2">
                      {currentMedia.map((url, index) => (
                        <div key={index} className="relative">
                          {url.match(/\.(mp4|webm|ogg)$/i) ? (
                            <video
                              src={`${(import.meta as any).env.VITE_API_URL}${url}`}
                              controls
                              className="h-auto w-full rounded"
                            />
                          ) : (
                            <img
                              src={`${(import.meta as any).env.VITE_API_URL}${url}`}
                              alt={`media-${index}`}
                              className="h-auto w-full rounded object-cover"
                              loading="lazy"
                            />
                          )}
                          <Button
                            variant="transparent"
                            onClick={() => handleRemoveCurrentMedia(url)}
                            className="absolute top-0 right-0 items-center rounded-full bg-red text-white"
                          >
                            X
                          </Button>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <></>
                )}
                <div className="mt-4">
                  <button
                    onClick={triggerFileInput}
                    className="relative cursor-pointer rounded-lg border-2 border-dashed border-border p-4 text-center transition hover:border-primary-hover"
                  >
                    Ajouter des médias
                  </button>
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
                    <p className="mb-2 font-bold">Nouveaux médias ajoutés :</p>
                    <div className="grid grid-cols-2 gap-2">
                    {newMediaFiles.map((file, index) => {
                        const previewUrl = URL.createObjectURL(file);
                        return (
                          <div key={index} className="relative">
                            {file.type.startsWith("video/") ? (
                              <video
                                src={previewUrl}
                                controls
                                className="h-auto w-full rounded"
                              />
                            ) : (
                              <img
                                src={previewUrl}
                                alt={`new-media-${index}`}
                                className="h-auto w-full rounded object-cover"
                              />
                            )}
                            <Button
                              onClick={() =>
                                setNewMediaFiles((prev) =>
                                  prev.filter((_, i) => i !== index),
                                )
                              }
                              variant="transparent"
                              className="absolute top-0 right-0 items-center rounded-full bg-red text-white"
                            >
                              X
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-2 flex space-x-2">
                <Button onClick={handleSave}>
                  {loading ? "Saving..." : "Save"}
                </Button>
                <Button onClick={() => setEditing(false)} variant="transparent">
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <Content className={banned ? "text-element" : ""}>
              {parseContent(content)}
            </Content>
          )}
        </div>

        {!editing && !censor && currentMedia.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {currentMedia.map((url, index) => {
              if (url.match(/\.(mp4|webm|ogg)$/i)) {
                return (
                  <video
                    key={index}
                    src={`${(import.meta as any).env.VITE_API_URL}${url}`}
                    controls
                    className="h-auto w-full rounded"
                  />
                );
              }
              return (
                <img
                  key={index}
                  src={`${(import.meta as any).env.VITE_API_URL}${url}`}
                  alt={`media-${index}`}
                  className="h-auto w-full rounded object-cover"
                />
              );
            })}
          </div>
        )}

        {!banned && !censor && !noComment && !readOnlyState ? (
          <>
            <div className="mt-2 flex items-center justify-end">
              <Button
                onClick={() => setIsReplying(!isReplying)}
                variant="transparent"
              >
                <div className="flex items-center space-x-2 transition-colors duration-200 ease-in-out">
                  <AnswerSvg color={isReplying ? "active" : "default"} />
                  <span className="w-8 text-left">{localCount}</span>
                </div>
              </Button>
              <Like postId={post_id} />
              <Retweet postId={post_id} />
            </div>
            <Answer
              postId={post_id}
              isReplying={isReplying}
              setIsReplying={setIsReplying}
              onCountChange={setLocalCount}
            />
          </>
        ) : (
          !banned &&
          !censor && (
            <div className="mt-3 flex items-center justify-end">
              <Like postId={post_id} />
            </div>
          )
        )}
      </div>
    </li>
  );
}
