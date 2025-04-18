<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250323111245 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create user and post tables';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE `user` (
            `id` INT AUTO_INCREMENT NOT NULL,
            `email` VARCHAR(180) COLLATE utf8mb4_unicode_ci NOT NULL,
            `roles` JSON NOT NULL,
            `password` VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
            `pseudo` VARCHAR(18) COLLATE utf8mb4_unicode_ci NOT NULL,
            PRIMARY KEY(`id`)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        $this->addSql('CREATE TABLE `post` (
            `id` INT AUTO_INCREMENT NOT NULL,
            `content` VARCHAR(280) COLLATE utf8mb4_unicode_ci NOT NULL,
            `created_at` DATETIME NOT NULL,
            PRIMARY KEY(`id`)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE post');
        $this->addSql('DROP TABLE user');
    }
}
