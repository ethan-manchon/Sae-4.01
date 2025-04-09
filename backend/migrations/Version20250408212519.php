<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250408212519 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE repost DROP FOREIGN KEY FK_DD3446C59D86650F');
        $this->addSql('ALTER TABLE repost DROP FOREIGN KEY FK_DD3446C5E85F12B8');
        $this->addSql('DROP INDEX IDX_DD3446C59D86650F ON repost');
        $this->addSql('DROP INDEX IDX_DD3446C5E85F12B8 ON repost');
        $this->addSql('ALTER TABLE repost ADD user_id INT DEFAULT NULL, ADD post_id INT DEFAULT NULL, DROP user_id_id, DROP post_id_id');
        $this->addSql('ALTER TABLE repost ADD CONSTRAINT FK_DD3446C5A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE repost ADD CONSTRAINT FK_DD3446C54B89032C FOREIGN KEY (post_id) REFERENCES post (id)');
        $this->addSql('CREATE INDEX IDX_DD3446C5A76ED395 ON repost (user_id)');
        $this->addSql('CREATE INDEX IDX_DD3446C54B89032C ON repost (post_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE repost DROP FOREIGN KEY FK_DD3446C5A76ED395');
        $this->addSql('ALTER TABLE repost DROP FOREIGN KEY FK_DD3446C54B89032C');
        $this->addSql('DROP INDEX IDX_DD3446C5A76ED395 ON repost');
        $this->addSql('DROP INDEX IDX_DD3446C54B89032C ON repost');
        $this->addSql('ALTER TABLE repost ADD user_id_id INT DEFAULT NULL, ADD post_id_id INT DEFAULT NULL, DROP user_id, DROP post_id');
        $this->addSql('ALTER TABLE repost ADD CONSTRAINT FK_DD3446C59D86650F FOREIGN KEY (user_id_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE repost ADD CONSTRAINT FK_DD3446C5E85F12B8 FOREIGN KEY (post_id_id) REFERENCES post (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_DD3446C59D86650F ON repost (user_id_id)');
        $this->addSql('CREATE INDEX IDX_DD3446C5E85F12B8 ON repost (post_id_id)');
    }
}
