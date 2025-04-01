import React, { useState } from "react";
import { publishPost } from "../../lib/PostService";
import {PaperClip} from "../../assets/svg/svg";
import Button from "../../ui/button";

interface TweetInputProps {
    OnClick: () => void;
}

export default function Publish({ OnClick }: TweetInputProps) {
    const [text, setText] = useState("");
    const maxChars = 280;

    async function handlePublish() {
        const result = await publishPost(text);
        if (!result.error) {
            setText("");
            OnClick();
        } else {
            console.error(result.error);
        }
    }

    // function addFiles() {
    //     const input = document.createElement("input");
    //     input.type = "file";
    //     input.accept = "image/*";
    //     input.multiple = true;
    //     input.onchange = async (e) => {
    //         const files = e.target.files;
    //         if (files) {
    //             const formData = new FormData();
    //             for (let i = 0; i < files.length; i++) {
    //                 formData.append("files", files[i]);
    //             }
    //             const result = await publishPost(text, formData);
    //             if (!result.error) {
    //                 setText("");
    //                 OnClick();
    //             } else {
    //                 console.error(result.error);
    //             }
    //         }
    //     };
    //     input.click();
    // }

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
                className={`text-sm text-right ${text.length === 280 ? "text-red" : "text-fg"}`}>
                {`${maxChars - text.length} / 280`}
            </div>
            </div>
            {/* <Button onClick={() => addFiles()} variant="transparent"><PaperClip/></Button> */}
            <Button onClick={() => handlePublish()}>Publier</Button>
        </div>
    );
};

