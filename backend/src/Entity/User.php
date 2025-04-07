<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
#[UniqueEntity(fields: ['email'], message: 'There is already an account with this email')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    private ?string $email = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(length: 18)]
    private ?string $pseudo = null;

    #[ORM\Column]
    private bool $isVerified = false;

    #[ORM\Column(type: 'boolean')]
    private bool $isBanned = false;
    
    /**
     * @var Collection<int, AccessTokens>
     */
    #[ORM\OneToMany(targetEntity: AccessToken::class, mappedBy: 'user')]
    private Collection $accessTokens;

    /**
     * @var Collection<int, Post>
     */
    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Post::class)]
    private Collection $posts;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $bio = null;

    #[ORM\Column(length: 100, nullable: true)]
    private ?string $locate = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $url = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $pdp = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $banniere = null;

    #[ORM\Column (type: Types::BOOLEAN, options: ['default' => true])]
    private ?bool $refresh = true;

    /**
     * @var Collection<int, Respond>
     */
    #[ORM\OneToMany(targetEntity: Respond::class, mappedBy: 'user_id')]
    private Collection $responds;

    /**
     * @var Collection<int, Blocked>
     */
    #[ORM\OneToMany(targetEntity: Blocked::class, mappedBy: 'user_blocked')]
    private Collection $blockeds;

    /**
     * @var Collection<int, Blocked>
     */
    #[ORM\OneToMany(targetEntity: Blocked::class, mappedBy: 'user_blocker')]
    private Collection $blockers;

    #[ORM\Column]
    private ?bool $readOnly = null;

    public function __construct()
    {
        $this->accessTokens = new ArrayCollection();
        $this->posts = new ArrayCollection();
        $this->responds = new ArrayCollection();
        $this->blockeds = new ArrayCollection();
        $this->blockers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getPseudo(): ?string
    {
        return $this->pseudo;
    }

    public function setPseudo(string $pseudo): static
    {
        $this->pseudo = $pseudo;

        return $this;
    }

    public function isVerified(): bool
    {
        return $this->isVerified;
    }

    public function setIsVerified(bool $isVerified): static
    {
        $this->isVerified = $isVerified;

        return $this;
    }

    /**
     * @return Collection<int, AccessTokens>
     */
    public function getAccessTokens(): Collection
    {
        return $this->accessTokens;
    }

    public function addAccessTokens(AccessToken $accessTokens): static
    {
        if (!$this->accessTokens->contains($accessTokens)) {
            $this->accessTokens->add($accessTokens);
            $accessTokens->setUser($this);
        }

        return $this;
    }

    public function removeAccessTokens(AccessTokens $accessTokens): static
    {
        if ($this->accessTokens->removeElement($accessTokens)) {
            // set the owning    side to null (unless already changed)
            if ($accessTokens->getUser() === $this) {
                $accessTokens->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Post>
     */
    public function getPosts(): Collection
    {
        return $this->posts;
    }

    public function addPost(Post $post): static
    {
        if (!$this->posts->contains($post)) {
            $this->posts->add($post);
            $post->setUserId($this);
        }

        return $this;
    }

    public function removePost(Post $post): static
    {
        if ($this->posts->removeElement($post)) {
            // set the owning side to null (unless already changed)
            if ($post->getUserId() === $this) {
                $post->setUserId(null);
            }
        }

        return $this;
    }

    public function getBio(): ?string
    {
        return $this->bio;
    }

    public function setBio(?string $bio): static
    {
        $this->bio = $bio;

        return $this;
    }

    public function getLocate(): ?string
    {
        return $this->locate;
    }

    public function setLocate(?string $locate): static
    {
        $this->locate = $locate;

        return $this;
    }

    public function getUrl(): ?string
    {
        return $this->url;
    }

    public function setUrl(?string $url): static
    {
        $this->url = $url;

        return $this;
    }

    public function getPdp(): ?string
    {
        return $this->pdp;
    }

    public function setPdp(?string $pdp): static
    {
        $this->pdp = $pdp;

        return $this;
    }

    public function getBanniere(): ?string
    {
        return $this->banniere;
    }

    public function setBanniere(?string $banniere): static
    {
        $this->banniere = $banniere;

        return $this;
    }

    public function isRefresh(): ?bool
    {
        return $this->refresh;
    }

    public function setRefresh(bool $refresh): static
    {
        $this->refresh = $refresh;

        return $this;
    }
    
    public function isBanned(): bool
    {
        return $this->isBanned;
    }
    
    public function setIsBanned(bool $banned): self
    {
        $this->setIsBanned = $banned;
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
            $respond->setUserId($this);
        }

        return $this;
    }

    public function removeRespond(Respond $respond): static
    {
        if ($this->responds->removeElement($respond)) {
            // set the owning side to null (unless already changed)
            if ($respond->getUserId() === $this) {
                $respond->setUserId(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Blocked>
     */
    public function getBlockeds(): Collection
    {
        return $this->blockeds;
    }
    public function getBlocked(): Collection
    {
        return $this->blockeds;
    }

    public function addBlocked(Blocked $blocked): static
    {
        if (!$this->blockeds->contains($blocked)) {
            $this->blockeds->add($blocked);
            $blocked->setUserBlocked($this);
        }

        return $this;
    }

    public function removeBlocked(Blocked $blocked): static
    {
        if ($this->blockeds->removeElement($blocked)) {
            // set the owning side to null (unless already changed)
            if ($blocked->getUserBlocked() === $this) {
                $blocked->setUserBlocked(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Blocked>
     */
    public function getBlockers(): Collection
    {
        return $this->blockers;
    }

    public function addBlocker(Blocked $blocker): static
    {
        if (!$this->blockers->contains($blocker)) {
            $this->blockers->add($blocker);
            $blocker->setUserBlocker($this);
        }

        return $this;
    }

    public function removeBlocker(Blocked $blocker): static
    {
        if ($this->blockers->removeElement($blocker)) {
            // set the owning side to null (unless already changed)
            if ($blocker->getUserBlocker() === $this) {
                $blocker->setUserBlocker(null);
            }
        }

        return $this;
    }
    public function hasBlocked(User $other): bool
    {
        foreach ($this->getBlockers() as $block) {
            if ($block->getUserBlocked()->getId() === $other->getId()) {
                return true;
            }
        }
        return false;
    }

    public function isReadOnly(): ?bool
    {
        return $this->readOnly;
    }

    public function setReadOnly(bool $readOnly): static
    {
        $this->readOnly = $readOnly;

        return $this;
    }
}
