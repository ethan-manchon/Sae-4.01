<?php

namespace App\Service;

use App\Entity\Post;
use App\Entity\User;
use App\Dto\Payload\CreatePostPayload;
use Doctrine\ORM\EntityManagerInterface;

class PostService
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {}

    public function create(CreatePostPayload $payload, User $user): Post
    {
        $post = new Post();
        $post->setContent($payload->getContent());
        $post->setCreatedAt(new \DateTimeImmutable());
        $post->setUser($user); 

        $this->entityManager->persist($post);
        $this->entityManager->flush();

        return $post;
    }
}
