<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\UserService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;

#[Route('/login')]
class SecurityController extends AbstractController
{
    #[Route('', name: 'login', methods: ['POST'])]
    public function login(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher,
        UserService $userService
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            return $this->json(['error' => 'Email and password are required'], 400);
        }

        $user = $em->getRepository(User::class)->findOneBy(['email' => $email]);

        if ($user && $user->isBanned()) {
            return $this->json([
                'error' => 'Votre compte a été bloqué pour non respect des conditions d’utilisation.'
            ], 403);
        }

        if (!$user || !$passwordHasher->isPasswordValid($user, $password)) {
            return $this->json(['error' => 'Invalid credentials'], 401);
        }

        if (!$user->isVerified()) {
            return new JsonResponse(['error' => 'Account not verified'], 401);
        }

        $token = $userService->generatePersonalTokenForUser($user);

        return $this->json([ 
            'token' => $token,
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'pseudo' => $user->getPseudo(),
            ]
        ]);
    }
}