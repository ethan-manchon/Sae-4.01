<?php

namespace App\Repository;

use App\Entity\Respond;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Respond>
 */
class RespondRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Respond::class);
    }

    public function findAllByIdPost(int $id): array
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.id_post = :id')
            ->setParameter('id', $id)
            ->orderBy('r.created_at', 'DESC')
            ->getQuery()
            ->getResult();
    }
}
