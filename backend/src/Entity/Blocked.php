<?php

namespace App\Entity;

use App\Repository\BlockedRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: BlockedRepository::class)]
class Blocked
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'blockeds')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user_blocked = null;

    #[ORM\ManyToOne(inversedBy: 'blockers')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user_blocker = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserBlocked(): ?User
    {
        return $this->user_blocked;
    }

    public function setUserBlocked(?User $user_blocked): static
    {
        $this->user_blocked = $user_blocked;

        return $this;
    }

    public function getUserBlocker(): ?User
    {
        return $this->user_blocker;
    }

    public function setUserBlocker(?User $user_blocker): static
    {
        $this->user_blocker = $user_blocker;

        return $this;
    }
}
