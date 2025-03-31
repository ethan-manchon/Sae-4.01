<?php

namespace App\Controller\Api;

use App\Entity\Respond;
use App\Entity\Post;
use App\Repository\RespondRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/responds')]
final class RespondController extends AbstractController
{
    #[Route('/{id}', name: 'app_respond_get', methods: ['GET'])]
    public function get(int $id, RespondRepository $respondRepository): JsonResponse
    {
        $responds = $respondRepository->findAllByIdPost($id);
    
        $data = array_map(function ($respond) {
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
            'count' => count($data),
            'responses' => $data,
        ]);
    }

    #[Route('', name: 'app_respond_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['id_post'], $data['content'])) {
            return new JsonResponse(['error' => 'Invalid data'], Response::HTTP_BAD_REQUEST);
        }

        $post = $entityManager->getRepository(Post::class)->find($data['id_post']);

        if (!$post) {
            return new JsonResponse(['error' => 'Post non trouvé'], Response::HTTP_NOT_FOUND);
        }

        if ($post->getUserId()->isBanned()) {
            return new JsonResponse(['error' => 'Le propriétaire de ce post est banni.'], Response::HTTP_FORBIDDEN);
        }

        $post = $entityManager->getRepository(Post::class)->find($data['id_post']);

        if (!$post) {
            return $this->json(['error' => 'Post non trouvé'], 404);
        }

        
        $respond = new Respond();
        $respond->setIdPost($post);
        $respond->setContent($data['content']);
        $respond->setCreatedAt(new \DateTimeImmutable());
        $respond->setUserId($this->getUser());

        $entityManager->persist($respond);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Respond created successfully'], Response::HTTP_CREATED);
    }
    #[Route('/{id}', name: 'app_respond_delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $respond = $entityManager->getRepository(Respond::class)->find($id);

        if (!$respond) {
            return new JsonResponse(['error' => 'Respond not found'], Response::HTTP_NOT_FOUND);
        }

        $entityManager->remove($respond);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Respond deleted successfully'], Response::HTTP_OK);
    }
}
