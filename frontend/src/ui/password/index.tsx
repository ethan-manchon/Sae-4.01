import React, { useEffect, useState } from "react";
import { zxcvbn } from "@zxcvbn-ts/core";
import { Indicators } from "./indicator";

interface PasswordProps {
    name: string;
    value: string;
    type?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Password({ name, value, type, onChange }: PasswordProps) {
    const [indicator, setIndicator] = useState({ score: -1 });
    const [error, setError] = useState("");

    useEffect(() => {
        if (value === "") {
            setIndicator({ score: -1 });
            setError("");
            return;
        }
        setIndicator(zxcvbn(value));
        
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(value)) {
            setError('Le mot de passe doit contenir au moins 8 caractères, avec chiffres, lettres et caractères spéciaux: @, $, !, %, *, ?, et & ');
        } else {
            setError("");
        }
    }, [value]);
    if (type === "register") {
    return (
        <div className="w-full">
            <div className="position-relative">
                <input
                    type="password"
                    name={name}
                    placeholder="Enter your password"
                    className="w-full p-2 border text-fg border-border rounded-md"
                    value={value}
                    onChange={onChange}
                />
                {value !== "" && <Indicators score={indicator.score} />}
                {error && <p className="text-error text-sm mt-1">{error}</p>}
            </div>
        </div>
    );}    else {
    return (
        <div className="w-full">
            <div className="position-relative">
                <input
                    type="password"
                    name={name}
                    placeholder="Enter your password"
                    className="w-full p-2 border text-fg border-border rounded-md"
                    value={value}
                    onChange={onChange}
                />
            </div>
        </div>
    );
}
}



// Si besoin de débug : https://dev.to/kezios/reactjs-indicateur-de-force-dun-mot-de-passe-o9c