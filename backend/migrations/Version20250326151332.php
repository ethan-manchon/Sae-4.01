<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250326151332 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE subscribe (id INT AUTO_INCREMENT NOT NULL, follower_id INT NOT NULL, following_id INT NOT NULL, INDEX IDX_68B95F3EAC24F853 (follower_id), INDEX IDX_68B95F3E1816E3A3 (following_id), UNIQUE INDEX unique_subscribe (follower_id, following_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE subscribe ADD CONSTRAINT FK_68B95F3EAC24F853 FOREIGN KEY (follower_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE subscribe ADD CONSTRAINT FK_68B95F3E1816E3A3 FOREIGN KEY (following_id) REFERENCES user (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE subscribe DROP FOREIGN KEY FK_68B95F3EAC24F853');
        $this->addSql('ALTER TABLE subscribe DROP FOREIGN KEY FK_68B95F3E1816E3A3');
        $this->addSql('DROP TABLE subscribe');
    }
}
