<?php

namespace App\Controller\Api;

use App\Entity\Subscribe;
use App\Entity\User;
use App\Repository\SubscribeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class SubscribeController extends AbstractController
{
    #[Route('/subscribes/{id}', name: 'api_user_followers', methods: ['GET'])]
    public function getFollowers(User $user, SubscribeRepository $subscribeRepo): JsonResponse
    {
        $followers = $subscribeRepo->findBy(['following' => $user]);

        $dataFollowers = array_map(function (Subscribe $sub) {
            return [
            'id' => $sub->getFollower()->getId(),
            'pseudo' => $sub->getFollower()->getPseudo(),
            ];
        }, $followers);

        $following = $subscribeRepo->findBy(['follower' => $user]);

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

    #[Route('/subscribes/{id}', name: 'api_subscribe_user', methods: ['POST'])]
    public function subscribe(
        User $user,
        SubscribeRepository $subscribeRepo,
        EntityManagerInterface $em
    ): JsonResponse {
        $currentUser = $this->getUser();

        if (!$currentUser instanceof User) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        if ($currentUser === $user) {
            return $this->json(['error' => 'You cannot subscribe to yourself'], 400);
        }

        $alreadySubscribed = $subscribeRepo->findOneBy([
            'follower' => $currentUser,
            'following' => $user
        ]);

        if ($alreadySubscribed) {
            return $this->json(['message' => 'Already subscribed'], 200);
        }

        $subscribe = new Subscribe();
        $subscribe->setFollower($currentUser);
        $subscribe->setFollowing($user);
        $em->persist($subscribe);
        $em->flush();

        return $this->json(['message' => 'Subscribed successfully']);
    }

    #[Route('/subscribes/{id}', name: 'api_unsubscribe_user', methods: ['DELETE'])]
    public function unsubscribe(
        User $user,
        SubscribeRepository $subscribeRepo,
        EntityManagerInterface $em
    ): JsonResponse {
        $currentUser = $this->getUser();

        if (!$currentUser instanceof User) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        $subscribe = $subscribeRepo->findOneBy([
            'follower' => $currentUser,
            'following' => $user
        ]);

        if (!$subscribe) {
            return $this->json(['message' => 'Not subscribed'], 404);
        }

        $em->remove($subscribe);
        $em->flush();

        return $this->json(['message' => 'Unsubscribed successfully']);
    }
}