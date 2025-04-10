import React, { useState, useRef, useEffect } from "react";
import { publishPost } from "../../lib/PostService";
import { PaperClip } from "../../assets/svg/svg";
import Button from "../../ui/button";

interface TweetInputProps {
  OnClick: () => void;
}

interface MediaPreview {
  id: string;
  file: File;
  previewUrl: string;
}

export default function Publish({ OnClick }: TweetInputProps) {
  const [text, setText] = useState("");
  const [media, setMedia] = useState<MediaPreview[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const maxChars = 280;
  const MAX_MEDIA = 4;
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      media.forEach((m) => URL.revokeObjectURL(m.previewUrl));
    };
  }, [media]);

  const addFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (media.length + selectedFiles.length > MAX_MEDIA) {
        setErrorMessage("Vous ne pouvez sélectionner que 4 éléments.");
        return;
      }
      setErrorMessage("");
      const newMedia = selectedFiles.map((file) => ({
        id: file.name + "_" + Date.now() + "_" + Math.random(),
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      setMedia((prev) => [...prev, ...newMedia]);
      e.target.value = "";
    }
  };

  const handleRemoveMedia = (id: string) => {
    setMedia((prev) => {
      const updated = prev.filter((item) => {
        if (item.id === id) {
          URL.revokeObjectURL(item.previewUrl);
          return false;
        }
        return true;
      });
      if (updated.length < MAX_MEDIA) {
        setErrorMessage("");
      }
      return updated;
    });
  };

  async function handlePublish() {
    const formData = new FormData();
    formData.append("content", text);
    media.forEach((item) => {
      formData.append("media[]", item.file);
    });

    const result = await publishPost(formData);
    if (!result.error) {
      setText("");
      setMedia([]);
      OnClick();
    } else {
      console.error(result.error);
    }
  }

  return (
    <div className="mx-1/6 flex w-full flex-row items-center gap-8 rounded-lg border border-border p-4 shadow lg:w-8/9">
      <div className="flex grow-1 flex-col">
        <input
          type="text"
          className="rounded-lg border border-border bg-bg p-4 text-fg"
          placeholder="Publier un tweet..."
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, maxChars))}
        />
        <div
          className={`text-right text-sm ${text.length === 280 ? "text-red" : "text-fg"}`}
        >
          {`${maxChars - text.length} / 280`}
        </div>
        {errorMessage && (
          <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
        )}
        {media.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {media.map((item) => (
              <div key={item.id} className="relative">
                {item.file.type.startsWith("image/") ? (
                  <img
                    src={item.previewUrl}
                    alt="preview"
                    className="h-24 w-24 rounded object-cover"
                  />
                ) : item.file.type.startsWith("video/") ? (
                  <video
                    src={item.previewUrl}
                    controls
                    className="h-24 w-24 rounded object-cover"
                  />
                ) : null}
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(item.id)}
                  className="absolute top-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col lg:flex-row">
        <Button onClick={addFiles} variant="transparent">
          <PaperClip />
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFilesChange}
          multiple
          accept="image/*,video/*"
          style={{ display: "none" }}
        />
        <Button onClick={handlePublish}>Publier</Button>
      </div>
    </div>
  );
}
