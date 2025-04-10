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
    }
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
        className="w-full rounded-md border border-border p-2 text-fg"
        value={value}
        onChange={handleChange}
      />
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
}
