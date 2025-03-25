import React, {useState} from "react";

interface PseudoProps {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Pseudo({ name, value, onChange }: PseudoProps) {

      const [error, setError] = useState("");

    const validatePseudo = (value: string) => {
        const PseudoRegex = /^[a-zA-Z0-9]{3,20}$/;
        if (value === "") {
            setError("");
        } else {
            if (!PseudoRegex.test(value)) {
                setError("Le pseudo doit contenir au moins 4 caractères et aucun caractère spécial");
            } else {
                setError("");
            }
        };
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        validatePseudo(value);
        onChange(e);
    };

    return (
        <div>
        <input 
            type="text" 
            name={name} 
            value={value} 
            onChange={handleChange} 
            placeholder="Enter your pseudo" 
            className="w-full p-2 border text-fg border-border rounded-md"
        />
        {error && <p className="text-error text-sm mt-1">{error}</p>}
        </div>
    );
}
