CREATE DATABASE  IF NOT EXISTS `food_delivery` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `food_delivery`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: food_delivery
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `address` (
  `address_id` int NOT NULL AUTO_INCREMENT,
  `street_address1` char(128) NOT NULL,
  `street_address2` char(128) DEFAULT NULL,
  `city_name` char(50) NOT NULL,
  `state_name` char(50) NOT NULL,
  `zip_code` char(5) NOT NULL,
  `email_address` char(50) NOT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`address_id`),
  KEY `fk_address` (`email_address`),
  CONSTRAINT `fk_address` FOREIGN KEY (`email_address`) REFERENCES `user` (`email`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
INSERT INTO `address` VALUES (1,'1234 ABC ST','Apt 5','Boston','MA','02115','ns@mail.com',1),(2,'1234 DEF ST','Apt 20','Boston','MA','02115','sm@mail.com',1);
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chain`
--

DROP TABLE IF EXISTS `chain`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chain` (
  `chain_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `address` text NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `operating_hours` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`chain_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chain`
--

LOCK TABLES `chain` WRITE;
/*!40000 ALTER TABLE `chain` DISABLE KEYS */;
INSERT INTO `chain` VALUES (1,'Boylston','000 Boylston St, Boston, MA 02115','765-000-000','9 AM - 8 PM'),(2,'Chestnut','000 Chestnut St, Boston, MA 02115','765-000-001','9 AM - 8 PM'),(3,'Newton','000 Newton St, Boston, MA 02115','765-000-002','9 AM - 8 PM');
/*!40000 ALTER TABLE `chain` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delivery`
--

DROP TABLE IF EXISTS `delivery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery` (
  `order_id` int NOT NULL,
  `agent_id` int NOT NULL AUTO_INCREMENT,
  `ETA` datetime NOT NULL,
  `status` enum('preparing','cooking','waiting for pickup','on the way!','delivered') DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `fk_delivery_agent_id` (`agent_id`),
  CONSTRAINT `fk_delivery_agent_id` FOREIGN KEY (`agent_id`) REFERENCES `delivery_agent` (`agent_id`),
  CONSTRAINT `fk_delivery_order_id` FOREIGN KEY (`order_id`) REFERENCES `order_details` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery`
--

LOCK TABLES `delivery` WRITE;
/*!40000 ALTER TABLE `delivery` DISABLE KEYS */;
/*!40000 ALTER TABLE `delivery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delivery_agent`
--

DROP TABLE IF EXISTS `delivery_agent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_agent` (
  `agent_id` int NOT NULL AUTO_INCREMENT,
  `phone_number` varchar(10) NOT NULL,
  `email_address` varchar(50) NOT NULL,
  `number_of_trips` int NOT NULL,
  `is_free` tinyint(1) NOT NULL DEFAULT '1',
  `SSN` varchar(10) NOT NULL,
  PRIMARY KEY (`agent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_agent`
--

LOCK TABLES `delivery_agent` WRITE;
/*!40000 ALTER TABLE `delivery_agent` DISABLE KEYS */;
INSERT INTO `delivery_agent` VALUES (1,'2130000000','agent1@mail.com',220,1,'000000000'),(2,'2130000001','agent2@mail.com',310,1,'000000001'),(3,'2130000002','agent3@mail.com',55,1,'000000002');
/*!40000 ALTER TABLE `delivery_agent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_items`
--

DROP TABLE IF EXISTS `menu_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_items` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `item_name` varchar(50) NOT NULL,
  `description` varchar(512) NOT NULL,
  `price` float NOT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_items`
--

LOCK TABLES `menu_items` WRITE;
/*!40000 ALTER TABLE `menu_items` DISABLE KEYS */;
INSERT INTO `menu_items` VALUES (1,'Margherita Pizza','Classic pizza with tomato sauce, mozzarella, and basil',12.99),(2,'Ceasar Salad','A green salad of romaine lettuce and croutons dressed with lemon juice (or lime juice), olive oil, eggs, Worcestershire sauce, anchovies, garlic, Dijon mustard, Parmesan and black pepper.',8.99),(3,'Boston Cream Pie','A cake made with tender vanilla sponge cake filled with silky vanilla pastry cream all topped by a glossy chocolate ganache.',6.99);
/*!40000 ALTER TABLE `menu_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `email_address` varchar(50) NOT NULL,
  `address_id` int NOT NULL,
  `card_number` varchar(16) NOT NULL,
  `total_price` int NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `fk_email_address` (`email_address`),
  KEY `fk_payment_method_od` (`card_number`),
  KEY `fk_address_od` (`address_id`),
  CONSTRAINT `fk_address_od` FOREIGN KEY (`address_id`) REFERENCES `address` (`address_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_email_address` FOREIGN KEY (`email_address`) REFERENCES `user` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_payment_method_od` FOREIGN KEY (`card_number`) REFERENCES `payment_method` (`card_number`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `order_id` int NOT NULL,
  `item_id` int NOT NULL,
  `qty` int NOT NULL,
  `customer_preference` varchar(1028) DEFAULT NULL,
  PRIMARY KEY (`order_id`,`item_id`),
  KEY `fk_menu_items` (`item_id`),
  CONSTRAINT `fk_menu_items` FOREIGN KEY (`item_id`) REFERENCES `menu_items` (`item_id`),
  CONSTRAINT `fk_order_items` FOREIGN KEY (`order_id`) REFERENCES `order_details` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_method`
--

DROP TABLE IF EXISTS `payment_method`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_method` (
  `method` enum('debit','credit') NOT NULL,
  `card_number` varchar(16) NOT NULL,
  `expiry_date` date NOT NULL,
  `cvv` int NOT NULL,
  `zip_code` varchar(5) NOT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT '0',
  `email_address` char(50) NOT NULL,
  PRIMARY KEY (`card_number`),
  KEY `fk_payment_method` (`email_address`),
  CONSTRAINT `fk_payment_method` FOREIGN KEY (`email_address`) REFERENCES `user` (`email`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_method`
--

LOCK TABLES `payment_method` WRITE;
/*!40000 ALTER TABLE `payment_method` DISABLE KEYS */;
INSERT INTO `payment_method` VALUES ('credit','1111111111111111','2026-06-01',790,'02115',1,'ns@mail.com'),('debit','1111111111111112','2029-08-01',220,'02115',1,'sm@mail.com');
/*!40000 ALTER TABLE `payment_method` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Nishant Suresh','ns@mail.com','$2a$10$F.vRF/PqCLA5tlBxXSCIzu7MIcxhHn.0znL3UsaVUQODD/ghVe75e','2025-04-18 05:14:49','2025-04-18 05:14:49'),(2,'Shreyas Manoti','sm@mail.com','$2a$10$3Qrf0yaCQAOSOIp6C55zz.gjVUF9Alib6YTTRiDOugulshTeGo9IG','2025-04-18 05:14:49','2025-04-18 05:14:49');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'food_delivery'
--

--
-- Dumping routines for database 'food_delivery'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-18  1:17:59
