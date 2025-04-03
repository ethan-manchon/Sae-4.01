<?php
namespace App\Security;

use App\Entity\User;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Exception\AuthenticationException;

trait BlockCheckerTrait
{
    /**
     * Vérifie si l'utilisateur cible a bloqué l'utilisateur courant.
     * Renvoie une réponse JSON d'erreur (403) si c'est le cas, sinon null.
     */
    public function checkIfBlocked(User $targetUser, User $currentUser ): ?JsonResponse
    {
        if ($targetUser->hasBlocked($currentUser) === true) {
            return new JsonResponse(['error' => 'Vous êtes bloqué par cet utilisateur.'], 403);
        }
        return null;
    }
}
