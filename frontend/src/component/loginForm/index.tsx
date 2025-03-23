import React, { useState } from "react";
import Mail from "../../ui/mail/";
import Password from "../../ui/password/";
import Button from "../../ui/button/";

export default function LoginForm() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    
    const [valid, setValid] = useState({
        email: false,
        password: false
    });

    const [error, setError] = useState("");

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    
    const validatePassword = (password) => {
        return password.length > 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setError("");
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        
        setValid((prev) => ({
            ...prev,
            [name]: name === "email" ? validateEmail(value) : name === "password" ? validatePassword(value) : value.trim().length > 3
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (valid.email && valid.password) {
            const formDataToSend = new FormData();
            formDataToSend.append("email", formData.email);
            formDataToSend.append("password", formData.password);
            
            try {
                const response = await fetch("http://127.0.0.1:8080/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                });

                const result = await response.json();
                if (response.ok) {
                    console.log("User login successfully:", result);
                } else {
                    console.error("Error:", result.error);
                    setError(result.error);
                }
            } catch (error) {
                console.error("Error:", error);
        }
        }
    };

    return (
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
            <Mail name="email" value={formData.email} onChange={handleChange} />
            <Password name="password" value={formData.password} onChange={handleChange} />
            <Button variant={(valid.email && valid.password) ? "default" : "disabled"}>
                Login
            </Button>
            {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-2" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
            )}
        </form>
    );
}
