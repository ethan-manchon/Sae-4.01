<?php

namespace App\Controller\Api;

use App\Entity\Respond;
use App\Entity\Post;
use App\Entity\User;
use App\Repository\RespondRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Security\BlockCheckerTrait;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;



#[Route('/api/responds')]
final class RespondController extends AbstractController
{
    use BlockCheckerTrait;

    #[Route('/{id}', name: 'app_respond_get', methods: ['GET'])]
    public function get(int $id, RespondRepository $respondRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $currentUser = $this->getUser();
        if (!$currentUser instanceof User) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }
    
        $post = $entityManager->getRepository(Post::class)->find($id);
        if (!$post) {
            return $this->json(['error' => 'Post not found'], 404);
        }
    
        $targetUser = $post->getUser();

        $blocked = false;

        if ($targetUser->hasBlocked($currentUser)) {
            $blocked = true;
        }
    
        $responds = $respondRepository->findAllByIdPost($id);
        $data = array_map(function (Respond $respond) use ($blocked) {
            return [
                'id' => $respond->getId(),
                'id_post' => $respond->getIdPost()->getId(),
                'content' => $respond->getContent(),
                'createdAt' => $respond->getCreatedAt()->format('Y-m-d H:i:s'),
                'user' => [
                    'id' => $respond->getUserId()->getId(),
                    'pseudo' => $respond->getUserId()->getPseudo(),
                    'pdp' => $respond->getUserId()->getPdp(),
                ],
            ];
        }, $responds);
    
        return $this->json([
            'responses' => $data,
            'isBlocked' => $blocked,
    ]);
    }
    

    #[Route('', name: 'app_respond_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $currentUser = $this->getUser();
        if (!$currentUser instanceof User) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }
        if ($currentUser->isBanned()) {
            return $this->json(['error' => 'Votre compte est bloqué.'], 403);
        }

        $data = json_decode($request->getContent(), true);
        if (!isset($data['id_post'], $data['content'])) {
            return $this->json(['error' => 'Données invalides'], 400);
        }

        $post = $em->getRepository(Post::class)->find($data['id_post']);
        if (!$post) {
            return $this->json(['error' => 'Post introuvable'], 404);
        }

        $targetUser = $post->getUser();
        if ($targetUser->getId() !== $currentUser->getId()) {
            if ($this->checkIfBlocked($targetUser, $currentUser)) {
                return $this->json(['error' => 'Vous êtes bloqué par cet utilisateur.'], 403);
            }
        }

        $respond = new Respond();
        $respond->setIdPost($post);
        $respond->setContent($data['content']);
        $respond->setCreatedAt(new \DateTimeImmutable());
        $respond->setUserId($currentUser);

        $em->persist($respond);
        $em->flush();

        return $this->json(['message' => 'Commentaire publié'], 201);
    }

    #[Route('/{id}', name: 'app_respond_delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $currentUser = $this->getUser();

        if (!$currentUser instanceof User) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        $respond = $entityManager->getRepository(Respond::class)->find($id);

        if (!$respond) {
            return new JsonResponse(['error' => 'Respond not found'], Response::HTTP_NOT_FOUND);
        }

        if ($respond->getUserId() !== $currentUser) {
            return new JsonResponse(['error' => 'Forbidden'], Response::HTTP_FORBIDDEN);
        }

        $entityManager->remove($respond);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Respond deleted successfully'], Response::HTTP_OK);
    }
}
