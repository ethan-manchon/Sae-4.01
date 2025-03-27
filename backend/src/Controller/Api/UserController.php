<?php

namespace App\Controller\Api;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class UserController extends AbstractController
{
    #[Route('/me', name: 'api_me', methods: ['GET'])]
    public function me(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'Not authenticated'], 401);
        }

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'pseudo' => $user->getPseudo(),
            'pdp' => $user->getPdp(),
            'bio' => $user->getBio(),
            'banniere' => $user->getBanniere(),
            'locate' => $user->getLocate(),
            'url' => $user->getUrl(),
            'icon' => $user->getIcon(),
            'refresh' => $user->isRefresh(),
            'roles' => $user->getRoles(),
        ]);
    }

    #[Route('/profil/{pseudo}', name: 'api_profil', methods: ['GET'])]
    public function profil(string $pseudo, UserRepository $userRepository): JsonResponse
    {
        $user = $userRepository->findOneBy(['pseudo' => $pseudo]);

        if (!$user) {
            return $this->json(['error' => 'User not found'], 404);
        }

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'pseudo' => $user->getPseudo(),
            'pdp' => $user->getPdp(),
            'bio' => $user->getBio(),
            'banniere' => $user->getBanniere(),
            'locate' => $user->getLocate(),
            'url' => $user->getUrl(),
            'icon' => $user->getIcon(),
            'refresh' => $user->isRefresh(),
            'roles' => $user->getRoles(),
        ]);
    }

    #[Route('/users/{id}', name: 'api_user_refresh_update', methods: ['PATCH'])]
    public function updateRefresh(Request $request, UserRepository $userRepository, EntityManagerInterface $em, int $id): JsonResponse
    {
        $user = $userRepository->find($id);

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur introuvable'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['refresh'])) {
            $user->setRefresh($data['refresh']);
        }

        $em->flush();

        return new JsonResponse(['message' => 'Refresh mis à jour']);
    }
}