<?php
namespace App\Security;

use App\Repository\AccessTokenRepository;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\Security\Http\AccessToken\AccessTokenHandlerInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;

class AccessTokenHandler implements AccessTokenHandlerInterface
{
    public function __construct(
        private AccessTokenRepository $repository
    ) {
    }

    public function getUserBadgeFrom(string $token): UserBadge
    {
        $hashedToken = hash('sha256', $token);
        
        $accessToken = $this->repository->findOneBy([
            'hashedToken' => $hashedToken,
            'isValid' => true,
        ]);
    
        if (!$accessToken || $accessToken->getExpiresAt() < new \DateTimeImmutable()) {
            throw new AuthenticationException('Invalid or expired token.');
        }
    
        return new UserBadge($accessToken->getUser()->getEmail());
    }
}