<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250401091411 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE blocked (id INT AUTO_INCREMENT NOT NULL, user_blocked_id INT NOT NULL, user_blocker_id INT NOT NULL, INDEX IDX_DA55EB80869897DA (user_blocked_id), INDEX IDX_DA55EB80F3EA9F99 (user_blocker_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE blocked ADD CONSTRAINT FK_DA55EB80869897DA FOREIGN KEY (user_blocked_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE blocked ADD CONSTRAINT FK_DA55EB80F3EA9F99 FOREIGN KEY (user_blocker_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE blocked DROP FOREIGN KEY FK_DA55EB80869897DA');
        $this->addSql('ALTER TABLE blocked DROP FOREIGN KEY FK_DA55EB80F3EA9F99');
        $this->addSql('DROP TABLE blocked');
    }
}
