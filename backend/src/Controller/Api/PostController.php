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


#[Route('/api/posts')]
class PostController extends AbstractController
{
    private Security $security;
    private PostService $postService;

    public function __construct(Security $security, PostService $postService)
    {
        $this->security = $security;
        $this->postService = $postService;
    }

    #[Route('', name: 'api_posts_index', methods: ['GET'])]
    public function index( Request $request, PostRepository $postRepository, SubscribeRepository $subscribeRepository): JsonResponse {
        $page = $request->query->getInt('page', 1);
        $limit = 15;
        $offset = ($page - 1) * $limit;
    
        $subscribe = $request->query->getBoolean('subscribe', false);
        $posts = [];
        $totalPostsCount = 0;
    
        if ($subscribe) {
            $user = $this->getUser();
    
            // On récupère les abonnements de l'utilisateur
            $subscriptions = $subscribeRepository->findBy(['follower' => $user]);
            $followedUsers = array_map(fn($sub) => $sub->getFollowing(), $subscriptions);
    
            if (!empty($followedUsers)) {
                // Posts uniquement des abonnements
                $posts = $postRepository->findBy(
                    ['user' => $followedUsers],
                    ['created_at' => 'DESC'],
                    $limit,
                    $offset
                );
                $totalPostsCount = $postRepository->count(['user' => $followedUsers]);
            } else {
                // Aucun abonnement → aucun post
                $posts = [];
                $totalPostsCount = 0;
            }
        } else {
            // Tous les posts
            $paginator = $postRepository->paginateAllOrderedByLatest($offset, $limit);
            $posts = iterator_to_array($paginator);
            $totalPostsCount = $paginator->count();
        }
    
        $previousPage = $page > 1 ? $page - 1 : null;
        $nextPage = ($page * $limit) >= $totalPostsCount ? null : $page + 1;
    
        $postsArray = [];
    
        foreach ($posts as $post) {
            $author = $post->getUser();
    
            if (!$author) {
                continue;
            }
    
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
                    'banned' => true,
                    'media' => [],
                    'count' => 0,
                    'censor' => false,
                ];
            } else {
                $isCensored = $post->isCensor();
    
                $postsArray[] = [
                    'id' => $post->getId(),
                    'content' => $isCensored ? 'Ce contenu a été censuré.' : $post->getContent(),
                    'createdAt' => $post->getCreatedAt()->format('Y-m-d H:i:s'),
                    'user' => [
                        'id' => $author->getId(),
                        'pseudo' => $author->getPseudo(),
                        'pdp' => $author->getPdp(),
                    ],
                    'banned' => false,
                    'media' => $isCensored ? [] : $post->getMedia(),
                    'count' => count($post->getResponds()),
                    'censor' => $isCensored,
                ];
            }
        }
    
        return $this->json([
            'posts' => $postsArray,
            'previous_page' => $previousPage,
            'next_page' => $nextPage,
            'total' => $totalPostsCount,
        ]);
    }
    
    #[Route('', name: 'api_posts_create', methods: ['POST'])]
public function create(Request $request, EntityManagerInterface $em): JsonResponse
{
    $user = $this->getUser();
    if (!$user instanceof \App\Entity\User) {
        return $this->json(['error' => 'Unauthorized'], 401);
    }
    if ($user->isBanned()) {
        return $this->json([
            'error' => 'Votre compte est bloqué. Vous ne pouvez plus interagir avec la plateforme.'
        ], 403);
    }

    $content = $request->request->get('content');
    if (empty(trim($content))) {
        return new JsonResponse(['error' => 'Content cannot be empty'], Response::HTTP_BAD_REQUEST);
    }

    $mediaFiles = $request->files->get('media');
    $mediaPaths = [];
    $uploadDir = $this->getParameter('kernel.project_dir') . '/public/assets/post';

    if ($mediaFiles) {
        if (!is_array($mediaFiles)) {
            $mediaFiles = [$mediaFiles];
        }

        foreach ($mediaFiles as $file) {
            if ($file->isValid()) {
                $newFilename = uniqid() . '.' . $file->guessExtension();

                try {
                    $file->move($uploadDir, $newFilename);
                    $mediaPaths[] = '/assets/post/' . $newFilename;
                } catch (FileException $e) {
                    return new JsonResponse(['error' => 'Échec de l\'upload du fichier : ' . $e->getMessage()], 500);
                }
            }
        }
    }
    $post = new Post();
    $post->setContent($content);
    $post->setCreatedAt(new \DateTime());
    $post->setUser($user);
    $post->setMedia($mediaPaths);

    $em->persist($post);
    $em->flush();

    return new JsonResponse([
        'message' => 'Post publié avec succès.',
        'post' => [
            'id' => $post->getId(),
            'text' => $post->getContent(),
            'createdAt' => $post->getCreatedAt()->format('Y-m-d H:i:s'),
            'user' => [
                'id' => $post->getUser()->getId(),
                'pseudo' => $post->getUser()->getPseudo(),
                'pdp' => $post->getUser()->getPdp(),
            ],
            'media' => $post->getMedia()
        ]
    ]);
}  
    #[Route('/{id}', name: 'delete_post', methods: ['DELETE'])]
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
    
    #[Route('/{id}', name: 'patch_post', methods: ['POST', 'PATCH'])]
    public function patch(Post $post, EntityManagerInterface $em, Request $request, TokenStorageInterface $tokenStorage): JsonResponse {
        $user = $tokenStorage->getToken()->getUser();
        if (!$user instanceof \App\Entity\User) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }
        if ($post->getUser()->getId() !== $user->getId()) {
            return new JsonResponse(['error' => 'Vous n’êtes pas autorisé à modifier ce post'], 403);
        }
        
        $content = $request->request->get('content') ?: $request->get('content');
        if (empty(trim($content))) {
            return new JsonResponse(['error' => 'Content cannot be empty'], Response::HTTP_BAD_REQUEST);
        }
        $post->setContent($content);
        
        $mediaFiles = $request->files->get('media');
        $currentMedia = $post->getMedia() ?: [];
        
        if ($mediaFiles) {
            if (!is_array($mediaFiles)) {
                $mediaFiles = [$mediaFiles];
            }
            $uploadDir = $this->getParameter('kernel.project_dir') . '/public/assets/post';
            foreach ($mediaFiles as $file) {
                if ($file->isValid()) {
                    $newFilename = uniqid() . '.' . $file->guessExtension();
                    try {
                        $file->move($uploadDir, $newFilename);
                        $currentMedia[] = '/assets/post/' . $newFilename;
                    } catch (FileException $e) {
                        return new JsonResponse(['error' => 'Échec de l\'upload du fichier : ' . $e->getMessage()], 500);
                    }
                }
            }
        }
        
        $removedMedia = $request->request->get('removedMedia');
        if ($removedMedia) {
            $removedMedia = json_decode($removedMedia, true);
            if (is_array($removedMedia)) {
                $currentMedia = array_filter($currentMedia, function ($mediaUrl) use ($removedMedia) {
                    return !in_array($mediaUrl, $removedMedia);
                });
                $currentMedia = array_values($currentMedia);
            }
        }

        if ($request->request->has('censor')) {
            $post->setCensor(filter_var($request->request->get('censor'), FILTER_VALIDATE_BOOLEAN));
        }

        $post->setMedia($currentMedia);
        $em->flush();
        
        return new JsonResponse(['success' => true]);
    }
}
