<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

class UserController extends AbstractController
{
    // Get users
    #[Route('/admin/users', name: 'users.index', methods: ['GET'])]
    public function index(Request $request, UserRepository $userRepository): Response
    {
        $page = $request->query->getInt('page', 1); // Par défaut, on commence à la page 1
        $limit = 5; // Nombre d'éléments par page
        $offset = ($page - 1) * $limit; // Calcul de l'offset

        $paginator = $userRepository->findBy([], null, $limit, $offset);
        $totalUsersCount = $userRepository->count([]);

        $previousPage = $page > 1 ? $page - 1 : null;
        $nextPage = ($page * $limit) >= $totalUsersCount ? null : $page + 1;

        $usersArray = [];

        foreach ($paginator as $user) {
            $usersArray[] = [
                'id' => $user->getId(),
                'pseudo' => $user->getPseudo(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),
            ];
        }

        return $this->json([
            'users' => $usersArray,
            'previous_page' => $previousPage,
            'next_page' => $nextPage,
            'total_users' => $totalUsersCount,
        ]);
    }
    #[Route('/admin/users/{id}', name: 'user_update', methods: ['PATCH'])]
public function update(Request $request, UserRepository $userRepository, EntityManagerInterface $em, int $id): JsonResponse
{
    $user = $userRepository->find($id);

    if (!$user) {
        return new JsonResponse(['error' => 'Utilisateur introuvable'], 404);
    }

    $data = json_decode($request->getContent(), true);

    if (isset($data['pseudo'])) {
        $user->setPseudo($data['pseudo']);
    }

    if (isset($data['email'])) {
        $user->setEmail($data['email']);
    }

    if (isset($data['roles']) && is_array($data['roles'])) {
        $user->setRoles($data['roles']);
    }

    $em->flush();

    return new JsonResponse(['message' => 'Utilisateur mis à jour']);
}
}
