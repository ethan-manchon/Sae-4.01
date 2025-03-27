import React, { useState } from "react";
import Button from "../../ui/button";

interface TweetInputProps {
    OnClick: () => void;
}

export default function Publish({ OnClick }: TweetInputProps) {
    const [text, setText] = useState("");
    const maxChars = 280;

    const token = localStorage.getItem("token");
    const handlePublish = async () => {
        if (!text.trim()) return;
        
            const response = await fetch("http://localhost:8080/api/posts", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                  },
                body: JSON.stringify({ content: text }),
            });
            
            if (response.ok) {
                setText("");
                OnClick();
                console.log("Post ajouté avec succès");
            }
    };

    return (
        <div className='flex flex-row gap-8 items-center p-4 border shadow border-border rounded-lg w-3/4 md:w-8/9 mx-auto'>
            <div className="flex flex-col grow-1">
            <input
                type="text"
                className="bg-bg p-4 border border-border rounded-lg text-fg"
                placeholder="Publier un tweet..."
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, maxChars))}
            />
            <div
                className={`text-sm text-right ${text.length === 280 ? "text-red-500" : "text-fg"}`}>
                {`${maxChars - text.length} / 280`}
            </div>
            </div>
            <Button onClick={() => handlePublish()}>Publier</Button>
        </div>
    );
};

