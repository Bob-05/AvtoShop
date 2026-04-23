-- MySQL dump 10.13  Distrib 9.6.0, for Win64 (x86_64)
--
-- Host: localhost    Database: avtoshop_db
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Уникальный идентификатор администратора',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Email для входа в админ-панель',
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Хеш пароля (bcrypt)',
  `role` enum('admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'admin' COMMENT 'Роль пользователя',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Дата и время создания записи',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Учетные данные администраторов';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'admin@avtoshop.ru','$2b$10$uXK4XE2nNGeL68wUflu9quZefwjCClfNnQzFW6FQ5AAYeH4Ob6MQ6','admin','2026-04-14 10:52:13');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Уникальный идентификатор отзыва',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Имя автора отзыва',
  `text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Текст отзыва',
  `rating` tinyint NOT NULL COMMENT 'Оценка от 1 до 5',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Дата и время создания отзыва',
  PRIMARY KEY (`id`),
  CONSTRAINT `chk_rating` CHECK (((`rating` >= 1) and (`rating` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Отзывы клиентов';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,'Алексей Петров','Отличный сервис! Быстро заменили масло и провели диагностику. Цены приятно удивили. Рекомендую!',5,'2026-04-14 10:52:13'),(2,'Мария Иванова','Обращалась по поводу ремонта ходовой. Все сделали качественно, машина едет как новая. Спасибо!',5,'2026-04-14 10:52:13'),(3,'Сергей Козлов','Делал шиномонтаж перед зимой. Очередь была небольшая, приняли быстро, отработали аккуратно.',4,'2026-04-14 10:52:13'),(4,'Елена Смирнова','Неплохой сервис, но пришлось немного подождать. В целом работой довольна.',4,'2026-04-14 10:52:13'),(5,'Дмитрий Волков','Ремонтировали двигатель. Сделали в срок, дали гарантию. Профессионалы своего дела!',5,'2026-04-14 10:52:13'),(6,'Анна Морозова','Удобное расположение, чисто в зоне ожидания. Мастера вежливые и компетентные.',5,'2026-04-14 10:52:13'),(7,'Павел Новиков','Заезжал на диагностику электрики, быстро нашли проблему и устранили. Цена адекватная.',4,'2026-04-14 10:52:13'),(8,'Ольга Зайцева','Лучший автосервис в районе! Всегда все объяснят, покажут, лишнего не навязывают.',5,'2026-04-14 10:52:13'),(10,'Тест','Отличный сервис!',5,'2026-04-16 09:00:49'),(16,'МАКСимка','Обслуживание на высшем уровне',5,'2026-04-22 07:55:51'),(18,'Боб','Цена = качество -> всё прекрасно!!!!!! РЕКОМЕНДУЮ ВСЕМ И РЕКОМЕНДУЙТЕ ВСЕМ!!!!!!!!',5,'2026-04-23 12:09:17'),(19,'Тест','Норм',4,'2026-04-23 12:27:12'),(20,'Александр','Нагрубили!!!',3,'2026-04-23 12:31:28'),(21,'Неизвестность','Неизвестно',5,'2026-04-23 12:32:45'),(22,'Воздух','Воздуходув починили быстро',5,'2026-04-23 12:33:38');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Уникальный идентификатор услуги',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Название услуги',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Подробное описание услуги',
  `price` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Стоимость услуги (в строковом формате)',
  `icon_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Путь к файлу иконки на сервере',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Дата и время создания',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Дата и время последнего обновления',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Перечень услуг автосервиса';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'Замена масла','Полная замена моторного масла и масляного фильтра с промывкой двигателя','от 500 ₽','/uploads/oil.png','2026-04-14 10:52:13','2026-04-23 08:09:36'),(2,'Диагностика ходовой','Компьютерная диагностика и полная проверка состояния подвески и рулевого управления','Бесплатно','/uploads/diagnostic.png','2026-04-14 10:52:13','2026-04-14 10:52:13'),(3,'Ремонт двигателя','Капитальный и частичный ремонт бензиновых и дизельных двигателей любой сложности','от 15 000 ₽','/uploads/engine.png','2026-04-14 10:52:13','2026-04-14 10:52:13'),(4,'Шиномонтаж','Сезонная замена шин, балансировка колес и ремонт проколов','от 1200 ₽','/uploads/tire.png','2026-04-14 10:52:13','2026-04-14 10:52:13'),(5,'Замена тормозных колодок','Диагностика тормозной системы и замена передних/задних колодок','от 800 ₽','/uploads/brakes.png','2026-04-14 10:52:13','2026-04-14 10:52:13'),(6,'Ремонт КПП','Диагностика и ремонт механических и автоматических коробок передач','от 5000 ₽','/uploads/gearbox.png','2026-04-14 10:52:13','2026-04-14 10:52:13'),(7,'Кузовной ремонт','Устранение царапин, вмятин, локальная покраска и полная покраска кузова','от 3000 ₽','/uploads/body.png','2026-04-14 10:52:13','2026-04-14 10:52:13'),(8,'Электрика','Диагностика и ремонт электрооборудования, установка дополнительного оборудования','от 1000 ₽','/uploads/electrical.png','2026-04-14 10:52:13','2026-04-14 10:52:13'),(11,'Апгрейд системы безопасности','Апгрейд системы безопасности. Цен зависит от уровня апгрейда','от 5',NULL,'2026-04-20 08:07:31','2026-04-23 12:49:08');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-23 16:23:17
