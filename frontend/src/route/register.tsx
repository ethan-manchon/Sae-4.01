import React from "react";
import Button from "../ui/button";

import RegisterForm from "../component/registerForm";

export default function Register() {
    return (
        <div className="p-4 border-border rounded-md max-w-xl mx-auto shadow-md">
            <h1 className="text-2xl text-fg font-bold mb-4 text-center">Register to Twitter</h1>
            <RegisterForm />
            <div className="flex justify-end">
                <Button variant="transparent" className="text-sm mt-2" link="/login">
                    J'ai déjà un compte
                </Button>
            </div>
        </div>
    );
}
