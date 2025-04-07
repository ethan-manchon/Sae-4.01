<?php

namespace App\Controller\Api;

use App\Entity\Blocked;
use App\Entity\User;
use App\Repository\BlockedRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/blockeds')]   
class BlockedController extends AbstractController
{

    #[Route('', name: 'api_index_blocked', methods: ['GET'])]
    public function index(BlockedRepository $blockedRepo): JsonResponse
    {
        $currentUser = $this->getUser();
        if (!$currentUser instanceof User) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }   
        
        $blockedUsers = $blockedRepo->findBy(['user_blocker' => $currentUser]);
        $dataBlocked = array_map(function (Blocked $block) {
            $blockedUser = $block->getUserBlocked();
            return [
                'id' => $blockedUser->getId(),
                'pseudo' => $blockedUser->getPseudo(),
                'pdp' => $blockedUser->getPdp(), 
            ];
        }, $blockedUsers); 
        
        $blockedBy = $blockedRepo->findBy(['user_blocked' => $currentUser]);
        $dataBlockedBy = array_map(function (Blocked $block) {
            $blockerUser = $block->getUserBlocker();
            return [
                'id' => $blockerUser->getId(),
                'pseudo' => $blockerUser->getPseudo(),
                'pdp' => $blockerUser->getPdp(),
            ];
        }, $blockedBy); 
        
        return $this->json([
            'blocked_users' => $dataBlocked,
            'blocked_by' => $dataBlockedBy,
        ]);
    }
    
    #[Route('/{id}', name: 'api_get_blockeds', methods: ['GET'])]
    public function get(User $user, BlockedRepository $blockedRepo, TokenStorageInterface $tokenStorage): JsonResponse {
        $token = $tokenStorage->getToken();
        if (!$token) {
            return $this->json(['error' => 'Utilisateur non authentifié'], 401);
        }
        $currentUser = $token->getUser();
        if (!$currentUser instanceof User) {
            return $this->json(['error' => 'Utilisateur non authentifié'], 401);
        }
    
        $block = $blockedRepo->findOneBy([
            'user_blocker' => $currentUser,
            'user_blocked' => $user,
        ]);
    
        return $this->json(['blocked' => $block !== null]);
    }

    #[Route('/{id}', name: 'api_post_user', methods: ['POST'])]
    public function post(User $user, BlockedRepository $blockedRepo, EntityManagerInterface $em): JsonResponse
    {
        $currentUser = $this->getUser();

        if (!$currentUser instanceof User) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        if ($currentUser === $user) {
            return $this->json(['error' => 'Vous ne pouvez pas vous bloquer vous-même'], 400);
        }

        $alreadyBlocked = $blockedRepo->findOneBy([
            'user_blocker' => $currentUser,
            'user_blocked' => $user
        ]);

        if ($alreadyBlocked) {
            return $this->json(['message' => 'Utilisateur déjà bloqué'], 200);
        }

        $blocked = new Blocked();
        $blocked->setUserBlocker($currentUser);
        $blocked->setUserBlocked($user);
        $em->persist($blocked);
        $em->flush();

        return $this->json(['message' => 'Utilisateur bloqué avec succès']);
    }

    #[Route('/{id}', name: 'api_unblock_user', methods: ['DELETE'])]
    public function unblock(User $user, BlockedRepository $blockedRepo, EntityManagerInterface $em): JsonResponse
    {
        $currentUser = $this->getUser();

        if (!$currentUser instanceof User) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        $blocked = $blockedRepo->findOneBy([
            'user_blocker' => $currentUser,
            'user_blocked' => $user
        ]);

        if (!$blocked) {
            return $this->json(['message' => 'Utilisateur non bloqué'], 404);
        }

        $em->remove($blocked);
        $em->flush();

        return $this->json(['message' => 'Utilisateur débloqué avec succès']);
    }
}
