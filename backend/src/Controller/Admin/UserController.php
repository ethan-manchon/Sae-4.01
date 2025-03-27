<?php

namespace App\Controller\Admin;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/admin/users')]
class UserController extends AbstractController
{
    #[Route('/{id}', name: 'admin_user_show', methods: ['GET'])]
    public function show(int $id, UserRepository $userRepository): JsonResponse
    {
        $user = $userRepository->find($id);

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non trouvé'], 404);
        }

    return $this->json([
        'id' => $user->getId(),
        'pseudo' => $user->getPseudo(),
        'email' => $user->getEmail(),
        'roles' => $user->getRoles(),
        'blocked' => $user->isBlocked(), 
    ]);
    }

    #[Route('', name: 'admin_users_index', methods: ['GET'])]
    public function index(Request $request, UserRepository $userRepository): JsonResponse
    {
        $page = $request->query->getInt('page', 1);
        $limit = 5;
        $offset = ($page - 1) * $limit;

        $paginator = $userRepository->findBy([], null, $limit, $offset);
        $totalUsersCount = $userRepository->count([]);

        $usersArray = array_map(fn($user) => [
            'id' => $user->getId(),
            'pseudo' => $user->getPseudo(),
            'email' => $user->getEmail(),
            'blocked' => $user->IsBlocked(),
            'roles' => $user->getRoles(),
        ], $paginator);

        return $this->json([
            'users' => $usersArray,
            'previous_page' => $page > 1 ? $page - 1 : null,
            'next_page' => ($page * $limit) >= $totalUsersCount ? null : $page + 1,
            'total_users' => $totalUsersCount,
        ]);
    }

    #[Route('/{id}', name: 'admin_user_update', methods: ['PATCH'])]
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
    
        if (isset($data['isBlocked'])) {
            $user->setIsBlocked((bool) $data['isBlocked']);
        }
    
        $em->flush();
    
        return new JsonResponse(['message' => 'Utilisateur mis à jour']);
    }
}
