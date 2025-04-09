<?php

namespace App\Controller\Api;

use App\Entity\Post;
use App\Entity\Repost;
use App\Entity\Like;
use App\Repository\PostRepository;
use App\Repository\RepostRepository;
use App\Repository\UserRepository;
use App\Repository\SubscribeRepository;
use App\Service\PostService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

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
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function index(
        Request $request,
        PostRepository $postRepo,
        RepostRepository $repostRepo,
        UserRepository $userRepo,
        SubscribeRepository $subscribeRepo

    ): JsonResponse {
        $user = $this->getUser();

        $userId = $request->query->get('userId');
        $subscribe = $request->query->getBoolean('subscribe', false);
        $page = $request->query->getInt('page', 1);
        $limit = 10;
        $offset = ($page - 1) * $limit;

        $usersToInclude = [];

        if ($userId) {
            $profileUser = $userRepo->find($userId);
            if (!$profileUser) {
                return $this->json(['error' => 'User not found'], 404);
            }
            $usersToInclude[] = $profileUser;
        } else if ($subscribe) {
            $user = $this->getUser();
    
            $subscriptions = $subscribeRepo->findBy(['follower' => $user]);
            $followedUsers = array_map(fn($sub) => $sub->getFollowing(), $subscriptions);

            $usersToInclude = array_merge($followedUsers);
         } else {
            $usersToInclude = $userRepo->findAll();
        }

        $posts = $postRepo->createQueryBuilder('p')
            ->where('p.user IN (:users)')
            ->setParameter('users', $usersToInclude)
            ->orderBy('p.created_at', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();

        $reposts = $repostRepo->createQueryBuilder('r')
            ->where('r.user IN (:users)')
            ->setParameter('users', $usersToInclude)
            ->orderBy('r.created_at', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();

        $feedItems = [];

        foreach ($posts as $post) {
            $author = $post->getUser();
    
            if (!$author) {
                continue;
            }
    
            if ($author->isBanned()) {
                $feedItems[] = [
                    'type' => 'post',
                    'id' => $post->getId(),
                    'content' => 'Ce compte a été bloqué pour non respect des conditions d’utilisation.',
                    'created_at' => $post->getCreatedAt()->format('Y-m-d H:i:s'),
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
    
                $feedItems[] = [
                    'type' => 'post',
                    'id' => $post->getId(),
                    'content' => $isCensored ? 'Ce contenu a été censuré.' : $post->getContent(),
                    'created_at' => $post->getCreatedAt()->format('Y-m-d H:i:s'),
                    'user' => [
                        'id' => $author->getId(),
                        'pseudo' => $author->getPseudo(),
                        'pdp' => $author->getPdp(),
                    ],
                    'banned' => false,
                    'media' => $isCensored ? [] : $post->getMedia(),
                    'count' => count($post->getResponds()),
                    'censor' => $isCensored,
                    'readOnly' => $author->isReadOnly(),
                    'pinned' =>  $post->isPin(),
                ];
            }
        }
        foreach ($reposts as $repost) {
            
            $original = $repost->getPostId();
            $isCensored = $original->isCensor();
            $feedItems[] = [
                'type' => 'repost',
                'created_at' => $repost->getCreatedAt()->format('Y-m-d H:i:s'),
                'repost_id' => $repost->getId(),
                'user' => $repost->getUserId()->getPseudo(),
                'pdp' => $repost->getUserId()->getPdp(),
                'user_id' => $repost->getUserId()->getId(),
                'comment' => $repost->getComment(),
                'original_post' => [
                    'post_id' => $original->getId(),
                    'author' => $original->getUser()->getPseudo(),
                    'user_id' => $original->getUser()->getId(),
                    'pdp' => $original->getUser()->getPdp(),
                    'content' =>  $isCensored ? 'Ce contenu a été censuré.' : $original->getContent(),
                    'media' => $isCensored ? [] : $original->getMedia(),
                    'created_at' => $original->getCreatedAt()->format('Y-m-d H:i:s'),
                    'censor' => $isCensored,
                ]
            ];
        }

        if ($userId) {         
            usort($feedItems, function($a, $b) {
                $aPinned = $a['type'] === 'post' && isset($a['pinned']) ? $a['pinned'] : false;
                $bPinned = $b['type'] === 'post' && isset($b['pinned']) ? $b['pinned'] : false;
                
                if ($aPinned !== $bPinned) {
                    return $bPinned <=> $aPinned; 
                }
                
                return strtotime($b['created_at']) <=> strtotime($a['created_at']);
            });
        } else {
            usort($feedItems, fn($a, $b) => strtotime($b['created_at']) <=> strtotime($a['created_at']));
        }

        return $this->json([
            'items' => array_slice($feedItems, 0, $limit),
            'page' => $page,
            'limit' => $limit
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
    public function patch(
        Post $post,
        EntityManagerInterface $em,
        Request $request,
        TokenStorageInterface $tokenStorage
    ): JsonResponse {
        $user = $tokenStorage->getToken()->getUser();
    
        if (!$user instanceof \App\Entity\User) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }
    
        if ($post->getUser()->getId() !== $user->getId()) {
            return new JsonResponse(['error' => 'Vous n’êtes pas autorisé à modifier ce post'], 403);
        }
    
        if ($request->get('pin') !== null) {
            $newPin = filter_var($request->get('pin'), FILTER_VALIDATE_BOOLEAN);
            $post->setPin($newPin);
            $em->flush();
            
            return new JsonResponse(['success' => true, 'pin' => $post->isPin()]);
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
                $currentMedia = array_filter($currentMedia, fn($url) => !in_array($url, $removedMedia));
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
    #[Route('/hashtag/{tag}', name: 'api_hashtag', methods: ['GET'])]
public function searchByHashtag(PostRepository $postRepository, string $tag, Request $request): JsonResponse
{
    $page = max(1, (int) $request->query->get('page', 1));
    $limit = 10;
    $offset = ($page - 1) * $limit;

    $queryBuilder = $postRepository->createQueryBuilder('p')
        ->where('p.content LIKE :tag')
        ->setParameter('tag', '%#' . $tag . '%')
        ->orderBy('p.created_at', 'DESC')
        ->setFirstResult($offset)
        ->setMaxResults($limit);

    $posts = $queryBuilder->getQuery()->getResult();

    $items = array_map(function ($post) {
        return [
            'id' => $post->getId(),
            'content' => $post->getContent(),
            'created_at' => $post->getCreatedAt()->format('c'),
            'user' => [
                'id' => $post->getUser()->getId(),
                'pseudo' => $post->getUser()->getPseudo(),
                'pdp' => $post->getUser()->getPdp()
            ],
            'media' => $post->getMedia(), 
            'censor' => $post->isCensor(),
            'banned' => $post->getUser()->isBanned(),
        ];
    }, $posts);

    return $this->json([
        'items' => $items
    ]);
}
#[Route('/search', name: 'api_posts_search', methods: ['GET'])]
public function searchPosts(
    Request $request,
    PostRepository $postRepository,
    RepostRepository $repostRepository,
    Security $security
): JsonResponse {
    $query = $request->query->get('query', '');
    $userFilter = $request->query->get('user', '');
    $typeFilter = $request->query->get('type', '');
    $dateFilter = $request->query->get('date', '');
    $page = max(1, (int)$request->query->get('page', 1));
    $limit = 10;
    $offset = ($page - 1) * $limit;

    $user = $security->getUser();

    $items = [];

    if ($typeFilter === '' || $typeFilter === 'post') {
        $posts = $postRepository->createQueryBuilder('p')
            ->leftJoin('p.user', 'u')
            ->addSelect('u')
            ->where('p.censor = false')
            ->orderBy('p.created_at', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit);

        if ($query) {
            $posts->andWhere('p.content LIKE :query')
                ->setParameter('query', '%' . $query . '%');
        }

        if ($userFilter === 'me' && $user) {
            $posts->andWhere('p.user = :me')->setParameter('me', $user);
        } elseif ($userFilter === 'other' && $user) {
            $posts->andWhere('p.user != :me')->setParameter('me', $user);
        }

        if ($dateFilter) {
            $start = \DateTime::createFromFormat('Y-m-d', $dateFilter);
            if ($start) {
                $end = (clone $start)->modify('+1 day');
                $posts->andWhere('p.created_at >= :start AND p.created_at < :end')
                      ->setParameter('start', $start)
                      ->setParameter('end', $end);
            }
        }
        

        foreach ($posts->getQuery()->getResult() as $post) {
            $u = $post->getUser();
            if ($u?->isBanned()) continue;

            $items[] = [
                'type' => 'post',
                'id' => $post->getId(),
                'content' => $post->getContent(),
                'created_at' => $post->getCreatedAt()?->format('c'),
                'censor' => $post->isCensor(),
                'media' => $post->getMedia(),
                'user' => [
                    'id' => $u->getId(),
                    'pseudo' => $u->getPseudo(),
                    'pdp' => $u->getPdp(),
                    'banned' => $u->isBanned(),
                    'readOnly' => $user->isReadOnly(),
                ]
            ];
        }
    }

    if ($typeFilter === '' || $typeFilter === 'repost') {
        $reposts = $repostRepository->createQueryBuilder('r')
            ->leftJoin('r.user', 'u')
            ->leftJoin('r.post', 'o')
            ->leftJoin('o.user', 'ou')
            ->addSelect('u', 'o', 'ou')
            ->orderBy('r.created_at', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit);

        if ($query) {
            $reposts->andWhere('r.content LIKE :query')
                ->setParameter('query', '%' . $query . '%');
        }

        if ($userFilter === 'me' && $user) {
            $reposts->andWhere('r.user = :me')->setParameter('me', $user);
        } elseif ($userFilter === 'other' && $user) {
            $reposts->andWhere('r.user != :me')->setParameter('me', $user);
        }

        if ($dateFilter) {
            $start = \DateTime::createFromFormat('Y-m-d', $dateFilter);
            if ($start) {
                $end = (clone $start)->modify('+1 day');
                $posts->andWhere('r.created_at >= :start AND r.created_at < :end')
                      ->setParameter('start', $start)
                      ->setParameter('end', $end);
            }
        }
        
        foreach ($reposts->getQuery()->getResult() as $r) {
            $author = $r->getUserId();
            $original = $r->getPostId();
            $originalUser = $original?->getUser();

            if (!$original || !$originalUser || $author?->isBanned() || $originalUser->isBanned()) continue;

            $items[] = [
                'type' => 'repost',
                'repost_id' => $r->getId(),
                'user_id' => $author->getId(),
                'user' => $author->getPseudo(),
                'pdp' => $author->getPdp(),
                'comment' => $r->getComment(),
                'created_at' => $r->getCreatedAt()?->format('c'),
                'original_post' => [
                    'post_id' => $original->getId(),
                    'author' => $originalUser->getPseudo(),
                    'user_id' => $originalUser->getId(),
                    'pdp' => $originalUser->getPdp(),
                    'content' => $original->getContent(),
                    'created_at' => $original->getCreatedAt()?->format('c'),
                    'media' => $original->getMedia(),
                    'censor' => $original->isCensor(),
                ]
            ];
        }
    }

    usort($items, fn($a, $b) => strtotime($b['created_at']) <=> strtotime($a['created_at']));

    $items = array_slice($items, 0, $limit);

    return $this->json(['items' => $items]);
}


}
    
