<?php

namespace App\Controller;

use App\Service\PostService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Repository\PostRepository;
use App\Dto\Payload\CreatePostPayload;

class PostController extends AbstractController
{
    #[Route('/')]
    public function base(): Response
    {
        return $this->render('base.html.twig',
        [
            'create' => 'posts',
        ]);
    }

    // Get all posts
    #[Route('/posts', name: 'posts.index', methods: ['GET'])]
    public function index(Request $request, PostRepository $postRepository): Response
    {
        $page = $request->query->getInt('page', 1); // Par défaut, on commence à la page 1
        $limit = 5; // Nombre d'éléments par page
        $offset = ($page - 1) * $limit; // Calcul de l'offset
        

        $paginator = $postRepository->paginateAllOrderedByLatest($offset, $limit);
        $totalPostsCount = $paginator->count();
        
        $previousPage = $page > 1 ? $page - 1 : null;
        $nextPage = ($page * $limit) >= $totalPostsCount ? null : $page + 1;

        return $this->json([
            'posts' => $paginator,
            'previous_page' => $previousPage,
            'next_page' => $nextPage
        ]);
    }

    #[Route('/posts', name: 'posts.create', methods: ['POST'], format: 'json')]
    public function create(Request $request, PostService $postService): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['content']) || empty(trim($data['content']))) {
            return new JsonResponse(['error' => 'Content cannot be empty'], Response::HTTP_BAD_REQUEST);
        }
    
        $payload = new CreatePostPayload($data['content']);
        $post = $postService->create($payload);
    
        return new JsonResponse(['message' => 'Post created successfully'], Response::HTTP_CREATED);
    }

}
