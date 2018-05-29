-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.1.30-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win32
-- HeidiSQL Versión:             9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Volcando estructura de base de datos para scrum
CREATE DATABASE IF NOT EXISTS `scrum` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `scrum`;

-- Volcando estructura para tabla scrum.develop
CREATE TABLE IF NOT EXISTS `develop` (
  `Id_tm` int(50) unsigned NOT NULL,
  `Id_sprint` int(50) unsigned NOT NULL,
  `Id_us` int(50) unsigned NOT NULL,
  KEY `FK_develop_team_member` (`Id_tm`),
  KEY `FK_develop_sprint` (`Id_sprint`),
  KEY `FK_develop_user_story` (`Id_us`),
  CONSTRAINT `FK_develop_sprint` FOREIGN KEY (`Id_sprint`) REFERENCES `sprint` (`Id_sprint`),
  CONSTRAINT `FK_develop_team_member` FOREIGN KEY (`Id_tm`) REFERENCES `team_member` (`Id_tm`),
  CONSTRAINT `FK_develop_user_story` FOREIGN KEY (`Id_us`) REFERENCES `user_story` (`Id_us`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla scrum.develop: ~0 rows (aproximadamente)
DELETE FROM `develop`;
/*!40000 ALTER TABLE `develop` DISABLE KEYS */;
INSERT INTO `develop` (`Id_tm`, `Id_sprint`, `Id_us`) VALUES
	(1, 3, 1),
	(2, 1, 2),
	(1, 1, 3),
	(3, 1, 4),
	(3, 2, 5),
	(1, 3, 5);
/*!40000 ALTER TABLE `develop` ENABLE KEYS */;

-- Volcando estructura para tabla scrum.sprint
CREATE TABLE IF NOT EXISTS `sprint` (
  `Id_sprint` int(50) unsigned NOT NULL AUTO_INCREMENT,
  `Fecha_Inicio` date DEFAULT NULL,
  `Fecha_Fin` date DEFAULT NULL,
  `Nombre` char(30) DEFAULT NULL,
  `Status` enum('Activo','Terminado') NOT NULL,
  `Review` char(50) DEFAULT NULL,
  PRIMARY KEY (`Id_sprint`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla scrum.sprint: ~3 rows (aproximadamente)
DELETE FROM `sprint`;
/*!40000 ALTER TABLE `sprint` DISABLE KEYS */;
INSERT INTO `sprint` (`Id_sprint`, `Fecha_Inicio`, `Fecha_Fin`, `Nombre`, `Status`, `Review`) VALUES
	(1, '2018-05-29', '2018-06-14', 'fase1', 'Activo', 'funcionando'),
	(2, '2018-05-28', '2018-06-17', 'fase2', 'Activo', 'dandole'),
	(3, '2018-05-08', '2018-05-20', 'inicio', 'Terminado', 'todo correcto');
/*!40000 ALTER TABLE `sprint` ENABLE KEYS */;

-- Volcando estructura para tabla scrum.store
CREATE TABLE IF NOT EXISTS `store` (
  `Id_us` int(50) unsigned NOT NULL,
  `Id_st` int(50) unsigned NOT NULL,
  KEY `FK_store_stored_user_story` (`Id_st`),
  KEY `FK_store_user_story` (`Id_us`),
  CONSTRAINT `FK_store_stored_user_story` FOREIGN KEY (`Id_st`) REFERENCES `stored_user_story` (`Id_st`),
  CONSTRAINT `FK_store_user_story` FOREIGN KEY (`Id_us`) REFERENCES `user_story` (`Id_us`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla scrum.store: ~0 rows (aproximadamente)
DELETE FROM `store`;
/*!40000 ALTER TABLE `store` DISABLE KEYS */;
/*!40000 ALTER TABLE `store` ENABLE KEYS */;

-- Volcando estructura para tabla scrum.stored_user_story
CREATE TABLE IF NOT EXISTS `stored_user_story` (
  `Id_st` int(50) unsigned NOT NULL,
  `Nombre_us_story` char(30) NOT NULL,
  `Prioridad` char(10) NOT NULL,
  `Dificultad` int(5) NOT NULL,
  `Comentarios` char(50) NOT NULL,
  `Horas_Acumuladas` int(10) NOT NULL,
  `Status` char(30) NOT NULL,
  `As_A` char(30) NOT NULL,
  `I_Want` char(30) NOT NULL,
  `So_That` char(30) NOT NULL,
  `Developer` char(50) DEFAULT NULL,
  `Sprint` char(50) DEFAULT NULL,
  PRIMARY KEY (`Id_st`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla scrum.stored_user_story: ~0 rows (aproximadamente)
DELETE FROM `stored_user_story`;
/*!40000 ALTER TABLE `stored_user_story` DISABLE KEYS */;
/*!40000 ALTER TABLE `stored_user_story` ENABLE KEYS */;

-- Volcando estructura para tabla scrum.team_member
CREATE TABLE IF NOT EXISTS `team_member` (
  `Id_tm` int(50) unsigned NOT NULL AUTO_INCREMENT,
  `Nombre` char(30) DEFAULT NULL,
  `Rol` enum('Scrum_manager','Developer') NOT NULL DEFAULT 'Developer',
  `Apl` char(50) DEFAULT NULL,
  `Nick` char(20) DEFAULT NULL,
  `Login` char(20) DEFAULT NULL,
  `Password` char(20) DEFAULT NULL,
  `E_mail` char(50) DEFAULT NULL,
  PRIMARY KEY (`Id_tm`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla scrum.team_member: ~3 rows (aproximadamente)
DELETE FROM `team_member`;
/*!40000 ALTER TABLE `team_member` DISABLE KEYS */;
INSERT INTO `team_member` (`Id_tm`, `Nombre`, `Rol`, `Apl`, `Nick`, `Login`, `Password`, `E_mail`) VALUES
	(1, 'Carmelo', 'Developer', 'Coton', 'url', 'Carmelo_Coton', 'hola123', 'carmelocoton@gmail.com'),
	(2, 'Helen', 'Scrum_manager', 'Chufes', 'url', 'Helen_Chufes', 'pass', 'helenchufes@gmail.com'),
	(3, 'Juanchi', 'Developer', 'Chones', 'url', 'JuanCho', 'juanchicrack', 'juchi@hotmail.com');
/*!40000 ALTER TABLE `team_member` ENABLE KEYS */;

-- Volcando estructura para tabla scrum.user_story
CREATE TABLE IF NOT EXISTS `user_story` (
  `Id_us` int(50) unsigned NOT NULL AUTO_INCREMENT,
  `Nombre` char(30) DEFAULT NULL,
  `Prioridad` enum('Unknown','Alta','media','baja') DEFAULT 'Unknown',
  `Dificultad` int(5) NOT NULL DEFAULT '-1',
  `Comentarios` char(50) DEFAULT NULL,
  `Horas_Acumuladas` int(10) DEFAULT NULL,
  `Status` enum('No_iniciada','En_curso','Suspendida','Pendiente_de_validacion','terminada') DEFAULT NULL,
  `As_A` char(30) DEFAULT NULL,
  `I_Want` char(30) DEFAULT NULL,
  `So_That` char(30) DEFAULT NULL,
  PRIMARY KEY (`Id_us`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla scrum.user_story: ~0 rows (aproximadamente)
DELETE FROM `user_story`;
/*!40000 ALTER TABLE `user_story` DISABLE KEYS */;
INSERT INTO `user_story` (`Id_us`, `Nombre`, `Prioridad`, `Dificultad`, `Comentarios`, `Horas_Acumuladas`, `Status`, `As_A`, `I_Want`, `So_That`) VALUES
	(1, 'ing_software', 'media', 2, 'va a ser complicado', 50, 'En_curso', NULL, NULL, NULL),
	(2, 'http', 'Unknown', 6, 'comentario', 30000, 'Pendiente_de_validacion', NULL, NULL, NULL),
	(3, 'angularjs', 'baja', 10, 'comentario 2', 1, 'Suspendida', NULL, NULL, NULL),
	(4, 'node', 'Alta', 16, 'comentario 3', 3, 'terminada', NULL, NULL, NULL),
	(5, 'despedir', 'Alta', 3, 'a la calle', 7, 'En_curso', NULL, NULL, NULL),
	(6, 'algo', 'baja', 3, 'mas algo', 5, 'En_curso', NULL, NULL, NULL);
/*!40000 ALTER TABLE `user_story` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
