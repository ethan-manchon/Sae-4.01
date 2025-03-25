<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\PostService;
use Symfony\Bundle\SecurityBundle\Security; 
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Repository\PostRepository;
use App\Dto\Payload\CreatePostPayload;


class PostController extends AbstractController
{
    private Security $security;
    private PostService $postService;

    public function __construct(Security $security, PostService $postService)
    {
        $this->security = $security;
        $this->postService = $postService;
    }
    #[Route('/')]
    public function base(): Response
    {
        return $this->render('base.html.twig',
        [
            'create' => 'posts',
        ]);
    }

    // Get posts
    #[Route('/api/posts', name: 'posts.index', methods: ['GET'])]
    public function index(Request $request, PostRepository $postRepository): Response
    {
        $page = $request->query->getInt('page', 1); // Par défaut, on commence à la page 1
        $limit = 15; // Nombre d'éléments par page
        $offset = ($page - 1) * $limit; // Calcul de l'offset
        

        $paginator = $postRepository->paginateAllOrderedByLatest($offset, $limit);
        $totalPostsCount = $paginator->count();
        
        $previousPage = $page > 1 ? $page - 1 : null;
        $nextPage = ($page * $limit) >= $totalPostsCount ? null : $page + 1;

        $postsArray = [];

        foreach ($paginator as $post) {
            $postsArray[] = [
                'id' => $post->getId(),
                'content' => $post->getContent(),
                'createdAt' => $post->getCreatedAt()->format('Y-m-d H:i:s'),
                'user' => [
                    'id' => $post->getUser()->getId(),
                    'pseudo' => $post->getUser()->getPseudo()
                ]
            ];
        }
        
        return $this->json([
            'posts' => $postsArray,
            'previous_page' => $previousPage,
            'next_page' => $nextPage
        ]);
        
    }

    #[Route('/api/posts', name: 'posts.create', methods: ['POST'], format: 'json')]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['content']) || empty(trim($data['content']))) {
            return new JsonResponse(['error' => 'Content cannot be empty'], Response::HTTP_BAD_REQUEST);
        }

        $user = $this->security->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $payload = new CreatePostPayload($data['content']);
        $post = $this->postService->create($payload, $user);

        return new JsonResponse([
            'message' => 'Post created successfully',
            'id' => $post->getId(),
            'content' => $post->getContent(),
            'createdAt' => $post->getCreatedAt()->format(\DateTime::ATOM)
        ], Response::HTTP_CREATED);
    }
}