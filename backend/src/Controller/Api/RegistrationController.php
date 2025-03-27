<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Form\RegistrationFormType;
use App\Repository\UserRepository;
use App\Security\EmailVerifier;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mime\Address;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use SymfonyCasts\Bundle\VerifyEmail\Exception\VerifyEmailExceptionInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

#[Route('/api')]
class RegistrationController extends AbstractController
{
    public function __construct(private EmailVerifier $emailVerifier)
    {
    }

    #[Route('/register', name: 'api_user_register', methods: ['POST'])]
    public function register(Request $request, UserPasswordHasherInterface $userPasswordHasher, EntityManagerInterface $entityManager): JsonResponse
    {
        $pseudo = $request->request->get('pseudo');
        $email = $request->request->get('email');
        $password = $request->request->get('password');

        if (!$email || !$password || !$pseudo) {
            return $this->json(['error' => 'Pseudo, email and password are required'], Response::HTTP_BAD_REQUEST);
        }

        $existingMail = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
        $existingUser = $entityManager->getRepository(User::class)->findOneBy(['pseudo' => $pseudo]);

        if ($existingMail) {
            return $this->json(['error' => 'Mail already used'], Response::HTTP_CONFLICT);
        }
        if ($existingUser) {
            return $this->json(['error' => 'Pseudo already used'], Response::HTTP_CONFLICT);
        }

        $user = new User();
        $user->setEmail($email);
        $user->setPseudo($pseudo);
        $user->setPassword($userPasswordHasher->hashPassword($user, $password));

        $entityManager->persist($user);
        $entityManager->flush();

        $this->emailVerifier->sendEmailConfirmation('app_verify_email', $user,
            (new TemplatedEmail())
                ->from(new Address('verif@twitter.com', 'Verif Bot'))
                ->to((string) $user->getEmail())
                ->subject('Please Confirm your Email')
                ->htmlTemplate('registration/confirmation_email.html.twig')
        );

        return $this->json(['message' => 'User registered successfully, please verify your email'], Response::HTTP_CREATED);
    }

    #[Route('/verify/email', name: 'app_verify_email')]
    public function verifyUserEmail(Request $request, UserRepository $userRepository): Response
    {
        $id = $request->query->get('id');

        if (null === $id) {
            return $this->redirect('http://localhost:8090/');
        }

        $user = $userRepository->find($id);

        if (null === $user) {
            return $this->redirect('http://localhost:8090/');
        }

        try {
            $this->emailVerifier->handleEmailConfirmation($request, $user);
        } catch (VerifyEmailExceptionInterface $exception) {
            $this->addFlash('verify_email_error', $exception->getReason());
            return $this->redirect('http://localhost:8090/');
        }

        $this->addFlash('success', 'Your email address has been verified.');

        return $this->redirect('http://localhost:8090/');
    }
}