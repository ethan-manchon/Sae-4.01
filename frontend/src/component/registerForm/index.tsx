import React, { useState } from "react";
import { SignUp } from "../../lib/SignService";
import Pseudo from "../../ui/pseudo/";
import Mail from "../../ui/mail/";
import Password from "../../ui/password/";
import Button from "../../ui/button/";
import Error from "../../ui/error/";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    pseudo: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [valid, setValid] = useState({
    pseudo: false,
    email: false,
    password: false,
  });

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password,
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setValid((prev) => ({
      ...prev,
      [name]:
        name === "email"
          ? validateEmail(value)
          : name === "password"
            ? validatePassword(value)
            : value.trim().length > 3,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (valid.pseudo && valid.email && valid.password) {
      const formDataToSend = new FormData();
      formDataToSend.append("pseudo", formData.pseudo);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);

      const result = await SignUp(formDataToSend);
      if (result.status === 200 || result.status === 201) {
        setSuccess(
          "Registration successful! Please check your email to confirm your account.",
        );
        setError("");
      } else {
        setError(result.error || "Registration failed.");
        setSuccess("");
      }
    }
  };

  return (
    <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
      <Pseudo name="pseudo" value={formData.pseudo} onChange={handleChange} />
      <Mail name="email" value={formData.email} onChange={handleChange} />
      <Password
        type="register"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />
      <Button
        variant={
          valid.pseudo && valid.email && valid.password ? "default" : "disabled"
        }
      >
        Register
      </Button>
      {error && !success && <Error error={error} />}
      {success && (
        <div
          className="relative mt-2 rounded border border-success-border bg-success-bg px-4 py-3 text-success"
          role="alert"
        >
          <span className="block sm:inline">{success}</span>
        </div>
      )}
    </form>
  );
}
