import React, { useState } from "react";

interface MailProps {   
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Mail({ name, value, onChange }: MailProps) {
    const [error, setError] = useState("");

    const validateEmail = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value === "") {
            setError("");
        } else {
            if (!emailRegex.test(value)) {
                setError("Invalid email address");
            } else {
                setError("");
            }
        };
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        validateEmail(value);
        onChange(e);
    };

    return (
        <div>
            <input
                type="email"
                name={name}
                placeholder="Enter your mail"
                className="w-full p-2 border text-fg border-border rounded-md"
                value={value}
                onChange={handleChange}
            />
                {error && <p className="text-error text-sm mt-1">{error}</p>}
        </div>
    );
}
