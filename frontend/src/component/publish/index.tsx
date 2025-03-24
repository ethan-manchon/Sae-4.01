import React, { useState } from "react";
import Button from "../../ui/button";

interface TweetInputProps {
    onTweetSent?: (tweet: string) => void;
}

const TweetInput: React.FC<TweetInputProps> = ({ onTweetSent }) => {
    const [text, setText] = useState("");
    const maxChars = 280;

    const handlePublish = async () => {
        if (!text.trim()) return;
        
            const response = await fetch("http://localhost:8080/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: text }),
            });
            
            if (response.ok) {
                setText("");
                if (typeof onTweetSent === "function") {
                    onTweetSent(text);
                }
                console.log("Post ajouté avec succès");
            }
    };


    return (
        <div className='flex flex-row gap-8 items-center p-4 border shadow border-border rounded-lg'>
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

export default TweetInput;
