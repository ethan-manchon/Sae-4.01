<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\UserService;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserController extends AbstractController
{
    private $userService;
    private $entityManager;
    private $passwordEncoder;

    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserService $userService, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher)
    {
        $this->userService = $userService;
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
    }
    
    #[Route('/users', name: 'user.index', methods: ['GET'])]
    public function index(UserRepository $user): Response
    {
        return $this->json($user->findAll());
    }
    
    #[Route('/login', name: 'user.login', methods: ['POST'])]
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        $error = $authenticationUtils->getLastAuthenticationError();
        $lastUsername = $authenticationUtils->getLastUsername();
        return ($error) ? $this->json(['error' => $error->getMessage()], Response::HTTP_UNAUTHORIZED) : $this->json(['message' => 'User logged in successfully'], Response::HTTP_OK);
    }

    #[Route('/register', name: 'user.register', methods: ['POST'])]
    public function register(Request $request): Response
    {
        if ($request->isMethod('POST')) {
            $pseudo = $request->request->get('pseudo');
            $email = $request->request->get('email');
            $password = $request->request->get('password');
            
            if (!$email || !$password || !$pseudo) {
                return $this->json(['error' => 'Pseudo, email and password are required'], Response::HTTP_BAD_REQUEST);
            }

            $existingMail = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
            $existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['pseudo' => $pseudo]);
            if ($existingMail) {
                return $this->json(['error' => 'Mail already used'], Response::HTTP_CONFLICT);
            }
            if ($existingUser) {
                return $this->json(['error' => 'Pseudo already used'], Response::HTTP_CONFLICT);
            }

            $user = new User();
            $user->setEmail($email);
            $user->setPseudo($pseudo);
            $user->setPassword($this->passwordHasher->hashPassword($user, $password));
            
            $this->entityManager->persist($user);
            $this->entityManager->flush();

            return $this->json(['message' => 'User registered successfully'], Response::HTTP_CREATED);
        }

        return $this->render('user/register.html.twig');
    }
}
