<?php

namespace App\Controller\Api;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/users')]
class UserController extends AbstractController
{
    #[Route('', name: 'api_index_user', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'Non authentifié'], 401);
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
            'readonly' => $user->isReadOnly(),
        ]);
    }

    #[Route('/{pseudo}', name: 'api_get_user', methods: ['GET'])]
    public function get(string $pseudo, UserRepository $userRepository): JsonResponse
    {
        $user = $userRepository->findOneBy(['pseudo' => $pseudo]);

        if (!$user) {
            return $this->json(['error' => 'Utilisateur introuvable'], 404);
        }

        return $this->json([
            'id' => $user->getId(),
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

    #[Route('/{id}', name: 'api_update_user', methods: ['PATCH'])]
    public function update(Request $request, UserRepository $userRepository, EntityManagerInterface $em, int $id): JsonResponse
    {
        $currentUser = $this->getUser();
        if (!$currentUser instanceof \App\Entity\User) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        if ($currentUser->getId() !== $id) {
            return $this->json(['error' => 'Vous ne pouvez modifier que votre propre compte'], 403);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['refresh'])) $currentUser->setRefresh($data['refresh']);
        if (isset($data['bio'])) $currentUser->setBio($data['bio']);
        if (isset($data['location'])) $currentUser->setLocate($data['location']);
        if (isset($data['url'])) $currentUser->setUrl($data['url']);
        if (isset($data['pdp'])) $currentUser->setPdp($data['pdp']);
        if (isset($data['banniere'])) $currentUser->setBanniere($data['banniere']);
        if (isset($data['readonly']))$currentUser->setReadOnly($data['readonly'] );
        
        $em->flush();

        return $this->json(['message' => 'Profil mis à jour']);
    }

    #[Route('/upload-pdp', name: 'api_upload_pdp', methods: ['POST'])]
    public function uploadPdp(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $currentUser = $this->getUser();
        if (!$currentUser instanceof \App\Entity\User) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        /** @var UploadedFile|null $file */
        $file = $request->files->get('file');
        if (!$file) {
            return $this->json(['error' => 'Aucun fichier envoyé'], 400);
        }

        if (!in_array($file->getMimeType(), ['image/jpeg', 'image/png', 'image/webp'])) {
            return $this->json(['error' => 'Format non autorisé'], 400);
        }

        $fileName = uniqid() . '.' . $file->guessExtension();
        $file->move($this->getParameter('kernel.project_dir') . '/public/assets/pdp', $fileName);

        $currentUser->setPdp($fileName);
        $em->flush();

        return $this->json(['filename' => $fileName]);
    }

    #[Route('/upload-banner', name: 'api_upload_banner', methods: ['POST'])]
    public function uploadBanner(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $currentUser = $this->getUser();
        if (!$currentUser instanceof \App\Entity\User) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        /** @var UploadedFile|null $file */
        $file = $request->files->get('file');
        if (!$file) {
            return $this->json(['error' => 'Aucun fichier reçu'], 400);
        }

        if (!in_array($file->getMimeType(), ['image/jpeg', 'image/png', 'image/webp'])) {
            return $this->json(['error' => 'Format non autorisé'], 400);
        }

        $fileName = uniqid() . '.' . $file->guessExtension();
        $file->move($this->getParameter('kernel.project_dir') . '/public/assets/banner', $fileName);

        $currentUser->setBanniere($fileName);
        $em->flush();

        return $this->json(['filename' => $fileName]);
    }
}
