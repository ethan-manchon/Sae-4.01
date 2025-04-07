-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Hôte : sae-mysql
-- Généré le : lun. 07 avr. 2025 à 11:24
-- Version du serveur : 8.4.4
-- Version de PHP : 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `SAE401`
--

-- --------------------------------------------------------

--
-- Structure de la table `access_token`
--

CREATE TABLE `access_token` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` datetime NOT NULL,
  `hashed_token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `is_valid` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `access_token`
--

INSERT INTO `access_token` (`id`, `user_id`, `created_at`, `hashed_token`, `expires_at`, `is_valid`) VALUES
(17, 15, '2025-03-24 10:10:46', '40d3e2d6759de8f4337b4e395215053d288578268fb2b283e575108682801ad3', '2025-03-31 10:10:46', 0),
(18, 12, '2025-03-25 10:10:03', 'daf0366bf0b47a52071445d1db159dad15d704e5ead6b8db1c3ba9d2f2c9f0e2', '2025-04-01 10:10:03', 0),
(19, 12, '2025-03-25 10:10:07', '797564fafe4691f5250ae8e69bf951e4e1b761080d8e13ce58ba2474333b9755', '2025-04-01 10:10:07', 0),
(20, 17, '2025-03-25 10:12:35', 'b896ec7e3e76014f696898007ae7f0cf190f1e832eafcbb4332da9c91d298279', '2025-04-01 10:12:35', 0),
(21, 17, '2025-03-25 10:17:55', '091eb15d0f3a34405a939ebd118e82450d8490f14acdd270d0f1bc9b29e47a63', '2025-04-01 10:17:55', 0),
(22, 18, '2025-03-25 10:26:11', 'b4e44f22a4ebc3033e1d3bc0fc6c19dab89b717f59005b036ed35864d884823e', '2025-04-01 10:26:11', 1),
(23, 12, '2025-03-25 15:39:18', '34ce43e7971adfd39e665959a813b936e8c0dfbf2fdb3e2cb90cb4c7f8cd2fa7', '2025-04-01 15:39:18', 0),
(24, 15, '2025-03-25 15:58:02', 'f9fc74cab3dee117ea143aef084c486b926c859dca1dff1c8859d7f69a5cf946', '2025-04-01 15:58:02', 0),
(25, 15, '2025-03-25 15:58:03', 'f284bc3003516f6e8c9105398dec86b1f3b98ef19c0e202304ffc5e99f46cce1', '2025-04-01 15:58:03', 0),
(26, 12, '2025-03-25 15:58:30', 'ad52718222eb95b3813c9d82145026622ab615910d1639319e7472a4c7a0822e', '2025-04-01 15:58:30', 0),
(27, 15, '2025-03-25 16:00:58', 'dc2057b9da83fc08343b986525310eec98e4c2bff81899545f2d0f5d43babb77', '2025-04-01 16:00:58', 0),
(28, 12, '2025-03-25 16:01:09', 'fd65b7a4aca5bbdd2f028a469f1df5c3d07b8c858e52d417f46d55cdabf442fd', '2025-04-01 16:01:09', 0),
(29, 12, '2025-03-25 20:33:48', '140b08d06cdac37f2ed3558eeaf24441e0416b6133a16f03670e898974240f76', '2025-04-01 20:33:48', 0),
(30, 12, '2025-03-26 07:30:06', 'c7d86ca7181a6af9e30d702427dbbed96acd899c1b8e847ef1d85679affa6a0a', '2025-04-02 07:30:06', 0),
(31, 12, '2025-03-26 09:58:02', 'a726b22c101177b1686aa7c3f986547db86af94a63989cd2667856c371a7eaa3', '2025-04-02 09:58:02', 0),
(32, 12, '2025-03-26 09:58:03', 'be00f118e635aff3272733f8cf41737f635fcfd85ee43ebc4449f4ca1e1206ff', '2025-04-02 09:58:03', 0),
(33, 12, '2025-03-26 10:00:16', '82fe21380cc4e2291c4b009ceb50d75757eb55f1397b84c644c8a5db54eedbeb', '2025-04-02 10:00:16', 0),
(34, 14, '2025-03-26 10:00:26', 'c9f16d55365f62e07ef00c887d190e496b2da5bc3ed6060445e747f7ee39ac04', '2025-04-02 10:00:26', 1),
(35, 12, '2025-03-26 10:00:48', 'de6c3de05abee83f9ec9093c7a99b688bd6c0a4a2c8cab6fd76033a808ea3e9f', '2025-04-02 10:00:48', 0),
(36, 12, '2025-03-26 10:13:06', 'a2995db951dfe83fe51e786e95b64abd46b33baaeb66b943efb0ef0b905ee101', '2025-04-02 10:13:06', 0),
(37, 12, '2025-03-26 13:07:41', 'f6cd70c939a304c57a4dabcaaa97cf880a17347ab6a80482d4624ff91aa0b688', '2025-04-02 13:07:41', 0),
(38, 12, '2025-03-26 14:28:28', '863aa62f8f3a2014ffe8e8c21265045438087a0f8eca1fe14a4c0579ddba170d', '2025-04-02 14:28:28', 0),
(39, 12, '2025-03-26 15:01:55', 'afa285911a0f4d92d12599ba68ee8dcddcbf960a578a0b1cc289258b5f5c658d', '2025-04-02 15:01:55', 0),
(40, 15, '2025-03-26 21:03:33', 'd1e3efc9776028f964bde66d045b9b93412ea20fb24b6694b836b4be906f6deb', '2025-04-02 21:03:33', 0),
(41, 12, '2025-03-26 22:45:42', '69c71232e0b8449e5700c26d9d3739b3e051523b5252eb2d287fa5680971d8a9', '2025-04-02 22:45:42', 0),
(42, 17, '2025-03-26 23:03:09', '0b1a996767e33e0ba7bfe20b3073cefd9c0cfc2648600d8c340270f249108b4d', '2025-04-02 23:03:09', 0),
(43, 15, '2025-03-26 23:03:38', 'f87cedb4d1ab7a48712a346f63c027efc02fc2d361552c5997f3ffa36e65d6ef', '2025-04-02 23:03:38', 1),
(44, 17, '2025-03-26 23:04:23', '91adb51840963d81eb66bdadc61bd07382fc1f69c25633c569a2aee1d8e533b5', '2025-04-02 23:04:23', 0),
(45, 17, '2025-03-26 23:51:12', '7bd6246f8298a8a92f49af781a9765b9c888f7f90165a75194b82aab5376f1f8', '2025-04-02 23:51:12', 0),
(46, 17, '2025-03-26 23:53:56', 'b720829fe74d6fd040d095547f442ab21bc7b89bc1ce9b65fe419d3fd484b8c9', '2025-04-02 23:53:56', 0),
(47, 21, '2025-04-01 08:25:52', 'eedc9527f63a668ca1b9f76a4a9d7a2716d46602cdde46612d28a2676bf4710a', '2025-04-08 08:25:52', 0),
(48, 21, '2025-04-01 09:24:39', '4c0fe9d584c5507272a5c8c3dc3ca1a67b01cb99a5cf0d3d9d83336078f941d0', '2025-04-08 09:24:39', 0),
(49, 21, '2025-04-01 09:24:41', '4d2f1f3122ec78f2b18bf2aed2fe30a9d01cf6cc1343475791271a1eb09f8810', '2025-04-08 09:24:41', 0),
(50, 21, '2025-04-01 09:24:52', '78fa1ce173112e891b65f6c1ae87309b542a65b56913fd7a43bd89d5ebd928c1', '2025-04-08 09:24:52', 0),
(51, 21, '2025-04-01 09:27:47', '0d2d7587aad77a15b41189ae8785bef56bb532323c192234756b75606d53e098', '2025-04-08 09:27:47', 0),
(52, 17, '2025-04-01 09:37:13', '0572d65e145128257e675229c951b2d27c8f86834e05ee9c59ab9d07cfb1e168', '2025-04-08 09:37:13', 0),
(53, 21, '2025-04-02 11:57:24', '3b709989db3aa6beb9d79f18b8a5cf16c9085108d08790d39e365b0a9880aa5f', '2025-04-09 11:57:24', 0),
(54, 21, '2025-04-02 15:44:54', '97aa1c17344ac7f357a9d99e6c0e0289c0e9a908c670f48773d4b5e52d2228e3', '2025-04-09 15:44:54', 0),
(55, 21, '2025-04-02 15:44:55', '418729ba28f205d8360fe68f1c50a2425d8700dc47b5ee930da634116aa2c037', '2025-04-09 15:44:55', 0),
(56, 21, '2025-04-02 19:54:14', '8aaa6747ee900df8a9a8b12cb2bdba1608d760f5d5e238b3034351888dcad7f9', '2025-04-09 19:54:14', 0),
(57, 12, '2025-04-03 17:50:14', '13b6d49dc56bb3a6047bc72430588643cab7667b3ba2c745710f5fda1ebaad9c', '2025-04-10 17:50:14', 0),
(58, 12, '2025-04-03 17:50:14', '45eb9438f20cbf357dba41c06eb01cad2b68a67b61114409e7f71b7d54edc7aa', '2025-04-10 17:50:14', 1),
(59, 21, '2025-04-03 17:52:43', 'fd15aa808ee3abc769ea97787f745e4ee6dde0ae5006383ff52eceeda4bd8876', '2025-04-10 17:52:43', 1),
(60, 17, '2025-04-03 17:53:30', '46a26cc042b77b2d014f77f5d06ed0782cecd447e42a00fda8f9e727b1600c15', '2025-04-10 17:53:30', 0),
(61, 17, '2025-04-04 11:06:03', '24028b3b3152c43cb73a8ee606676345604f2c71a3760e738baf073c792b65e7', '2025-04-11 11:06:03', 1);

-- --------------------------------------------------------

--
-- Structure de la table `blocked`
--

CREATE TABLE `blocked` (
  `id` int NOT NULL,
  `user_blocked_id` int NOT NULL,
  `user_blocker_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `blocked`
--

INSERT INTO `blocked` (`id`, `user_blocked_id`, `user_blocker_id`) VALUES
(4, 8, 17),
(18, 21, 17);

-- --------------------------------------------------------

--
-- Structure de la table `doctrine_migration_versions`
--

CREATE TABLE `doctrine_migration_versions` (
  `version` varchar(191) COLLATE utf8mb3_unicode_ci NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Déchargement des données de la table `doctrine_migration_versions`
--

INSERT INTO `doctrine_migration_versions` (`version`, `executed_at`, `execution_time`) VALUES
('DoctrineMigrations\\Version20250314132542', '2025-03-17 14:39:30', 36),
('DoctrineMigrations\\Version20250315123200', '2025-03-17 14:39:30', 40),
('DoctrineMigrations\\Version20250315123432', '2025-03-17 14:39:30', 83),
('DoctrineMigrations\\Version20250323111246', '2025-03-23 11:12:54', 29),
('DoctrineMigrations\\Version20250323220638', '2025-03-23 22:06:46', 166),
('DoctrineMigrations\\Version20250323223737', '2025-03-23 22:37:39', 91),
('DoctrineMigrations\\Version20250323225657', '2025-03-23 22:57:01', 87),
('DoctrineMigrations\\Version20250323231600', '2025-03-23 23:16:05', 93),
('DoctrineMigrations\\Version20250324103830', '2025-03-24 10:38:46', 198),
('DoctrineMigrations\\Version20250324104302', '2025-03-24 10:43:10', 282),
('DoctrineMigrations\\Version20250324132232', '2025-03-24 13:22:43', 190),
('DoctrineMigrations\\Version20250324134824', '2025-03-24 13:48:25', 197),
('DoctrineMigrations\\Version20250326082020', '2025-03-26 08:20:34', 56),
('DoctrineMigrations\\Version20250326092352', '2025-03-26 09:23:56', 153),
('DoctrineMigrations\\Version20250326125220', '2025-03-26 12:52:32', 46),
('DoctrineMigrations\\Version20250326130129', '2025-03-26 13:01:33', 24),
('DoctrineMigrations\\Version20250326151332', '2025-03-26 15:13:34', 441),
('DoctrineMigrations\\Version20250326200223', '2025-03-26 20:02:32', 381),
('DoctrineMigrations\\Version20250326225729', '2025-03-26 22:57:31', 74),
('DoctrineMigrations\\Version20250328092704', '2025-03-28 09:27:14', 58),
('DoctrineMigrations\\Version20250329224208', '2025-03-29 22:42:17', 260),
('DoctrineMigrations\\Version20250331093603', '2025-03-31 09:47:23', 45),
('DoctrineMigrations\\Version20250401091411', '2025-04-01 09:14:29', 267),
('DoctrineMigrations\\Version20250403110943', '2025-04-03 11:09:53', 46),
('DoctrineMigrations\\Version20250403171018', '2025-04-03 17:10:30', 35),
('DoctrineMigrations\\Version20250404110229', '2025-04-04 11:02:44', 53);

-- --------------------------------------------------------

--
-- Structure de la table `post`
--

CREATE TABLE `post` (
  `id` int NOT NULL,
  `content` varchar(280) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `user_id` int NOT NULL,
  `media` json DEFAULT NULL,
  `censor` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `post`
--

INSERT INTO `post` (`id`, `content`, `created_at`, `user_id`, `media`, `censor`) VALUES
(1, 'Juste une journée parfaite au parc! ☀️', '2023-09-25 14:30:00', 1, NULL, 0),
(2, 'Déjeuner délicieux avec des amis! 🍔', '2023-09-26 12:45:00', 3, NULL, 0),
(3, 'Nouvelle lecture passionnante! 📚', '2023-09-27 18:20:00', 4, NULL, 0),
(4, 'Soirée cinéma à la maison! 🎬', '2023-09-28 20:15:00', 6, NULL, 0),
(5, 'Balade matinale dans la forêt. 🌳', '2023-09-29 08:00:00', 7, NULL, 0),
(6, 'Atelier de peinture réussi! 🎨', '2023-09-30 15:30:00', 8, NULL, 0),
(7, 'Dîner romantique en tête-à-tête. ❤️', '2023-10-01 19:00:00', 12, NULL, 0),
(8, 'Concert incroyable hier soir! 🎤', '2023-10-02 22:30:00', 14, NULL, 0),
(9, 'Journée de détente au spa. 🧪', '2023-10-03 11:00:00', 15, NULL, 0),
(10, 'Randonnée épique en montagne! ⛰️', '2023-10-04 13:45:00', 1, NULL, 0),
(11, 'Découverte d\'un nouveau café en ville. ☕', '2023-10-05 10:30:00', 3, NULL, 0),
(12, 'Soirée jeux de société entre amis. 🎲', '2023-10-06 21:00:00', 4, NULL, 0),
(13, 'Séance de yoga relaxante. 🧘‍♀️', '2023-10-07 09:15:00', 6, NULL, 0),
(14, 'Visite d\'un musée fascinant. 🏛️', '2023-10-08 14:00:00', 7, NULL, 0),
(15, 'Pique-nique au bord du lac. 🌊', '2023-10-09 12:00:00', 8, NULL, 0),
(16, 'Cours de cuisine réussi! 🍳', '2023-10-10 17:30:00', 12, NULL, 0),
(17, 'Sortie vélo dans la campagne. 🚴‍♂️', '2023-10-11 15:45:00', 14, NULL, 0),
(18, 'Nuit sous les étoiles. ✨', '2023-10-12 23:00:00', 15, NULL, 0),
(19, 'Festival de musique inoubliable! 🎶', '2023-10-13 18:30:00', 1, NULL, 0),
(20, 'Après-midi shopping bien rempli. 🛍️', '2023-10-14 16:00:00', 3, NULL, 0),
(21, 'Match de foot intense! ⚽', '2023-10-15 20:45:00', 4, NULL, 0),
(22, 'Exposition d\'art contemporain. 🖼️', '2023-10-16 13:00:00', 6, NULL, 0),
(23, 'Promenade en bord de mer. 🌊', '2023-10-17 11:30:00', 7, NULL, 0),
(24, 'Atelier de poterie créatif. 🏺', '2023-10-18 14:45:00', 8, NULL, 0),
(25, 'Dîner gastronomique exquis. 🍽️', '2023-10-19 19:30:00', 12, NULL, 0),
(26, 'Concert de jazz envoûtant. 🎷', '2023-10-20 21:00:00', 14, NULL, 0),
(27, 'Journée à la plage sous le soleil. 🏖️', '2023-10-21 12:30:00', 15, NULL, 0),
(28, 'Randonnée en forêt magique. 🌳', '2023-10-22 10:00:00', 1, NULL, 0),
(29, 'Soirée théâtre captivante. 🎭', '2023-10-23 20:00:00', 3, NULL, 0),
(30, 'Balade en vélo le long de la rivière. 🚴‍♀️', '2023-10-24 15:00:00', 4, NULL, 0),
(31, 'Découverte d\'un nouveau restaurant. 🍴', '2023-10-25 18:30:00', 6, NULL, 0),
(32, 'Sortie en famille au zoo. 🦁', '2023-10-26 11:00:00', 7, NULL, 0),
(33, 'Atelier de photographie inspirant. 📸', '2023-10-27 14:00:00', 8, NULL, 0),
(34, 'Soirée cinéma en plein air. 🎬', '2023-10-28 21:30:00', 12, NULL, 0),
(35, 'Journée de pêche relaxante. 🎣', '2023-10-29 09:30:00', 14, NULL, 0),
(36, 'Concert de rock électrisant! 🎸', '2023-10-30 22:00:00', 15, NULL, 0),
(37, 'Balade en montgolfière inoubliable. 🎈', '2023-10-31 08:00:00', 1, NULL, 0),
(38, 'Dîner entre amis convivial. 🍷', '2023-11-01 19:00:00', 3, NULL, 0),
(39, 'Sortie en kayak sur le lac. 🛶', '2023-11-02 13:30:00', 4, NULL, 0),
(40, 'Visite d\'un château historique. 🏰', '2023-11-03 11:00:00', 6, NULL, 0),
(41, 'Atelier de cuisine italienne. 🍝', '2023-11-04 17:30:00', 7, NULL, 0),
(42, 'Soirée jeux vidéo entre potes. 🎮', '2023-11-05 20:00:00', 8, NULL, 0),
(43, 'Journée à la ferme avec les enfants. 🐄', '2023-11-06 10:30:00', 12, NULL, 0),
(44, 'Concert de musique classique. 🎻', '2023-11-07 19:30:00', 14, NULL, 0),
(45, 'Balade en raquettes dans la neige. ❄️', '2023-11-08 14:00:00', 15, NULL, 0),
(46, 'Dîner romantique au restaurant. 🍽️', '2023-11-09 18:30:00', 1, NULL, 0),
(47, 'Sortie en bateau sur la rivière. ⛵', '2023-11-10 12:00:00', 3, NULL, 0),
(48, 'Visite d\'un musée d\'art moderne. 🏛️', '2023-11-11 15:00:00', 4, NULL, 0),
(49, 'Atelier de bricolage créatif. 🔧', '2023-11-12 10:30:00', 6, NULL, 0),
(50, 'Soirée cinéma avec des amis. 🎬', '2023-11-13 20:00:00', 7, NULL, 0),
(51, 'ozhdiqzhiod nodj<oozhdiqzhiodnodj<oozhdiqzhiodnodj<oozhdiqzhiodnodj<ooz hdiqzhiodnodj<oozhdiqzhiodnodj<oozhdiqzhiodnodj<oozhdiqzhiodnodj<oozhdiqzhiodnodj<oozhdiqzhiodnodj<oozhdi qzhiodnodj<oozhdiqzhiodnodj<oozhdiqzhiodnodj<oozhdiqzhiodnod j<oozhdiqzhiodnodj<oozhdiqzhiodnodj<o', '2025-03-24 14:28:32', 7, NULL, 0),
(52, 'Hey', '2025-03-24 15:51:38', 15, NULL, 0),
(53, 'Ho', '2025-02-24 15:51:38', 7, NULL, 0),
(54, 'Encore un test de la date ', '2025-03-14 15:55:34', 8, NULL, 0),
(55, 'Et un test supplémetaire', '2025-03-24 17:55:55', 14, NULL, 0),
(56, 'Ton tweet', '2025-03-25 15:15:17', 18, NULL, 0),
(57, 'ENCORE IUN TEST', '2025-03-25 15:15:27', 18, NULL, 0),
(58, 'test', '2025-03-25 15:16:02', 18, NULL, 0),
(59, 'Test d\'affichage dans le home', '2025-03-26 10:48:28', 12, NULL, 0),
(60, 'test', '2025-03-26 10:55:52', 12, NULL, 0),
(61, 'test2', '2025-03-26 10:56:20', 12, NULL, 0),
(62, 'Test', '2025-03-26 12:37:35', 12, NULL, 0),
(63, 'encore un essai', '2025-03-26 12:42:16', 12, NULL, 0),
(64, 'test', '2025-03-26 12:42:25', 12, NULL, 0),
(65, 'encore un essai supplémentaire', '2025-03-26 12:44:22', 12, '[]', 0),
(66, 'test de plus', '2025-03-26 12:45:35', 12, NULL, 0),
(67, 'plus encore', '2025-03-26 12:47:42', 12, NULL, 0),
(68, 'hoIZUYD87AGZIUGDQIUCZHDQKJ', '2025-03-26 15:07:45', 12, NULL, 0),
(69, 'test', '2025-03-26 21:24:09', 15, NULL, 0),
(70, 'encore 1', '2025-03-26 21:24:16', 15, '[]', 0),
(71, 'et test', '2025-03-26 21:24:24', 15, '[]', 0),
(73, 'Ce contenu a été censuré.iuyi', '2025-03-27 12:20:21', 17, '[]', 1),
(86, 'Wouaf !', '2025-04-01 09:27:51', 21, '[]', 0),
(94, 'wouaf!', '2025-04-03 11:49:27', 21, '[\"/assets/post/67ee75c738893.png\", \"/assets/post/67ee75c738ca1.png\"]', 0),
(96, 'Miaou', '2025-04-03 17:07:14', 21, '[\"/assets/post/67eec0422c4ca.png\"]', 1),
(97, 'tralalero tralala', '2025-04-07 08:30:51', 17, '[\"/assets/post/67f38d3ba0e97.jpg\"]', 0);

-- --------------------------------------------------------

--
-- Structure de la table `post_like`
--

CREATE TABLE `post_like` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `post_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `post_like`
--

INSERT INTO `post_like` (`id`, `user_id`, `post_id`) VALUES
(1, 12, 1),
(3, 12, 67),
(2, 12, 68),
(10, 15, 47),
(11, 15, 48),
(8, 15, 55),
(9, 15, 56),
(7, 15, 60),
(6, 15, 63),
(5, 15, 66),
(21, 15, 68),
(22, 15, 70),
(38, 17, 31),
(29, 17, 45),
(97, 17, 46),
(98, 17, 47),
(37, 17, 49),
(30, 17, 52),
(33, 17, 53),
(32, 17, 54),
(72, 17, 57),
(26, 17, 63),
(96, 17, 68),
(35, 17, 69),
(45, 17, 70),
(36, 17, 71),
(95, 17, 73),
(89, 21, 59),
(90, 21, 60),
(91, 21, 63),
(107, 21, 67),
(105, 21, 68),
(106, 21, 86),
(109, 21, 94);

-- --------------------------------------------------------

--
-- Structure de la table `respond`
--

CREATE TABLE `respond` (
  `id` int NOT NULL,
  `id_post_id` int DEFAULT NULL,
  `user_id_id` int DEFAULT NULL,
  `content` varchar(280) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `respond`
--

INSERT INTO `respond` (`id`, `id_post_id`, `user_id_id`, `content`, `created_at`) VALUES
(1, 73, 4, 'Test', '2025-03-29 22:50:36'),
(2, 20, 7, 'Test2', '2025-03-29 22:50:36'),
(3, 73, 8, 'zeadqdeq', '2025-03-29 22:56:53'),
(4, 31, 14, 'zeqs', '2025-03-29 22:56:53'),
(5, 73, 17, 'Content cannot be empty', '2025-03-29 23:31:54'),
(11, 73, 17, 'ahahah', '2025-03-30 21:35:04'),
(14, 55, 17, 'test', '2025-03-30 21:58:09'),
(15, 54, 17, 'ahahah', '2025-03-30 21:58:15'),
(16, 55, 17, 'feur', '2025-03-31 08:52:15'),
(17, 70, 17, 'test', '2025-03-31 09:49:20'),
(18, 73, 17, 'yzeez', '2025-04-01 21:00:26'),
(19, 73, 17, 'ye', '2025-04-01 21:11:00'),
(20, 86, 17, 'test', '2025-04-01 21:43:33'),
(21, 86, 17, 'test', '2025-04-01 22:03:08'),
(22, 46, 17, 'test', '2025-04-01 22:04:28'),
(23, 73, 21, 'ahahah', '2025-04-02 11:57:50'),
(24, 86, 21, '🐕', '2025-04-02 12:13:05'),
(25, 68, 21, 'test', '2025-04-03 07:55:05'),
(26, 67, 21, 'test', '2025-04-03 10:13:43'),
(30, 94, 21, 'teas', '2025-04-03 17:06:28'),
(32, 96, 17, 'test', '2025-04-03 18:08:49');

-- --------------------------------------------------------

--
-- Structure de la table `subscribe`
--

CREATE TABLE `subscribe` (
  `id` int NOT NULL,
  `follower_id` int NOT NULL,
  `following_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `subscribe`
--

INSERT INTO `subscribe` (`id`, `follower_id`, `following_id`) VALUES
(1, 4, 8),
(14, 4, 12),
(4, 12, 18),
(2, 12, 19),
(8, 15, 12),
(19, 17, 1),
(13, 17, 6),
(42, 17, 8),
(10, 17, 12),
(11, 17, 14),
(9, 17, 15),
(41, 17, 21),
(15, 19, 17),
(39, 21, 12),
(38, 21, 15);

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `email` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roles` json NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pseudo` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_verified` tinyint(1) NOT NULL,
  `pdp` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `banniere` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `locate` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refresh` tinyint(1) NOT NULL DEFAULT '1',
  `is_banned` tinyint(1) NOT NULL,
  `read_only` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `email`, `roles`, `password`, `pseudo`, `is_verified`, `pdp`, `bio`, `banniere`, `locate`, `url`, `refresh`, `is_banned`, `read_only`) VALUES
(1, 'ethan@example.com', '[\"ROLE_ADMIN\"]', '$2y$13$LHWtEmjLVtD/do7Cmrz44ef.tD6Bet7Va8NvvUGK9XKmHTtdb61KS', 'ethan_admin', 0, NULL, 'Hello c\'est moi le compte test, et  ceci est ma biographie3', NULL, NULL, NULL, 0, 0, 0),
(3, 'ethanEMAIL@gmail.com', '[\"ROLE_USER\"]', '$2y$13$QjdNYZP0bODkHCjObWmJ7.knmhLkTLU2M3nvH4Z98u178oQYa0qcK', 'Ethan', 0, NULL, NULL, NULL, NULL, 'https://youtube.com', 0, 0, 0),
(4, '3eme@gmail.com', '[\"ROLE_ADMIN\"]', '$2y$13$xE.VYTrulUDgJJVXZIQ/4O18lSj1bXVeXHIZ3eumGslV/b81LFlwe', '3eme', 0, NULL, NULL, NULL, NULL, NULL, 0, 0, 0),
(6, 'ethan.manchon4@gmail.com', '[]', '$2y$13$osad5ow.4zy15jRF1GSa0.cgCw2sYcnspDXEWGMvpg1SGk4VEoJUi', 'Ethan4', 0, NULL, NULL, NULL, NULL, 'https://osqpojsdpq.com', 0, 0, 0),
(7, '6@gmail.com', '[]', '$2y$13$XfTsfzzy8cZ9J5lvksyCKulF5lyO2wyzV/RovGDMklZViyeRF85jO', '6eme', 0, NULL, NULL, NULL, NULL, NULL, 0, 0, 0),
(8, '876@gmail.com', '[]', '$2y$13$4xD.NyVgz/pAhwVl3P/qJuVccazFTddhg/ywPyf76MaT6wzI3GcXC', '67985eme', 0, NULL, NULL, NULL, NULL, NULL, 0, 0, 0),
(12, 'new@email.com', '[\"ROLE_ADMIN\"]', '$2y$13$FdBs/Vj1932kwzwrJezMJOOPdwezpL/Hv6FJ5QLjJrPsW89sL1Upy', 'NouveauPseudo', 1, NULL, 'Hello c\'est moi le compte test, et  ceci est ma biographie', 'ethan5.webp', 'Limoges, France', 'https://www.google.fr/', 1, 0, 0),
(14, 'ethan.manchon@gmail.com', '[\"ROLE_ADMIN\"]', '$2y$13$HDmTPWiU.fVORNHvfeVVWOcT8qrnIVXy2v5UELxYkKPYN5xBa3HUi', 'Ethan5zed', 1, NULL, 'Hello c\'est moi le compte test, et  ceci est ma biographie', NULL, NULL, NULL, 0, 0, 0),
(15, 'atyllion@gmail.com', '[]', '$2y$13$pNpHl8Qo3hTJczUncajdO.nyrgwtvy8vJ0gkXfjvA4ynLxjgPU.u2', 'Captyllion', 1, NULL, NULL, NULL, NULL, NULL, 1, 1, 0),
(17, 'captyllion@gmail.com', '[\"ROLE_ADMIN\"]', '$2y$13$GuVoPFmRg9Oy3h1idr37ZepKXEipgSXeGP2fHZI5jdxvDb/tQPafW', 'Atyllion', 1, '/assets/pdp/67efd1cb3154f.png', 'La biographie en construction !!!', '67efd1cd28629.png', 'Adresse, France', 'https://mmi.unilim.fr', 1, 0, 0),
(18, '9eme@gmail.com', '[]', '$2y$13$GuVoPFmRg9Oy3h1idr37ZepKXEipgSXeGP2fHZI5jdxvDb/tQPafW', '9eme', 1, NULL, NULL, NULL, NULL, NULL, 0, 0, 0),
(19, 'zafqfeq@gmail.com', '[]', '$2y$13$GuVoPFmRg9Oy3h1idr37ZepKXEipgSXeGP2fHZI5jdxvDb/tQPafW', 'eeee', 0, NULL, NULL, NULL, NULL, NULL, 0, 0, 0),
(20, 'zazdadfqfeq@gmail.com', '[]', '$2y$13$GuVoPFmRg9Oy3h1idr37ZepKXEipgSXeGP2fHZI5jdxvDb/tQPafW', 'eeeezda', 1, NULL, NULL, NULL, NULL, NULL, 0, 0, 0),
(21, 'kermestr@gmail.com', '[]', '$2y$13$GuVoPFmRg9Oy3h1idr37ZepKXEipgSXeGP2fHZI5jdxvDb/tQPafW', 'Kermestr', 1, '/assets/pdp/67ed2786259f0.png', '🐶Viens voir mon chenil\n', '67ed2795d5c99.png', ' Kermestr, 29380 Le Trévoux, France', 'https://www.chenildekermestr.fr/ ', 1, 0, 0),
(23, 'mdp@gmail.com', '[]', '$2y$13$GuVoPFmRg9Oy3h1idr37ZepKXEipgSXeGP2fHZI5jdxvDb/tQPafW', 'Mots', 0, NULL, NULL, NULL, NULL, NULL, 1, 0, 0);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `access_token`
--
ALTER TABLE `access_token`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_B6A2DD68A76ED395` (`user_id`);

--
-- Index pour la table `blocked`
--
ALTER TABLE `blocked`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_DA55EB80869897DA` (`user_blocked_id`),
  ADD KEY `IDX_DA55EB80F3EA9F99` (`user_blocker_id`);

--
-- Index pour la table `doctrine_migration_versions`
--
ALTER TABLE `doctrine_migration_versions`
  ADD PRIMARY KEY (`version`);

--
-- Index pour la table `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_5A8A6C8DA76ED395` (`user_id`);

--
-- Index pour la table `post_like`
--
ALTER TABLE `post_like`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_like` (`user_id`,`post_id`),
  ADD KEY `IDX_653627B8A76ED395` (`user_id`),
  ADD KEY `IDX_653627B84B89032C` (`post_id`);

--
-- Index pour la table `respond`
--
ALTER TABLE `respond`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_99C5D5639514AA5C` (`id_post_id`),
  ADD KEY `IDX_99C5D5639D86650F` (`user_id_id`);

--
-- Index pour la table `subscribe`
--
ALTER TABLE `subscribe`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_subscribe` (`follower_id`,`following_id`),
  ADD KEY `IDX_68B95F3EAC24F853` (`follower_id`),
  ADD KEY `IDX_68B95F3E1816E3A3` (`following_id`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_IDENTIFIER_EMAIL` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `access_token`
--
ALTER TABLE `access_token`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT pour la table `blocked`
--
ALTER TABLE `blocked`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT pour la table `post`
--
ALTER TABLE `post`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT pour la table `post_like`
--
ALTER TABLE `post_like`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- AUTO_INCREMENT pour la table `respond`
--
ALTER TABLE `respond`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT pour la table `subscribe`
--
ALTER TABLE `subscribe`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `access_token`
--
ALTER TABLE `access_token`
  ADD CONSTRAINT `FK_B6A2DD68A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `blocked`
--
ALTER TABLE `blocked`
  ADD CONSTRAINT `FK_DA55EB80869897DA` FOREIGN KEY (`user_blocked_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FK_DA55EB80F3EA9F99` FOREIGN KEY (`user_blocker_id`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `FK_5A8A6C8DA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `post_like`
--
ALTER TABLE `post_like`
  ADD CONSTRAINT `FK_653627B84B89032C` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_653627B8A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `respond`
--
ALTER TABLE `respond`
  ADD CONSTRAINT `FK_99C5D5639514AA5C` FOREIGN KEY (`id_post_id`) REFERENCES `post` (`id`),
  ADD CONSTRAINT `FK_99C5D5639D86650F` FOREIGN KEY (`user_id_id`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `subscribe`
--
ALTER TABLE `subscribe`
  ADD CONSTRAINT `FK_68B95F3E1816E3A3` FOREIGN KEY (`following_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_68B95F3EAC24F853` FOREIGN KEY (`follower_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
