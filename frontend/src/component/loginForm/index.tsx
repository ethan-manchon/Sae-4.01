import React, { useState } from "react";
import { SignIn } from "../../lib/SignService";
import Mail from "../../ui/mail/";
import Password from "../../ui/password/";
import Button from "../../ui/button/";
import Error from "../../ui/error/";

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
            
            const response = await SignIn(formDataToSend);
            
            if (response.status === 200) {
                window.location.href = "/";
            } else if (response.status === 401) {
                setError("Invalid email or password");
            } else {
                setError("An error occurred. Please try again.");
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
                <Error error={error} />
            )}
        </form>
    );
}
