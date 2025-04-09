<?php

namespace App\Controller\Api;

use App\Entity\Post;
use App\Entity\Repost;
use App\Repository\PostRepository;
use App\Repository\RepostRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use App\Security\BlockCheckerTrait;

#[Route('/api/reposts')]
class RepostController extends AbstractController
{
    use BlockCheckerTrait;

    #[Route('/{id}', name: 'get', methods: ['GET'])]
    public function get(int $id, RepostRepository $repostRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $post = $entityManager->getRepository(Post::class)->find($id);
        if (!$post) {
            return $this->json(['error' => 'Post not found'], 404);
        }

        $currentUser = $this->getUser();
        $blocked = false;
        
        if ($post->isCensor()) {
            return $this->json([
                'reposts' => [],
                'isBlocked' => $blocked,
            ]);
        }

        $reposts = $repostRepository->findBy(['post' => $post]);
        
        $data = array_map(function (Repost $repost) {
            $user = $repost->getUserId();
            return [
                'id' => $repost->getId(),
                'created_at' => $repost->getCreatedAt()->format('Y-m-d H:i:s'),
                'user' => [
                    'id' => $user->getId(),
                    'pseudo' => $user->getPseudo(),
                ],
            ];
        }, $reposts);
     
        return $this->json([
            'reposts' => $data,
            'isBlocked' => $blocked,
        ]);
    }

    #[Route('', name: 'app_repost_create', methods: ['POST'])]
    public function create(
        Request $request,
        PostRepository $postRepo,
        RepostRepository $repostRepo,
        EntityManagerInterface $em
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $postId = $data['post_id'] ?? null;

        if (!$postId) {
            return $this->json(['error' => 'post_id is required'], 400);
        }

        $post = $postRepo->find($postId);
        if (!$post) {
            return $this->json(['error' => 'Post not found'], 404);
        }

        $comment = $data['comment'] ?? null;

        $currentUser = $this->getUser();

        if ($currentUser && $post->getUser()->getId() !== $currentUser->getId()) {
            if ($this->checkIfBlocked($post->getUser(), $currentUser)) {
                $blocked = true;
            }
        }
        $user = $this->getUser();

        $repost = new Repost();
        $repost->setUserId($user);
        $repost->setPostId($post);
        $repost->setComment($comment);
        $repost->setCreatedAt(new \DateTimeImmutable());

        $em->persist($repost);
        $em->flush();

        return $this->json([
            'message' => 'Repost created',
            'repost' => [
                'id' => $repost->getId(),
                'created_at' => $repost->getCreatedAt()->format('Y-m-d H:i:s'),
                'comment' => $repost->getComment(),
                'post' => [
                    'id' => $post->getId(),
                    'content' => $post->getContent(),
                    'author' => $post->getUser()->getPseudo(),
                    'created_at' => $post->getCreatedAt()->format('Y-m-d H:i:s')
                ]
            ]
        ], 201);
    }

    #[Route('/{id}', name: 'app_repost_delete', methods: ['DELETE'])]
    public function delete(int $id, RepostRepository $repostRepo, EntityManagerInterface $em): JsonResponse
    {
        $repost = $repostRepo->find($id);
        if (!$repost) {
            return $this->json(['error' => 'Repost not found'], 404);
        }

        if ($repost->getUserId() !== $this->getUser()) {
            return $this->json(['error' => 'Unauthorized'], 403);
        }

        $em->remove($repost);
        $em->flush();

        return $this->json(['message' => 'Repost deleted']);
    }

}
