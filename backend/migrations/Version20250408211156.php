<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250408211156 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE repost (id INT AUTO_INCREMENT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE post ADD repost_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE post ADD CONSTRAINT FK_5A8A6C8D76B28D70 FOREIGN KEY (repost_id) REFERENCES repost (id)');
        $this->addSql('CREATE INDEX IDX_5A8A6C8D76B28D70 ON post (repost_id)');
        $this->addSql('ALTER TABLE user ADD repost_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D64976B28D70 FOREIGN KEY (repost_id) REFERENCES repost (id)');
        $this->addSql('CREATE INDEX IDX_8D93D64976B28D70 ON user (repost_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE post DROP FOREIGN KEY FK_5A8A6C8D76B28D70');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D64976B28D70');
        $this->addSql('DROP TABLE repost');
        $this->addSql('DROP INDEX IDX_8D93D64976B28D70 ON user');
        $this->addSql('ALTER TABLE user DROP repost_id');
        $this->addSql('DROP INDEX IDX_5A8A6C8D76B28D70 ON post');
        $this->addSql('ALTER TABLE post DROP repost_id');
    }
}
