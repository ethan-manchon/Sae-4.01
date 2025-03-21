<?php

namespace App\Service;

use App\Dto\Payload\CreatePostPayload;
use App\Entity\Post;
use Doctrine\ORM\EntityManagerInterface;

class PostService
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function create($content): Post
    {
        $content = $content->content;
        $post = new Post();
        $post->setContent($content);
        $post->setCreatedAt(new \DateTimeImmutable());



        $this->entityManager->persist($post);
        $this->entityManager->flush(); 

        return $post; 
    }
}
