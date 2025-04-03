<?php

namespace App\Entity;

use App\Repository\PostRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\User;


#[ORM\Entity(repositoryClass: PostRepository::class)]
class Post
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 280)]
    private ?string $content = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $created_at = null;


    
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'posts')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    /**
     * @var Collection<int, Respond>
     */
    #[ORM\OneToMany(targetEntity: Respond::class, mappedBy: 'id_post')]
    private Collection $responds;

    #[ORM\Column(nullable: true)]
    private ?array $media = null;

    #[ORM\Column]
    private ?bool $censor = null;

    public function __construct()
    {
        $this->responds = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): static
    {
        $this->content = $content;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeInterface $created_at): static
    {
        $this->created_at = $created_at;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }
    
    public function setUser(?User $user): static
    {
        $this->user = $user;
        return $this;
    }

    /**
     * @return Collection<int, Respond>
     */
    public function getResponds(): Collection
    {
        return $this->responds;
    }

    public function addRespond(Respond $respond): static
    {
        if (!$this->responds->contains($respond)) {
            $this->responds->add($respond);
            $respond->setIdPost($this);
        }

        return $this;
    }

    public function removeRespond(Respond $respond): static
    {
        if ($this->responds->removeElement($respond)) {
            // set the owning side to null (unless already changed)
            if ($respond->getIdPost() === $this) {
                $respond->setIdPost(null);
            }
        }

        return $this;
    }

    public function getMedia(): ?array
    {
        return $this->media;
    }

    public function setMedia(?array $media): static
    {
        $this->media = $media;

        return $this;
    }

    public function isCensor(): ?bool
    {
        return $this->censor;
    }

    public function setCensor(bool $censor): static
    {
        $this->censor = $censor;

        return $this;
    }

}


