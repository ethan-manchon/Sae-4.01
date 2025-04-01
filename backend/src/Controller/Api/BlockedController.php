<?php

namespace App\Controller\Api;

use App\Entity\Blocked;
use App\Entity\User;
use App\Repository\BlockedRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/blockeds')]
class BlockedController extends AbstractController
{
    #[Route('/{id}', name: 'api_user_blockeds', methods: ['GET'])]
    public function getBlockeds(User $user, BlockedRepository $blockedRepo): JsonResponse
    {
        $blockers = $blockedRepo->findBy(['user_blocked' => $user]);

        $dataBlockers = array_map(function (Blocked $block) {
            return [
                'id' => $block->getUserBlocker()->getId(),
                'pseudo' => $block->getUserBlocker()->getPseudo(),
            ];
        }, $blockers);

        $blocked = $blockedRepo->findBy(['user_blocker' => $user]);

        $dataBlocked = array_map(function (Blocked $block) {
            return [
                'id' => $block->getUserBlocked()->getId(),
                'pseudo' => $block->getUserBlocked()->getPseudo(),
            ];
        }, $blocked);

        return $this->json([
            'blockedBy' => $dataBlockers,
            'blocked' => $dataBlocked,
        ]);
    }

    #[Route('/{id}', name: 'api_block_user', methods: ['POST'])]
    public function block(
        User $user,
        BlockedRepository $blockedRepo,
        EntityManagerInterface $em
    ): JsonResponse {
        $currentUser = $this->getUser();

        if (!$currentUser instanceof User) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        if ($currentUser === $user) {
            return $this->json(['error' => 'You cannot block yourself'], 400);
        }

        $alreadyBlocked = $blockedRepo->findOneBy([
            'user_blocker' => $currentUser,
            'user_blocked' => $user
        ]);

        if ($alreadyBlocked) {
            return $this->json(['message' => 'User already blocked'], 200);
        }

        $blocked = new Blocked();
        $blocked->setUserBlocker($currentUser);
        $blocked->setUserBlocked($user);
        $blocked->setBlockedAt(new \DateTimeImmutable());
        $em->persist($blocked);
        $em->flush();

        return $this->json(['message' => 'User blocked successfully']);
    }

    #[Route('/{id}', name: 'api_unblock_user', methods: ['DELETE'])]
    public function unblock(
        User $user,
        BlockedRepository $blockedRepo,
        EntityManagerInterface $em
    ): JsonResponse {
        $currentUser = $this->getUser();

        if (!$currentUser instanceof User) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        $blocked = $blockedRepo->findOneBy([
            'user_blocker' => $currentUser,
            'user_blocked' => $user
        ]);

        if (!$blocked) {
            return $this->json(['message' => 'User not blocked'], 404);
        }

        $em->remove($blocked);
        $em->flush();

        return $this->json(['message' => 'User unblocked successfully']);
    }
}
