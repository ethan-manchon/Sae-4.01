<?php

namespace App\Repository;

use App\Entity\Like;
use App\Entity\Post;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Like>
 */
class LikeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Like::class);
    }

    public function isPostLikedByUser(Post $post, User $user): bool
    {
        return (bool) $this->createQueryBuilder('l')
            ->select('count(l.id)')
            ->where('l.post = :post')
            ->andWhere('l.user = :user')
            ->setParameter('post', $post)
            ->setParameter('user', $user)
            ->getQuery()
            ->getSingleScalarResult();
        
}
}