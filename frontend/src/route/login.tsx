import React from "react";
import Button from "../ui/button";

import LoginForm from "../component/loginForm";

export default function Login() {
  return (
    <div className="mx-auto max-w-xl rounded-md border-border p-4 shadow-md">
      <h1 className="mb-4 text-center text-2xl font-bold text-fg">
        Login to Twitter
      </h1>
      <LoginForm />
      <div className="flex justify-end">
        <Button variant="transparent" className="mt-2 text-sm" link="/register">
          Créer mon compte
        </Button>
      </div>
    </div>
  );
}
