<?php

namespace App\Controller\Api;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class UserController extends AbstractController
{
    #[Route('/users', name: 'api_me', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'Not authenticated'], 401);
        }

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'pseudo' => $user->getPseudo(),
            'pdp' => $user->getPdp(),
            'bio' => $user->getBio(),
            'banniere' => $user->getBanniere(),
            'locate' => $user->getLocate(),
            'url' => $user->getUrl(),
            'refresh' => $user->isRefresh(),
            'roles' => $user->getRoles(),
        ]);
    }

    #[Route('/users/{pseudo}', name: 'api_profil', methods: ['GET'])]
    public function profil(string $pseudo, UserRepository $userRepository): JsonResponse
    {
        $user = $userRepository->findOneBy(['pseudo' => $pseudo]);

        if (!$user) {
            return $this->json(['error' => 'User not found'], 404);
        }

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'pseudo' => $user->getPseudo(),
            'pdp' => $user->getPdp(),
            'bio' => $user->getBio(),
            'banniere' => $user->getBanniere(),
            'locate' => $user->getLocate(),
            'url' => $user->getUrl(),
            'refresh' => $user->isRefresh(),
            'roles' => $user->getRoles(),
        ]);
    }

    #[Route('/users/{id}', name: 'api_user_refresh_update', methods: ['PATCH'])]
    public function updateRefresh(Request $request, UserRepository $userRepository, EntityManagerInterface $em, int $id): JsonResponse
    {
        $user = $userRepository->find($id);

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur introuvable'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['refresh'])) {
            $user->setRefresh($data['refresh']);
        }
        if (isset($data['bio'])) {
            $user->setBio($data['bio']);
        }
        if (isset($data['locate'])) {
            $user->setLocate($data['locate']);
        }
        if (isset($data['url'])) {
            $user->setUrl($data['url']);
        }
        if (isset($data['pdp'])) {
            $user->setPdp($data['pdp']);
        }
        if (isset($data['banniere'])) {
            $user->setBanniere($data['banniere']);
        }

        $em->flush();

        return new JsonResponse(['message' => 'Refresh mis à jour']);
    }
    
    #[Route('/upload-pdp', name: 'api_upload_pdp', methods: ['POST'])]
    public function uploadPdp(Request $request): JsonResponse
    {
        $file = $request->files->get('file');
    
        if (!$file) {
            return $this->json(['error' => 'Aucun fichier envoyé'], 400);
        }
    
        $fileName = uniqid() . '.' . $file->guessExtension();
        $file->move($this->getParameter('kernel.project_dir') . '/public/assets/pdp', $fileName);
    
        return $this->json(['filename' => $fileName]);
    }
    #[Route('/upload-banner', name: 'api_upload_banner', methods: ['POST'])]
    public function uploadbanner(Request $request): JsonResponse
    {
        $file = $request->files->get('file');

        if (!$file) {
            return $this->json(['error' => 'Aucun fichier reçu'], 400);
        }

        if (!in_array($file->getMimeType(), ['image/jpeg', 'image/png', 'image/webp'])) {
            return $this->json(['error' => 'Format non autorisé'], 400);
        }

        $fileName = uniqid() . '.' . $file->guessExtension();
        $file->move($this->getParameter('kernel.project_dir') . '/public/assets/banner', $fileName);

        return $this->json(['filename' => $fileName]);
    }
}