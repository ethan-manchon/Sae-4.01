import React, { useState } from "react";
import Pseudo from "../../ui/pseudo/";
import Mail from "../../ui/mail/";
import Password from "../../ui/password/";
import Button from "../../ui/button/";

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        pseudo: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    
    const [valid, setValid] = useState({
        pseudo: false,
        email: false,
        password: false
    });

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    
    const validatePassword = (password) => {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
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
        
        if (valid.pseudo && valid.email && valid.password) {
            const formDataToSend = new FormData();
            formDataToSend.append("pseudo", formData.pseudo);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("password", formData.password);
            
            try {
                const response = await fetch("http://127.0.0.1:8080/register", {
                    method: "POST",
                    body: formDataToSend
                });

                const result = await response.json();
                if (response.ok) {
                    console.log("User registered successfully:", result);
                    window.location.href = "/login";
                } else {
                    console.error("Error:", result.error);
                    setError(result.error);
                }
            } catch (error) {
                console.error("Request failed:", error);
                setError(error.toString());
            }
        }
    };

    return (
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
            <Pseudo name="pseudo" value={formData.pseudo} onChange={handleChange} />
            <Mail name="email" value={formData.email} onChange={handleChange} />
            <Password type="register" name="password" value={formData.password} onChange={handleChange} />
            <Button variant={(valid.pseudo && valid.email && valid.password) ? "default" : "disabled"}>
            Register
            </Button>
            {error && (
            <div className="bg-error-bg border border-error-border text-error px-4 py-3 rounded relative mt-2" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
            )}
        </form>
    );
}
