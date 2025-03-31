<?php

namespace App\Controller\Api;

use App\Entity\Like;
use App\Entity\Post;
use App\Entity\User;
use App\Repository\LikeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class LikeController extends AbstractController
{
    #[Route('/likes', name: 'app_likes_index', methods: ['GET'])]
    public function index(LikeRepository $likeRepository): JsonResponse
    {
        $likes = $likeRepository->findAll();
        
        $data = [];
    
        foreach ($likes as $like) {
            $post = $like->getPost();
            $author = $post->getUser();
    
            if ($author->isBanned()) {
                continue; 
            }
    
            $data[] = [
                'id' => $like->getId(),
                'post' => $post->getId(),
                'user' => $like->getUser()->getId(),
            ];
        }
    
        return $this->json($data);
    }

    #[Route('/likes/{id}', name: 'like_get', methods: ['GET'])]
    public function get(Like $like): JsonResponse
    {
        return $this->json([
            'id' => $like->getId(),
            'post' => $like->getPost()->getId(),
            'user' => $like->getUser()->getId(),
        ]);
    }

    #[Route('/likes', name: 'api_like_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em, LikeRepository $likeRepo): JsonResponse
    {
        $user = $this->getUser();

        if ($user->isBanned()) {
            return $this->json([
                'error' => 'Votre compte est bloqué. Vous ne pouvez plus interagir avec la plateforme.'
            ], 403);
        }
        
        if (!$user instanceof User) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }
        
        $data = json_decode($request->getContent(), true);
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
    
        if ($likeRepo->isPostLikedByUser($post, $user)) {
            return $this->json(['message' => 'Already liked'], 200);
        }
    
        $like = new Like();
        $like->setUser($user);
        $like->setPost($post);
        $em->persist($like);
        $em->flush();
    
        return $this->json(['message' => 'Like created', 'id' => $like->getId()], 201);
    }
    

    #[Route('/likes/{id}', name: 'api_like_delete', methods: ['DELETE'])]
    public function delete(Like $like, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User || $like->getUser() !== $user) {
            return $this->json(['error' => 'Forbidden'], 403);
        }

        $em->remove($like);
        $em->flush();

        return $this->json(['message' => 'Like deleted']);
    }

    #[Route('/likes/post/{postId}', name: 'api_like_by_post', methods: ['GET'])]
    public function indexByPost( int $postId, LikeRepository $likeRepo, EntityManagerInterface $em ): JsonResponse {
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
