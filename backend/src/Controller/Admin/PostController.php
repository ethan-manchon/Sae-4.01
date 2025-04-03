<?php

namespace App\Controller\Admin;

use App\Entity\User;
use App\Entity\Post;
use App\Entity\Like;
use App\Entity\Respond;
use App\Service\PostService;
use App\Repository\SubscribeRepository;
use App\Repository\UserRepository;
use App\Repository\PostRepository;
use App\Dto\Payload\CreatePostPayload;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

#[Route('/admin/posts', name: 'admin_post_')]
class PostController extends AbstractController
{
    #[Route('', name: 'admin_index_post', methods: ['GET'])]
    public function index(Request $request, PostRepository $postRepository): JsonResponse
    {
        $page = $request->query->getInt('page', 1);
        $limit = 15;
        $offset = ($page - 1) * $limit;
    
        $paginator = $postRepository->paginateAllOrderedByLatest($offset, $limit);
        $totalPostsCount = $paginator->count();
    
        $previousPage = $page > 1 ? $page - 1 : null;
        $nextPage = ($page * $limit) >= $totalPostsCount ? null : $page + 1;
    
        $postsArray = [];
    
        foreach ($paginator as $post) {
            $author = $post->getUser();

            $postsArray[] = [
            'id' => $post->getId(),
            'content' => $post->getContent(),
            'createdAt' => $post->getCreatedAt()->format('Y-m-d H:i:s'),
            'user' => [
            'id' => $author->getId(),
            'pseudo' => $author->getPseudo(),
            'pdp' => $author->getPdp(),
            ],
            'banned' => false,
            'count' => count($post->getResponds()),
            'media' => $post->getMedia(),
            'censor' => $post->isCensor(),
            ];
        }
    
        return new JsonResponse([
            'posts' => $postsArray,
            'previous_page' => $previousPage,
            'next_page' => $nextPage,
        ]);
    }
    
    #[Route('/{id}', name: 'delete_post', methods: ['DELETE'])]
    public function delete(Post $post, EntityManagerInterface $em, TokenStorageInterface $tokenStorage): JsonResponse
    {
        $user = $tokenStorage->getToken()->getUser();
    
        if (!$this->isGranted('ROLE_ADMIN')) {
            return new JsonResponse(['error' => 'Non autorisé'], Response::HTTP_FORBIDDEN);
        }
        
        $responds = $post->getResponds();
        if ($responds !== null) {
            foreach ($responds as $respond) {
                $em->remove($respond);
            }
        }
    
        $likes = $em->getRepository(Like::class)->findBy(['post' => $post]);
        if ($likes !== null) {
            foreach ($likes as $like) {
                $em->remove($like);
            }
        }
        $em->remove($post);
        $em->flush();
    
        return new JsonResponse(['success' => true]);
    }
    
    #[Route('/{id}', name: 'patch_post', methods: ['POST', 'PATCH'])]
    public function patch(Post $post, EntityManagerInterface $em, Request $request): JsonResponse
    {
        if (!$this->isGranted('ROLE_ADMIN')) {
            return new JsonResponse(['error' => 'Non autorisé'], Response::HTTP_FORBIDDEN);
        }
    
        $data = json_decode($request->getContent(), true);
    
        $rawCensor = $data['censor'] ?? $request->request->get('censor');
    
        if ($rawCensor === null) {
            return new JsonResponse(['error' => 'Aucune donnée de censure reçue'], Response::HTTP_BAD_REQUEST);
        }
    
        $censor = filter_var($rawCensor, FILTER_VALIDATE_BOOLEAN);
    
        $post->setCensor($censor);
        $em->flush();
    
        return new JsonResponse([
            'success' => true,
            'message' => $censor ? 'Post censuré' : 'Post décensuré'
        ]);
    }
    
}