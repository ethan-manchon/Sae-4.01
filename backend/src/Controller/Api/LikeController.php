<?php

namespace App\Controller\Api;

use App\Entity\Like;
use App\Entity\Post;
use App\Entity\User;
use App\Repository\LikeRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Security\BlockCheckerTrait;


#[Route('/api/likes')]
class LikeController extends AbstractController
{
    use BlockCheckerTrait;

    #[Route('/{id}', name: 'app_likes_get', methods: ['GET'])]
    public function get(int $id, LikeRepository $likeRepository, EntityManagerInterface $entityManager): JsonResponse
    {

        $currentUser = $this->getUser();
        if (!$currentUser instanceof User) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }
    
        $post = $entityManager->getRepository(Post::class)->find($id);
        if (!$post) {
            return $this->json(['error' => 'Post not found'], 404);
        }
        if ($post->isCensor()) {
            return $this->json([
                'likes' => [],
                'isBlocked' => false,
            ]);
        }
        $targetUser = $post->getUser();

        $blocked = false;

        if ($targetUser->getId() !== $currentUser->getId()) {
            if ($this->checkIfBlocked($targetUser, $currentUser)) {
                $blocked = true;
            }
        }

        $likes = $likeRepository->findAllByIdPost($id);
        $data = array_map(function (Like $like) use ($blocked) {
                $user = $like->getUser();
                return [
                    'id' => $like->getId(),
                    'post' => $like->getPost()->getId(),
                    'user' => [
                        'id' => $user->getId(),
                        'pseudo' => $user->getPseudo(),
                    ],
                ];
            }, $likes);
        return $this->json([
            'likes' => $data,
            'isBlocked' => $blocked,
            ]
        );
    }

    #[Route('', name: 'api_like_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em, LikeRepository $likeRepo): JsonResponse
    {
        $currentUser = $this->getUser();
        if (!$currentUser instanceof User) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }
        if ($currentUser->isBanned()) {
            return $this->json(['error' => 'Votre compte est bloqué.'], 403);
        }
    
        // Récupération du JSON depuis la requête
        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return $this->json([
                'error' => 'JSON invalide',
                'content_received' => $request->getContent()
            ], 400);
        }
        
        $postId = $data['post_id'] ?? $request->request->get('post_id');
        if (!$postId) {
            return $this->json([
                'error' => 'Missing post_id',
                'body' => $request->getContent()
            ], 400);
        }
        
        $post = $em->getRepository(Post::class)->find($postId);
        if (!$post) {
            return $this->json(['error' => 'Post not found'], 404);
        }
        
        $targetUser = $post->getUser();
        if ($targetUser->getId() !== $currentUser->getId()) {
            $blockResponse = $this->checkIfBlocked($targetUser, $currentUser);
            if ($blockResponse !== null) {
                return $blockResponse;
            }
        }
        
        if ($likeRepo->isPostLikedByUser($post, $currentUser)) {
            return $this->json(['message' => 'Déjà liké'], 200);
        }
        
        $like = new Like();
        $like->setUser($currentUser);
        $like->setPost($post);
        
        $em->persist($like);
        $em->flush();
        
        return $this->json(['message' => 'Like créé', 'id' => $like->getId()], 201);
    }
    
    

    #[Route('/{id}', name: 'api_like_delete', methods: ['DELETE'])]
    public function delete(Like $like, EntityManagerInterface $em): JsonResponse
    {
        $currentUser = $this->getUser();

        if (!$currentUser instanceof User || $like->getUser() !== $currentUser) {
            return $this->json(['error' => 'Forbidden'], 403);
        }

        $em->remove($like);
        $em->flush();

        return $this->json(['message' => 'Like deleted']);
    }

    #[Route('/post/{postId}', name: 'api_like_by_post', methods: ['GET'])]
    public function indexByPost(int $postId, LikeRepository $likeRepo, EntityManagerInterface $em): JsonResponse
    {
        $post = $em->getRepository(Post::class)->find($postId);
        if (!$post) {
            return $this->json(['error' => 'Post not found'], 404);
        }

        if ($post->getUser()->isBanned()) {
            return $this->json(null);
        }

        $users = $likeRepo->getUsersWhoLikedPost($post);

        $data = array_map(fn(User $u) => [
            'id' => $u->getId(),
            'pseudo' => $u->getPseudo(),
        ], $users);

        return $this->json($data);
    }
}
