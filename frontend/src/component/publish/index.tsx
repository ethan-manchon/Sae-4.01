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

  // Nettoyage des URLs lors du démontage pour éviter les fuites mémoire
  useEffect(() => {
    return () => {
      media.forEach((m) => URL.revokeObjectURL(m.previewUrl));
    };
  }, [media]);

  // Ouvre l'input file caché
  const addFiles = () => {
    fileInputRef.current?.click();
  };

  // Gestion de la sélection de fichiers, cumulant les fichiers déjà présents
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
      // Réinitialise l'input pour pouvoir sélectionner à nouveau les mêmes fichiers
      e.target.value = "";
    }
  };

  // Suppression d'un média via son identifiant unique
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

  // Envoi du formulaire avec le contenu et les fichiers médias
  async function handlePublish() {
    const formData = new FormData();
    formData.append("content", text);
    // Remplacez "media" par "media[]" pour envoyer un tableau de fichiers
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
    <div className="flex flex-row gap-8 items-center p-4 border shadow border-border rounded-lg w-3/4 md:w-8/9 mx-auto">
      <div className="flex flex-col grow-1">
        <input
          type="text"
          className="bg-bg p-4 border border-border rounded-lg text-fg"
          placeholder="Publier un tweet..."
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, maxChars))}
        />
        <div className={`text-sm text-right ${text.length === 280 ? "text-red" : "text-fg"}`}>
          {`${maxChars - text.length} / 280`}
        </div>
        {errorMessage && (
          <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
        )}
        {/* Aperçu des fichiers sélectionnés */}
        {media.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {media.map((item) => (
              <div key={item.id} className="relative">
                {item.file.type.startsWith("image/") ? (
                  <img
                    src={item.previewUrl}
                    alt="preview"
                    className="w-24 h-24 object-cover rounded"
                  />
                ) : item.file.type.startsWith("video/") ? (
                  <video
                    src={item.previewUrl}
                    controls
                    className="w-24 h-24 object-cover rounded"
                  />
                ) : null}
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(item.id)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col md:flex-row">
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
