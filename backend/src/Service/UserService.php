<?php

namespace App\Service;

use App\Entity\AccessToken;
use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\ORM\EntityManagerInterface;

class UserService
{
    private UserRepository $userRepository;
    private EntityManagerInterface $entityManager;
    private UserPasswordEncoderInterface $passwordEncoder;

    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserRepository $userRepository, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher)
    {
        $this->userRepository = $userRepository;
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
    }
    public function registerUser(string $email, string $plainPassword): User
    {
        $existingUser = $this->userRepository->findOneBy(['email' => $email]);
        if ($existingUser) {
            throw new \Exception('User already exists');
        }

        $user = new User();
        $user->setEmail($email);
        $user->setPseudo($pseudo);
        $user->setRoles(['ROLE_USER']);
        $user->setPassword($this->passwordHasher->hashPassword($user, $plainPassword));

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $user;
    }

    public function generatePersonalTokenForUser(User $user): string
    {
        $rawToken = bin2hex(random_bytes(32)); 
        $hashedToken = hash('sha256', $rawToken); 

        
        foreach ($user->getAccessTokens() as $existing) {
            $existing->setIsValid(false);
        }

        $accessToken = new AccessToken();
        $accessToken->setUser($user);
        $accessToken->setHashedToken($hashedToken);
        $accessToken->setIsValid(true);
        $accessToken->setCreatedAt(new \DateTimeImmutable());
        $accessToken->setExpiresAt((new \DateTimeImmutable())->modify('+7 days'));

        $this->entityManager->persist($accessToken);
        $this->entityManager->flush();

        return $rawToken; 
    }
}
