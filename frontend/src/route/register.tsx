import React from "react";
import Button from "../ui/button";

import RegisterForm from "../component/registerForm";

export default function Register() {
  return (
    <div className="mx-auto max-w-xl rounded-md border-border p-4 shadow-md">
      <h1 className="mb-4 text-center text-2xl font-bold text-fg">
        Register to Twitter
      </h1>
      <RegisterForm />
      <div className="flex justify-end">
        <Button variant="transparent" className="mt-2 text-sm" link="/login">
          J'ai déjà un compte
        </Button>
      </div>
    </div>
  );
}
