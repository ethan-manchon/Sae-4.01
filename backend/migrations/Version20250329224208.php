<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250329224208 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE respond (id INT AUTO_INCREMENT NOT NULL, id_post_id INT DEFAULT NULL, user_id_id INT DEFAULT NULL, content VARCHAR(280) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_99C5D5639514AA5C (id_post_id), INDEX IDX_99C5D5639D86650F (user_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE respond ADD CONSTRAINT FK_99C5D5639514AA5C FOREIGN KEY (id_post_id) REFERENCES post (id)');
        $this->addSql('ALTER TABLE respond ADD CONSTRAINT FK_99C5D5639D86650F FOREIGN KEY (user_id_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE respond DROP FOREIGN KEY FK_99C5D5639514AA5C');
        $this->addSql('ALTER TABLE respond DROP FOREIGN KEY FK_99C5D5639D86650F');
        $this->addSql('DROP TABLE respond');
    }
}
