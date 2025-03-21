<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class CreateUserPayload
{
    #[Assert\NotBlank(message: "Email is required")]
    #[Assert\Email(message: "Invalid email format")]
    private string $email;

    #[Assert\NotBlank(message: "Password is required")]
    #[Assert\Length(min: 6, minMessage: "Password must be at least 6 characters long")]
    private string $password;

    public function __construct(string $email, string $password)
    {
        $this->email = $email;
        $this->password = $password;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getPassword(): string
    {
        return $this->password;
    }
}
