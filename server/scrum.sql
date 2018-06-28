-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-06-2018 a las 12:31:32
-- Versión del servidor: 10.1.30-MariaDB
-- Versión de PHP: 7.2.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `scrum`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `develop`
--

CREATE TABLE `develop` (
  `Id_tm` int(50) UNSIGNED NOT NULL,
  `Id_sprint` int(50) UNSIGNED NOT NULL,
  `Id_us` int(50) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `develop`
--

INSERT INTO `develop` (`Id_tm`, `Id_sprint`, `Id_us`) VALUES
(1, 3, 1),
(3, 1, 4),
(3, 2, 5),
(1, 3, 5),
(1, 1, 4),
(8, 4, 7),
(4, 4, 1),
(5, 4, 9),
(6, 4, 8),
(7, 4, 5),
(8, 3, 4),
(7, 2, 1),
(4, 1, 2),
(5, 3, 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sprint`
--

CREATE TABLE `sprint` (
  `Id` int(50) UNSIGNED NOT NULL,
  `Fecha_Inicio` date DEFAULT NULL,
  `Fecha_Fin` date DEFAULT NULL,
  `Nombre` char(30) DEFAULT NULL,
  `Status` enum('Activo','Terminado') NOT NULL,
  `Review` char(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `sprint`
--

INSERT INTO `sprint` (`Id`, `Fecha_Inicio`, `Fecha_Fin`, `Nombre`, `Status`, `Review`) VALUES
(1, '2018-05-29', '2018-06-14', 'fase1', 'Terminado', 'funcionando'),
(2, '2018-06-15', '2018-06-18', 'fase2', 'Terminado', 'NC'),
(3, '2018-06-20', '2018-07-20', 'fase3', 'Terminado', 'todo correcto'),
(4, '2018-07-21', '2018-07-31', 'fase4', 'Activo', 'En proceso');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `store`
--

CREATE TABLE `store` (
  `Id_us` int(50) UNSIGNED NOT NULL,
  `Id_st` int(50) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `stored_user_story`
--

CREATE TABLE `stored_user_story` (
  `Id_st` int(50) UNSIGNED NOT NULL,
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
  `Sprint` char(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `team_member`
--

CREATE TABLE `team_member` (
  `Id` int(50) UNSIGNED NOT NULL,
  `Nombre` char(30) DEFAULT NULL,
  `Rol` enum('Scrum_manager','Developer') NOT NULL DEFAULT 'Developer',
  `Apl` char(50) DEFAULT NULL,
  `Nick` char(20) DEFAULT NULL,
  `Login` char(20) DEFAULT NULL,
  `Password` char(20) DEFAULT NULL,
  `E_mail` char(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `team_member`
--

INSERT INTO `team_member` (`Id`, `Nombre`, `Rol`, `Apl`, `Nick`, `Login`, `Password`, `E_mail`) VALUES
(1, 'Carmelo', 'Developer', 'Coton', 'url', 'Carmelo_Coton', 'hola123', 'carmelocoton@gmail.com'),
(2, 'Helen', 'Scrum_manager', 'Chufes', 'url', 'Helen_Chufes', 'pass', 'helenchufes@gmail.com'),
(3, 'Juanchi', 'Developer', 'Chones', 'url', 'JuanCho', 'juanchicrack', 'juchi@hotmail.com'),
(4, 'Pablo', 'Developer', NULL, 'Pablo', 'Pablo', 'Pablo', NULL),
(5, 'Raul', 'Developer', NULL, 'Raul', 'Raul', 'Raul', NULL),
(6, 'Rodrigo', 'Developer', NULL, 'Rodrigo', 'Rodrigo', 'Rodrigo', NULL),
(7, 'David', 'Developer', NULL, 'David', 'David', 'David', NULL),
(8, 'JJ', 'Developer', NULL, 'JJ', 'JJ', 'JJ', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_story`
--

CREATE TABLE `user_story` (
  `Id` int(50) UNSIGNED NOT NULL,
  `Nombre` char(30) DEFAULT NULL,
  `Prioridad` enum('Unknown','Alta','media','baja') DEFAULT 'Unknown',
  `Dificultad` int(5) NOT NULL DEFAULT '-1',
  `Comentarios` char(50) DEFAULT NULL,
  `Horas_Acumuladas` int(10) DEFAULT NULL,
  `Status` enum('No_iniciada','En_curso','Suspendida','Pendiente_de_validacion','terminada') DEFAULT NULL,
  `As_A` char(30) DEFAULT NULL,
  `I_Want` char(30) DEFAULT NULL,
  `So_That` char(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `user_story`
--

INSERT INTO `user_story` (`Id`, `Nombre`, `Prioridad`, `Dificultad`, `Comentarios`, `Horas_Acumuladas`, `Status`, `As_A`, `I_Want`, `So_That`) VALUES
(1, 'Trabajo1', 'media', 5, 'elaborar servidor', 50, 'Pendiente_de_validacion', NULL, NULL, NULL),
(2, 'Trabajo8', 'Alta', 20, 'valoracion cambio lenguaje sever', 32, 'Suspendida', NULL, NULL, NULL),
(3, 'Trabajo9', 'Alta', 20, 'posible cambio de framework', 32, 'Suspendida', NULL, NULL, NULL),
(4, 'Trabajo2', 'Alta', 16, 'consultas DB', 3, 'terminada', NULL, NULL, NULL),
(5, 'Trabajo3', 'media', 5, 'Generalidades', 7, 'terminada', NULL, NULL, NULL),
(6, 'trabajo_extra', 'media', 16, 'depuracion', NULL, 'No_iniciada', NULL, NULL, NULL),
(7, 'Trabajo4', 'Alta', 10, 'Seguridad', 200, 'Pendiente_de_validacion', 'developer1', 'problema certificados', 'developer2 impiece Trabajo5'),
(8, 'Trabajo5', 'baja', 2, 'secciones html parte_1', 15, 'En_curso', NULL, NULL, NULL),
(9, 'Trabajo6', 'Alta', 15, 'cliente js', 30, 'En_curso', NULL, NULL, NULL),
(10, 'Trabajo7', 'baja', 3, 'plantilla css1 sencilla', 4, 'No_iniciada', NULL, NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `develop`
--
ALTER TABLE `develop`
  ADD KEY `FK_develop_team_member` (`Id_tm`),
  ADD KEY `FK_develop_sprint` (`Id_sprint`),
  ADD KEY `FK_develop_user_story` (`Id_us`);

--
-- Indices de la tabla `sprint`
--
ALTER TABLE `sprint`
  ADD PRIMARY KEY (`Id`);

--
-- Indices de la tabla `store`
--
ALTER TABLE `store`
  ADD KEY `FK_store_stored_user_story` (`Id_st`),
  ADD KEY `FK_store_user_story` (`Id_us`);

--
-- Indices de la tabla `stored_user_story`
--
ALTER TABLE `stored_user_story`
  ADD PRIMARY KEY (`Id_st`);

--
-- Indices de la tabla `team_member`
--
ALTER TABLE `team_member`
  ADD PRIMARY KEY (`Id`);

--
-- Indices de la tabla `user_story`
--
ALTER TABLE `user_story`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Nombre` (`Nombre`),
  ADD UNIQUE KEY `Nombre_2` (`Nombre`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `sprint`
--
ALTER TABLE `sprint`
  MODIFY `Id` int(50) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `team_member`
--
ALTER TABLE `team_member`
  MODIFY `Id` int(50) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `user_story`
--
ALTER TABLE `user_story`
  MODIFY `Id` int(50) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `develop`
--
ALTER TABLE `develop`
  ADD CONSTRAINT `FK_develop_sprint` FOREIGN KEY (`Id_sprint`) REFERENCES `sprint` (`Id`),
  ADD CONSTRAINT `FK_develop_team_member` FOREIGN KEY (`Id_tm`) REFERENCES `team_member` (`Id`),
  ADD CONSTRAINT `FK_develop_user_story` FOREIGN KEY (`Id_us`) REFERENCES `user_story` (`Id`);

--
-- Filtros para la tabla `store`
--
ALTER TABLE `store`
  ADD CONSTRAINT `FK_store_stored_user_story` FOREIGN KEY (`Id_st`) REFERENCES `stored_user_story` (`Id_st`),
  ADD CONSTRAINT `FK_store_user_story` FOREIGN KEY (`Id_us`) REFERENCES `user_story` (`Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
