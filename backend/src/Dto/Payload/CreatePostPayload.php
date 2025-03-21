<?php

namespace App\Dto\Payload;

use Symfony\Component\Validator\Constraints as Assert;

class CreatePostPayload
{
    #[Assert\NotBlank(message: "Le message ne peut pas être vide.")]
    #[Assert\Length(min: 2, max: 280, minMessage: "Le message doit contenir au moins 2 caractères.", maxMessage: "Le message ne peut pas dépasser 280 caractères.")]
    public string $content;

    public function __construct(string $content)
    {
        $this->content = $content;
    }
}
