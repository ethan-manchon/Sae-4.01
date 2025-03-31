<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Entity\Post;
use App\Entity\Like;
use App\Entity\Respond;
use App\Service\PostService;
use App\Repository\SubscribeRepository;
use App\Repository\UserRepository;
use App\Repository\PostRepository;
use App\Dto\Payload\CreatePostPayload;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;


#[Route('/api')]
class PostController extends AbstractController
{
    private Security $security;
    private PostService $postService;

    public function __construct(Security $security, PostService $postService)
    {
        $this->security = $security;
        $this->postService = $postService;
    }

    #[Route('/posts', name: 'api_posts_index', methods: ['GET'])]
    public function index(Request $request, PostRepository $postRepository): JsonResponse
    {
        $page = $request->query->getInt('page', 1);
        $limit = 15;
        $offset = ($page - 1) * $limit;

        $paginator = $postRepository->paginateAllOrderedByLatest($offset, $limit);
        $totalPostsCount = $paginator->count();

        $previousPage = $page > 1 ? $page - 1 : null;
        $nextPage = ($page * $limit) >= $totalPostsCount ? null : $page + 1;

        $postsArray = [];

        foreach ($paginator as $post) {
            $author = $post->getUser();
        
            if ($author->isBanned()) {
                $postsArray[] = [
                    'id' => $post->getId(),
                    'content' => 'Ce compte a été bloqué pour non respect des conditions d’utilisation.',
                    'createdAt' => $post->getCreatedAt()->format('Y-m-d H:i:s'),
                    'user' => [
                        'id' => $author->getId(),
                        'pseudo' => $author->getPseudo(),
                        'pdp' => $author->getPdp(),
                    ],
                    'banned' => true
                ];
            } else {
                $postsArray[] = [
                    'id' => $post->getId(),
                    'content' => $post->getContent(),
                    'createdAt' => $post->getCreatedAt()->format('Y-m-d H:i:s'),
                    'user' => [
                        'id' => $author->getId(),
                        'pseudo' => $author->getPseudo(),
                        'pdp' => $author->getPdp(),
                    ],
                    'banned' => false
                ];
            }
        }

        return $this->json([
            'posts' => $postsArray,
            'previous_page' => $previousPage,
            'next_page' => $nextPage,
        ]);
    }

    #[Route('/posts', name: 'api_posts_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $user = $this->getUser();

        if ($user->isBanned()) {
            return $this->json([
                'error' => 'Votre compte est bloqué. Vous ne pouvez plus interagir avec la plateforme.'
            ], 403);
        }
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
            'createdAt' => $post->getCreatedAt()->format(\DateTime::ATOM),
        ], Response::HTTP_CREATED);
    }

    #[Route('/posts/{id}', name: 'delete_post', methods: ['DELETE'])]
    public function delete(Post $post, EntityManagerInterface $em, TokenStorageInterface $tokenStorage): JsonResponse
    {
        $user = $tokenStorage->getToken()->getUser();
    
        if (!$user || !method_exists($user, 'getId')) {
            return new JsonResponse(['error' => 'Utilisateur non connecté ou invalide'], Response::HTTP_FORBIDDEN);
        }
    
        if ($post->getUser()->getId() !== $user->getId()) {
            return new JsonResponse(['error' => 'Non autorisé'], Response::HTTP_FORBIDDEN);
        }
            $responds = $post->getResponds();
            if ($responds !== null) {
                foreach ($responds as $respond) {
                    $em->remove($respond);
                }
            }
    
            $likes = $em->getRepository(Like::class)->findBy(['post' => $post]);
            if ($likes !== null) {
                foreach ($likes as $like) {
                    $em->remove($like);
                }
            }
            $em->remove($post);
            $em->flush();
    
            return new JsonResponse(['success' => true]);
    }
    
    #[Route('/posts/{id}', name: 'patch_post', methods: ['PATCH'])]
    public function patch(Post $post, EntityManagerInterface $em, Request $request, TokenStorageInterface $tokenStorage): JsonResponse
    {
        $user = $tokenStorage->getToken()->getUser();

        $data = json_decode($request->getContent(), true);


        if (!isset($data['content']) || empty(trim($data['content']))) {
            return new JsonResponse(['error' => 'Content cannot be empty'], Response::HTTP_BAD_REQUEST);
        }

        $post->setContent($data['content']);
        $em->flush();

        return new JsonResponse(['success' => true]);
    }

    #[Route('/feed', name: 'api_feed', methods: ['GET'])]
    public function feed(
        Request $request,
        PostRepository $postRepository,
        SubscribeRepository $subscribeRepository
    ): JsonResponse {
        $user = $this->getUser();
    
        $page = $request->query->getInt('page', 1);
        $limit = 10;
        $offset = ($page - 1) * $limit;
    
        $subscriptions = $subscribeRepository->findBy(['follower' => $user]);
        $followedUsers = array_map(fn($sub) => $sub->getFollowing(), $subscriptions);
    
        $posts = $postRepository->findBy(
            ['user' => $followedUsers],
            ['created_at' => 'DESC'],
            $limit,
            $offset
        );
    
        $total = $postRepository->count(['user' => $followedUsers]);
    
        $postsArray = [];
    
        foreach ($posts as $post) {
            $author = $post->getUser();
        
            if ($author->isBanned()) {
                $postsArray[] = [
                    'id' => $post->getId(),
                    'content' => 'Ce compte a été bloqué pour non respect des conditions d’utilisation.',
                    'createdAt' => $post->getCreatedAt()->format('Y-m-d H:i:s'),
                    'user' => [
                        'id' => $author->getId(),
                        'pseudo' => $author->getPseudo(),
                        'pdp' => $author->getPdp(),
                    ],
                    'banned' => true 
                ];
            } else {
                $postsArray[] = [
                    'id' => $post->getId(),
                    'content' => $post->getContent(),
                    'createdAt' => $post->getCreatedAt()->format('Y-m-d H:i:s'),
                    'user' => [
                        'id' => $author->getId(),
                        'pseudo' => $author->getPseudo(),
                        'pdp' => $author->getPdp(),
                    ],
                    'banned' => false
                ];
            }
        }
        
        $previousPage = $page > 1 ? $page - 1 : null;
        $nextPage = ($page * $limit) < $total ? $page + 1 : null;
    
        return $this->json([
            'posts' => $postsArray,
            'previous_page' => $previousPage,
            'next_page' => $nextPage,
            'total' => $total,
        ]);
    }
    

}
