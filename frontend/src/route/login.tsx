import React from "react";
import Button from "../ui/button";

import LoginForm from "../component/loginForm";

export default function Login() {
    return (
        <div className="p-4 border-gray-300 rounded-md max-w-xl mx-auto shadow-md ">
            <h1 className="text-2xl text-dark font-bold mb-4 text-center">Login to Twitter</h1>
            <LoginForm />
            <div className="flex justify-end">
                <Button variant="transparent" className="text-sm mt-2" link="/register">
                    Créer mon compte
                </Button>
            </div>
        </div>
    );
}
