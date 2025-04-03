<?php

namespace App\Controller\Api;

use App\Entity\Subscribe;
use App\Entity\User;
use App\Repository\SubscribeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Security\BlockCheckerTrait;

#[Route('/api/subscribes')]
class SubscribeController extends AbstractController
{
    use BlockCheckerTrait;

    #[Route('', name: 'api_user_subscriptions', methods: ['GET'])]
    public function index(SubscribeRepository $subscribeRepo, Request $request): JsonResponse
    {
        $currentUser = $this->getUser();
        if (!$currentUser instanceof User) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }
        
        $followers = $subscribeRepo->findBy(['following' => $currentUser]);
        $dataFollowers = array_map(function (Subscribe $sub) {
            return [
                'id' => $sub->getFollower()->getId(),
                'pseudo' => $sub->getFollower()->getPseudo(),
            ];
        }, $followers);

        $following = $subscribeRepo->findBy(['follower' => $currentUser]);
        $dataFollowing = array_map(function (Subscribe $sub) {
            return [
                'id' => $sub->getFollowing()->getId(),
                'pseudo' => $sub->getFollowing()->getPseudo(),
            ];
        }, $following);

        return $this->json([
            'followers' => $dataFollowers,
            'following' => $dataFollowing,
        ]);
    }

    #[Route('/{id}', name: 'api_user_subscriptions', methods: ['GET'])]
    public function get(User $user, SubscribeRepository $subscribeRepo, TokenStorageInterface $tokenStorage): JsonResponse {
        $token = $tokenStorage->getToken();
        if (!$token) {
            return $this->json(['error' => 'Utilisateur non authentifié'], 401);
        }

        $blocked = false;

        $currentUser = $this->getUser();
        if ($user->hasBlocked($currentUser) === true) {
            $blocked = true;
        }

        if (!$currentUser instanceof User) {
            return $this->json(['error' => 'Utilisateur non authentifié'], 401);
        }
    
        $follow = $subscribeRepo->findOneBy([
            'follower' => $currentUser,
            'following' => $user,
        ]);
    
        return $this->json([
            'follower' => $follow ? true : false,
            'isBlocked' => $blocked,
    ]);
    }

    #[Route('/{id}', name: 'api_subscribe_user', methods: ['POST'])]
    public function subscribe(User $user, SubscribeRepository $subscribeRepo, EntityManagerInterface $em): JsonResponse
    {
        $currentUser = $this->getUser();
        if (!$currentUser instanceof User) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }
        if ($currentUser->isBanned()) {
            return $this->json(['error' => 'Votre compte est bloqué.'], 403);
        }
        if ($currentUser->getId() === $user->getId()) {
            return $this->json(['error' => 'Vous ne pouvez pas vous abonner à vous-même'], 400);
        }
        if ($user->hasBlocked($currentUser) === true) {
            return $this->json(['error' => 'Vous êtes bloqué par cet utilisateur'], 403);
        }

        $alreadySubscribed = $subscribeRepo->findOneBy([
            'follower' => $currentUser,
            'following' => $user
        ]);
        if ($alreadySubscribed) {
            return $this->json(['message' => 'Déjà abonné'], 200);
        }

        $subscribe = new Subscribe();
        $subscribe->setFollower($currentUser);
        $subscribe->setFollowing($user);
        $em->persist($subscribe);
        $em->flush();

        return $this->json(['message' => 'Abonnement effectué'], 201);
    }

    #[Route('/{id}', name: 'api_unsubscribe_user', methods: ['DELETE'])]
    public function unsubscribe(User $user, SubscribeRepository $subscribeRepo, EntityManagerInterface $em): JsonResponse
    {
        $currentUser = $this->getUser();

        if (!$currentUser instanceof User) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        $subscribe = $subscribeRepo->findOneBy([
            'follower' => $currentUser,
            'following' => $user
        ]);

        if (!$subscribe) {
            return $this->json(['message' => 'Non abonné'], 404);
        }

        $em->remove($subscribe);
        $em->flush();

        return $this->json(['message' => 'Désabonnement effectué']);
    }
}
