-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 22-11-2024 a las 01:22:05
-- Versión del servidor: 5.7.44
-- Versión de PHP: 8.1.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


DELIMITER $$
--
-- Procedimientos
--
$$

$$

$$

$$

$$

$$

$$

$$

$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `articulo`
--

CREATE TABLE `articulo` (
  `id_articulo` int(11) NOT NULL,
  `nombre_articulo` varchar(255) NOT NULL,
  `stock` int(11) NOT NULL,
  `id_subgrupo_ropa` int(11) NOT NULL,
  `borrado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `articulo`
--

INSERT INTO `articulo` (`id_articulo`, `nombre_articulo`, `stock`, `id_subgrupo_ropa`, `borrado`) VALUES
(1, 'Camisa paciente', 92, 1, 1),
(2, 'cubre cama grande', 66, 1, 0),
(3, 'cubre cama chico', 94, 1, 0),
(4, 'Delantal verde', 84, 2, 0),
(5, 'Frazada grande', 91, 1, 0),
(6, 'frazada chica', 95, 1, 0),
(7, 'Pantalon verde', 90, 2, 0),
(8, 'Pantalon celeste', 82, 2, 0),
(9, 'Pechera verde', 95, 2, 0),
(10, 'Pechera Celeste', 102, 2, 0),
(11, 'Paño perforado', 40, 2, 0),
(12, 'Paño clinico', 92, 2, 0),
(13, 'Sabana', 94, 1, 0),
(14, 'Sabana clinica', 107, 2, 0),
(15, 'Sabana perforada', 106, 2, 0),
(16, 'Sabana cuna', 106, 1, 0),
(17, 'Toalla chica', 128, 3, 0),
(18, 'Toalla grande', 115, 3, 0),
(19, 'Sabanilla', 100, 3, 0),
(20, 'Contenciones', 110, 3, 0),
(21, 'Cortina', 115, 3, 0),
(22, 'Funda almohada', 117, 1, 0),
(23, 'Hule', 109, 3, 0),
(24, 'Crea', 116, 3, 0),
(25, 'Fajas', 110, 3, 0),
(26, 'Plumon', 114, 1, 0),
(27, 'Alforja', 114, 3, 0),
(28, 'Cubrecamilla', 104, 1, 0),
(29, 'Almohada', 100, 1, 0),
(30, 'Picaron', 102, 3, 0),
(31, 'Sabanilla Verde', 95, 2, 0),
(32, 'Guantes', 200, 1, 0),
(33, 'Mascarillas', 500, 2, 0),
(61, 'Manga ', 13, 2, 1),
(74, 'Cofia', 98, 1, 0),
(75, 'Delantal ', 10, 2, 1),
(76, '<h1>webeo</h1>', 55, 1, 1),
(77, 'Prueba', 90, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_registro`
--

CREATE TABLE `detalle_registro` (
  `id_detalle_registro` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `id_articulo` int(11) NOT NULL,
  `id_registro` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `detalle_registro`
--

INSERT INTO `detalle_registro` (`id_detalle_registro`, `cantidad`, `id_articulo`, `id_registro`) VALUES
(1, 3, 14, 1),
(2, 3, 5, 1),
(3, 3, 13, 1),
(4, 4, 13, 2),
(5, 4, 10, 2),
(6, 4, 13, 3),
(7, 4, 10, 3),
(8, 4, 14, 4),
(9, 3, 13, 5),
(10, 3, 8, 5),
(11, 1, 12, 6),
(12, 1, 18, 6),
(13, 2, 15, 7),
(14, 2, 6, 7),
(15, 2, 17, 8),
(16, 1, 15, 9),
(17, 7, 15, 10),
(18, 3, 12, 11),
(19, 3, 7, 11),
(20, 1, 6, 12),
(21, 1, 18, 13),
(22, 11, 14, 14),
(23, 20, 10, 15),
(24, 12, 6, 16),
(25, 3, 1, 17),
(26, 4, 15, 18),
(27, 1, 11, 19),
(28, 4, 12, 20),
(29, 12, 12, 21),
(30, 4, 9, 22),
(31, 10, 8, 23),
(32, 13, 7, 24),
(33, 13, 15, 25),
(34, 7, 13, 26),
(35, 3, 17, 26),
(36, 5, 21, 26),
(37, 4, 13, 27),
(38, 6, 8, 27),
(39, 10, 20, 27),
(51, 10, 19, 39),
(52, 10, 11, 39),
(53, 5, 8, 40),
(54, 5, 6, 40),
(55, 3, 12, 41);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `error_log`
--

CREATE TABLE `error_log` (
  `id_error` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `tipo_error` varchar(100) NOT NULL,
  `mensaje_error` longtext NOT NULL,
  `ruta_error` varchar(100) NOT NULL,
  `codigo_http` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `error_log`
--

INSERT INTO `error_log` (`id_error`, `id_usuario`, `tipo_error`, `mensaje_error`, `ruta_error`, `codigo_http`) VALUES
(1, 858, 'Error en ingreso de datos', 'Se intentó ingresar una cantidad de artículos que supera el stock disponible', 'laundry-manager/clothes/dar-ropa-de-baja', 400),
(2, NULL, 'Error de inicio de sesión', 'Contraseña incorrecta', 'laundry-manager/auth/login', 401),
(3, NULL, 'Error de inicio de sesión', 'Contraseña incorrecta', 'laundry-manager/auth/login', 401);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estamento`
--

CREATE TABLE `estamento` (
  `id_estamento` int(11) NOT NULL,
  `desc_estamento` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `estamento`
--

INSERT INTO `estamento` (`id_estamento`, `desc_estamento`) VALUES
(5, 'ADMINISTRATIVOS'),
(4, 'AUXILIARES'),
(8, 'DIRECTIVOS'),
(2, 'MEDICOS'),
(7, 'ODONTOLOGOS'),
(1, 'PROFESIONALES'),
(6, 'QUIMICOS'),
(3, 'TECNICOS');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registro`
--

CREATE TABLE `registro` (
  `id_registro` int(11) NOT NULL,
  `rut_usuario_1` int(11) NOT NULL,
  `rut_usuario_2` int(11) DEFAULT NULL,
  `id_unidad_sigcom` int(11) DEFAULT NULL,
  `cantidad_total` int(11) NOT NULL,
  `fecha` varchar(255) NOT NULL,
  `observacion` varchar(500) DEFAULT NULL,
  `id_tipo_registro` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `registro`
--

INSERT INTO `registro` (`id_registro`, `rut_usuario_1`, `rut_usuario_2`, `id_unidad_sigcom`, `cantidad_total`, `fecha`, `observacion`, `id_tipo_registro`) VALUES
(1, 1, 17683549, 5, 9, '2024-11-04 09:30:27 P. M.', NULL, 1),
(2, 1, NULL, 5, 8, '2024-11-04 10:16:53 P. M.', 'xdd', 7),
(3, 1, NULL, NULL, 8, '2024-11-04 10:17:18 P. M.', 'xdd', 8),
(4, 1, 17683549, 27, 4, '2024-11-04 10:18:59 P. M.', NULL, 1),
(5, 1, 17683549, 5, 6, '2024-11-04 10:20:41 P. M.', NULL, 1),
(6, 1, 17683549, 5, 2, '2024-11-04 10:22:17 P. M.', NULL, 1),
(7, 1, NULL, 5, 4, '2024-11-04 10:28:38 P. M.', 'xddddd', 6),
(8, 1, NULL, NULL, 2, '2024-11-04 10:29:15 P. M.', 'bdfbfdbvbcv', 5),
(9, 1, NULL, NULL, 1, '2024-11-04 10:35:11 P. M.', NULL, 4),
(10, 1, 16291503, 6, 7, '2024-11-04 10:38:31 P. M.', NULL, 2),
(11, 1, NULL, NULL, 6, '2024-11-04 10:43:57 P. M.', NULL, 3),
(12, 1, NULL, NULL, 1, '2024-11-13 10:54:54 A. M.', NULL, 3),
(13, 1, NULL, NULL, 1, '2024-11-13 10:55:58 A. M.', NULL, 3),
(14, 1, 18868953, 3, 11, '2024-11-13 11:04:43 A. M.', NULL, 1),
(15, 1, NULL, NULL, 20, '2024-11-13 11:06:23 A. M.', NULL, 4),
(16, 1, 13042242, 26, 12, '2024-11-13 11:06:58 A. M.', NULL, 2),
(17, 1, NULL, 5, 3, '2024-11-13 11:07:20 A. M.', NULL, 6),
(18, 1, NULL, 17, 4, '2024-11-13 11:16:05 A. M.', 'mal estado', 7),
(19, 1, NULL, 5, 1, '2024-11-13 11:21:24 A. M.', NULL, 7),
(20, 1, NULL, 22, 4, '2024-11-13 11:21:52 A. M.', 'Articulo dado de baja por estar en malas condiciones ', 7),
(21, 1, 11709501, 7, 12, '2024-11-13 11:23:24 A. M.', NULL, 1),
(22, 26575917, NULL, NULL, 4, '2024-11-13 11:32:56 A. M.', NULL, 3),
(23, 26575917, 18990309, 16, 10, '2024-11-13 11:33:14 A. M.', NULL, 2),
(24, 1, 18378081, 9, 13, '2024-11-13 02:45:46 P. M.', NULL, 2),
(25, 1, 18990309, 3, 13, '2024-11-13 02:48:29 P. M.', NULL, 1),
(26, 1, 17683549, 5, 15, '2024-11-17 05:09:33 P. M.', NULL, 1),
(27, 1, 17683549, 5, 20, '2024-11-17 05:13:06 P. M.', NULL, 1),
(39, 1, NULL, 19, 20, '2024-11-18 03:54:42 P. M.', 'test', 7),
(40, 1, NULL, 12, 10, '2024-11-18 05:09:49 P. M.', 'test dashboard', 6),
(41, 1, NULL, 5, 3, '2024-11-18 06:51:31 P. M.', 'test dashboard', 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicio`
--

CREATE TABLE `servicio` (
  `id_servicio` int(11) NOT NULL,
  `desc_servicio` varchar(255) NOT NULL,
  `habilitado` tinyint(1) NOT NULL,
  `id_unidad_sigcom` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `servicio`
--

INSERT INTO `servicio` (`id_servicio`, `desc_servicio`, `habilitado`, `id_unidad_sigcom`) VALUES
(1, 'PENSIONADO', 1, 1),
(2, 'SUBDIRECCION MEDICA', 1, 5),
(3, 'U. PABELLON QUIRURGICO', 1, 3),
(4, 'SERV. GENERALES', 1, 4),
(5, 'UNIDAD PROCESO PREQUIRURGICO', 1, 5),
(6, 'U. PABELLON GENERAL', 1, 3),
(7, 'SERV.CL.OBST.GINECO', 1, 6),
(8, 'APOYO EMERGENCIA', 1, 7),
(9, 'CUIDADOS PALIATIVOS', 1, 8),
(10, 'SECCION REGISTRO PERSONAL', 1, 5),
(11, 'SERVICIO MEDICINA', 1, 9),
(12, 'U. URGENCIA PEDIATRICA', 1, 10),
(13, 'POSTAS RURALES', 1, 5),
(14, 'ALIMENTACION', 1, 11),
(15, 'ESTERILIZACION', 1, 12),
(16, 'HOSPITALIZACION DOMICILIARIA', 1, 22),
(17, 'U. URGENCIA ADULTOS', 1, 7),
(18, 'BODEGA FARMACIA', 1, 5),
(19, 'SERV.CL.CIRUGIA', 1, 15),
(20, 'SEDILE', 1, 11),
(21, 'FARMACIA', 1, 14),
(22, 'SERV.CL.PEDIATRIA', 1, 16),
(23, 'UNIDAD DE FORMACION', 1, 5),
(24, 'UNIDAD SALUD MENTAL', 1, 34),
(25, 'CONSULTORIOS', 1, 2),
(26, 'CIRUGIA AMBULATORIA', 1, 18),
(27, 'POLICLINICO GINECOLOGIA', 1, 19),
(28, 'SERV.CL.TRAUMAYORTOP.ADULT', 1, 15),
(29, 'IMAGENOLOGIA', 1, 20),
(30, 'DEPARTAMENTO DE FINANZAS', 1, 5),
(31, 'U. GESTION DE PACIENTES', 1, 5),
(32, 'UTI', 1, 21),
(33, 'DENTAL', 1, 22),
(34, 'DIRECCION HOSPITAL', 1, 5),
(35, 'APOYO LAB.CL.Y B.SANGRE', 1, 23),
(36, 'PRAIS', 1, 2),
(37, 'UNIDAD DE BIENESTAR', 1, 5),
(38, 'UPC (U. PACIENTES CRITICOS)', 1, 24),
(39, 'KINESIOLOGIA', 1, 25),
(40, 'U. URGENCIA GINECO-OBSTETRICA', 1, 26),
(41, 'ARCHIVO', 1, 5),
(42, 'DAIS (DEPTO ADM. E INF. DE S.)', 1, 5),
(43, 'ABASTECIMIENTO', 1, 5),
(44, 'OIRS', 1, 5),
(45, 'DEPTO. GESTION GES', 1, 5),
(46, 'RECAUDACION', 1, 5),
(47, 'RRPP Y COMUNICACIONES', 1, 5),
(48, 'ESTADISTICA', 1, 5),
(49, 'DEPARTAMENTO DE AUDITORIA', 1, 5),
(50, 'MEDICINA', 1, 30),
(51, 'JARDIN INFANTIL', 1, 2),
(52, 'UNIDAD INFORMATICA', 1, 5),
(53, 'SIGGES', 1, 5),
(54, 'DEPTO. ESTADISTICA', 1, 5),
(55, 'LABORATORIO', 1, 23),
(56, 'SECCION CONTABILIDAD', 1, 5),
(57, 'CALIDAD Y SEGURIDAD DEL PACIEN', 1, 5),
(58, 'ADMISION (RECEPCION)', 1, 5),
(59, 'SERV. CL. NEONATOLOGIA', 1, 27),
(60, 'BODEGA ECONOMATO', 1, 5),
(61, 'LISTA DE ESPERA', 1, 5),
(62, 'DEPTO.GESTION CLINICA FINANCIERA GRD', 1, 5),
(63, 'DEPARTAMENTO GES', 1, 5),
(64, 'SUB ATENCION AMBULATORIA', 1, 5),
(65, 'DEPARTAMENTO JURIDICO', 1, 5),
(66, 'PLANIFICACION Y CONTROL DE GESTION', 1, 5),
(67, 'SUBDIRECCION DE ENFERMERIA', 1, 5),
(68, 'SUBDIRECCION DE MATRONERIA', 1, 5),
(69, 'DEPARTAMENTO DE CAPACITACION', 1, 5),
(70, 'CALIDAD DE VIDA LABORAL', 1, 5),
(71, 'OFICINA DE PARTES', 1, 5),
(72, 'SELECCION Y DESARROLLO ORGANIZACIONAL', 1, 5),
(73, 'U. DE SALUD OCUPACIONAL Y GEST. AMBIENT.', 1, 5),
(74, 'PEDIATRIA', 1, 48),
(75, 'SUB. GESTION DESARROLLO DE LAS PERSONAS', 1, 5),
(76, 'UNID.INF.ASOC. A LA ATENC. DE SALUD IAAS', 1, 5),
(77, 'SUBDIRECC. ADMINISTRATIVA', 1, 5),
(78, 'SUBDIRECCION DE APOYO CLINICO', 1, 5),
(79, 'GESTION DE LA DEMANDA ASISTENCIAL', 1, 5),
(80, 'SUBDIRECCION DE ANALISIS INFORM GEST', 1, 5),
(81, 'SUBDIRECCION GESTION DEL CUIDADO', 1, 5),
(82, 'DEPTO. RECURSOS HUMANOS', 1, 5),
(83, 'SERV.CL.MEDIC.INTERNA', 1, 9),
(84, 'SERV. CL. GINECOLOGIA', 1, 6),
(85, 'SERV.DENTAL', 1, 22),
(86, 'APOYO CONS.ADOSADO ESPEC.', 1, 2),
(87, 'SUBDIRECCION MEDICA ATENCION CERRADA', 1, 5),
(88, 'SUBDIRECCION MEDICA ATENCION ABIERTA', 1, 5),
(89, 'SERVICIO SOCIAL', 1, 62),
(90, 'SERV. OBST. GINECOLOGIA', 1, 6),
(91, 'U. DE PLANIFICACION', 1, 5),
(92, 'GESTION DEL CUIDADO ENFERMERIA', 1, 5),
(93, 'CENTRO DE RESPONSABILIDAD AT. ABIERTA', 1, 5),
(94, 'GESTION DE CAMAS', 1, 5),
(95, 'UNIDAD DE URGENCIA ADULTO', 1, 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subgrupo_ropa`
--

CREATE TABLE `subgrupo_ropa` (
  `id_subgrupo_ropa` int(11) NOT NULL,
  `desc_subgrupo` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `subgrupo_ropa`
--

INSERT INTO `subgrupo_ropa` (`id_subgrupo_ropa`, `desc_subgrupo`) VALUES
(3, 'Otro'),
(1, 'Ropa cama'),
(2, 'Ropa pabellon');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_contrato`
--

CREATE TABLE `tipo_contrato` (
  `id_tipo_contrato` int(11) NOT NULL,
  `tipo_contrato` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tipo_contrato`
--

INSERT INTO `tipo_contrato` (`id_tipo_contrato`, `tipo_contrato`) VALUES
(2, 'CONTRATADOS'),
(4, 'ETAPA DESTINACIÓN Y FORMACIÓN'),
(1, 'SUPLENTE'),
(3, 'TITULARES');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_registro`
--

CREATE TABLE `tipo_registro` (
  `id_tipo_registro` int(11) NOT NULL,
  `tipo_registro` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `tipo_registro`
--

INSERT INTO `tipo_registro` (`id_tipo_registro`, `tipo_registro`) VALUES
(1, 'Ropa limpia a servicio'),
(2, 'Ropa sucia a ropería'),
(3, 'Ropa sucia a lavandería externa'),
(4, 'Ropa limpia a ropería'),
(5, 'Pérdida externa'),
(6, 'Pérdida interna'),
(7, 'Dada de baja servicio'),
(8, 'Dada de baja ropería');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_usuario`
--

CREATE TABLE `tipo_usuario` (
  `id_tipo_usuario` int(11) NOT NULL,
  `tipo_usuario` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tipo_usuario`
--

INSERT INTO `tipo_usuario` (`id_tipo_usuario`, `tipo_usuario`) VALUES
(1, 'Admin'),
(2, 'Encargado ropa limpia'),
(3, 'Encargado ropa sucia'),
(4, 'Por defecto');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `unidad_sigcom`
--

CREATE TABLE `unidad_sigcom` (
  `id_unidad_sigcom` int(11) NOT NULL,
  `unidad_sigcom` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `unidad_sigcom`
--

INSERT INTO `unidad_sigcom` (`id_unidad_sigcom`, `unidad_sigcom`) VALUES
(5, 'ADMINISTRACIÓN'),
(60, 'AMBULANCIA'),
(12, 'CENTRAL DE ESTERILIZACIÓN'),
(54, 'CENTRO DE COSTOS EXTERNO'),
(39, 'CONSULTA ANESTESIOLOGIA'),
(33, 'CONSULTA CARDIOLOGÍA'),
(41, 'CONSULTA CIRUGÍA GENERAL'),
(46, 'CONSULTA CIRUGÍA MAXILOFACIAL'),
(49, 'CONSULTA CIRUGÍA PEDIÁTRICA'),
(45, 'CONSULTA CIRUGÍA PROCTOLOGÍA'),
(47, 'CONSULTA DE TRAUMATOLOGÍA'),
(37, 'CONSULTA GASTROENTEROLOGÍA'),
(19, 'CONSULTA GINECOLOGICA'),
(30, 'CONSULTA MEDICINA INTERNA'),
(36, 'CONSULTA NEFROLOGÍA'),
(35, 'CONSULTA NEUMOLOGÍA'),
(31, 'CONSULTA NEUROLOGÍA'),
(52, 'CONSULTA NUTRICIÓN'),
(50, 'CONSULTA OBSTETRICIA'),
(22, 'CONSULTA ODONTOLOGÍA'),
(43, 'CONSULTA OFTALMOLOGÍA'),
(44, 'CONSULTA OTORRINOLARINGOLOGÍA'),
(17, 'CONSULTA OTROS PROFESIONALES'),
(48, 'CONSULTA PEDIATRÍA GENERAL'),
(34, 'CONSULTA PSIQUIATRÍA'),
(32, 'CONSULTA REUMATOLOGÍA'),
(38, 'CONSULTA SALUD OCUPACIONAL'),
(42, 'CONSULTA UROLOGÍA'),
(2, 'DESCONOCIDA'),
(7, 'EMERGENCIAS ADULTO'),
(26, 'EMERGENCIAS GINECO OBSTÉTRICAS'),
(29, 'EMERGENCIAS ODONTOLOGICAS'),
(10, 'EMERGENCIAS PEDIÁTRICAS'),
(59, 'HEMODIÁLISIS AGUDA'),
(13, 'HOSPITALIZACIÓN EN CASA'),
(28, 'HOSPITALIZACIÓN GINECOLOGÍA'),
(9, 'HOSPITALIZACIÓN MEDICINA INTERNA'),
(27, 'HOSPITALIZACIÓN NEONATOLOGÍA'),
(6, 'HOSPITALIZACIÓN OBSTETRICIA'),
(16, 'HOSPITALIZACIÓN PEDIATRÍA'),
(1, 'HOSPITALIZACIÓN PENSIONADOS'),
(15, 'HOSPITALIZACIÓN QUIRÚRGICA'),
(20, 'IMAGENOLOGÍA'),
(23, 'LABORATORIO CLÍNICO'),
(61, 'LAVANDERIA Y ROPERIA'),
(4, 'MANTENIMIENTO'),
(3, 'PABELLON'),
(55, 'PROCEDIMIENTO'),
(40, 'PROGRAMA ENFERMEDADES DE TRANSMISIÓN SEXUAL'),
(8, 'PROGRAMA MANEJO DEL DOLOR'),
(51, 'QUIRÓFANO AMBULATORIO DE EMERGENCIA'),
(18, 'QUIRÓFANOS MAYOR AMBULATORIA'),
(56, 'QUIRÓFANOS MENOR AMBULATORIA'),
(25, 'REHABILITACIÓN'),
(57, 'SALAS DE PARTO'),
(11, 'SERVICIO DE ALIMENTACIÓN'),
(14, 'SERVICIO FARMACEUTICO'),
(53, 'TELEMEDICINA'),
(58, 'TOMA DE MUESTRA'),
(62, 'TRABAJO SOCIAL'),
(24, 'UCI'),
(21, 'UTI');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `rut_usuario` int(11) NOT NULL,
  `dv_usuario` varchar(1) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `id_servicio` int(11) NOT NULL,
  `id_tipo_contrato` int(11) NOT NULL,
  `id_estamento` int(11) NOT NULL,
  `id_tipo_usuario` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `pwd` varchar(255) NOT NULL,
  `borrado` tinyint(1) NOT NULL,
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `rut_usuario`, `dv_usuario`, `nombre`, `id_servicio`, `id_tipo_contrato`, `id_estamento`, `id_tipo_usuario`, `username`, `pwd`, `borrado`, `email`) VALUES
(1, 17683549, '4', 'ABARCA JEREZ TAMARA PAZ', 1, 1, 1, 2, 't.abarca.4', '$2b$10$4BOkJxTjJVsvhFk9TVEWoeNYGS6rWWO.ZqX.NauVY9JmSu923.Mvi', 0, 'enfermera@hospital.cl'),
(2, 26575917, '3', 'ABREU MARTINEZ TISBETH DE LOS ANGELES', 2, 2, 2, 3, 't.abreu.3', '$2b$10$xyh/BJJvZlysumxU3Q.vxu6mx3QO.rqM4folomD0N.3Oago0u6xIi', 0, 'medico@hospital.cl'),
(3, 16291503, '7', 'ACEVEDO AMPUERO ELIZABETH IVONE', 3, 3, 3, 4, 'e.acevedo.7', '$2b$10$bhvEDqm6M35KV9h6Vs8MaOR5pz2ukpP9EX2Izp5kgOEm3Kx7ujQcG', 0, NULL),
(4, 8105654, '4', 'ACEVEDO MUÑOZ PEDRO LUIS', 4, 3, 4, 4, 'p.acevedo.4', '$2b$10$Aj54e70CaOMuZo..aFnyuOjEy2A1i6imSs/ehsxcL3uKuGhs/f97W', 0, NULL),
(5, 16855084, '7', 'ACEVEDO VILLEGAS VIVIANA CAROLINA', 5, 3, 1, 4, 'v.acevedo.7', '$2b$10$9KHor5jZQ8px4dawF3vr9O4ve2KMw7CKrjorAM7NK87o.IYn87j/G', 0, NULL),
(6, 9278952, '7', 'ADASME SILVA RICARDO', 4, 3, 4, 4, 'r.adasme.7', '$2b$10$5GjdxjPgtjFnPZ38jR41Pup56mGpI6eQAdXr/w8I66G5yPtR/vnQ2', 0, NULL),
(7, 6376228, '8', 'AEDO ERRAZURIZ CECILIA CARMEN', 6, 3, 2, 4, 'c.aedo.8', '$2b$10$WdjvUgsN/hX8oLD9XDIMkOUEV44A5fHJtHpM5oXmtqbjNZkNrkJxW', 0, NULL),
(8, 11709501, '0', 'AGUILA ULLOA NANCY INES', 7, 3, 1, 4, 'n.aguila.0', '$2b$10$93hZyvEaFwRfxeiQBsS5D.zrtI6E/9BdrcawRcJhx5I/f.5RqpQ32', 0, NULL),
(9, 13042242, 'K', 'AGUILAR PARIS GIOVANNI PATRICIO', 8, 2, 1, 4, 'g.aguilar.k', '$2b$10$7WdpEt6sKd6XlfdR2f4JbOMR0v.DvwXrTXAtjxfk14iNjxYqPWm/m', 0, NULL),
(10, 15404943, '6', 'AGUILAR PLAZA ALEJANDRA DE LOS ANGELES', 9, 2, 3, 4, 'a.aguilar.6', '$2b$10$9ukhy82aokgXeEvNnfq.e.hmDwRuDOcmbMmcjd2OPkLzDScnZzanu', 0, NULL),
(11, 18868953, '1', 'AGUILAR REYES SEBASTIAN IGNACIO', 10, 2, 1, 4, 's.aguilar.1', '$2b$10$glDRa9mZgWDx.r9CD0jWl.WX3DGKrJMD6Uwtpq/WBG.BgQbX4ZQna', 0, NULL),
(12, 18990309, 'K', 'AGUILAR SANTOS JOSHUA ANDRES', 11, 1, 1, 4, 'j.aguilar.k', '$2b$10$TS8av/IYCWu.z/wpPwr5jezLKjYD3V.yQ7k.wBFfeHjd.BKUv7LfO', 0, NULL),
(13, 26268636, '1', 'AGUILERA HUMPHREY CRYSTEL JESSENIA', 12, 2, 2, 4, 'c.aguilera.1', '$2b$10$j6Lmx9RbOUJeVPDGqostueOaDuu.9rieXzIdZgWF8xwV2REDpEtde', 0, NULL),
(14, 18378081, '6', 'AGUILERA LECAROS FRANCISCA LILIANA', 13, 4, 2, 4, 'f.aguilera.6', '$2b$10$1EXKfnT8MlIFtzqIgA.TAOacibnTon9sKqmymLhtegct9ttT9tFs2', 0, NULL),
(15, 17109848, '3', 'AGUILERA REINANTE YASNA MACARENA', 14, 2, 3, 4, 'y.aguilera.3', '$2b$10$tnG78UlnmIkk32j9SD9OS.bMqy4R4oQ1pE9uJYGwm0g1u/xLcwX46', 0, NULL),
(16, 18486933, '0', 'ALARCON ARAYA MARTA JESUS', 15, 1, 3, 4, 'm.alarcon.0', '$2b$10$fmq0uXTyeM1vBn41s43Bd.Cqw4MxOUf8EAv.nNceRXOrzyX7DnEou', 0, NULL),
(17, 15426347, '0', 'ALARCON ARRATIA MARIA DE LOS ANGELES', 16, 2, 1, 4, 'ma.alarcon.0', '$2b$10$LovDkTdA7ZjAfPgc.iXPw.BEmd1vPzd7sL6EIWjVaDWOBj5vRca76', 0, NULL),
(18, 12512305, '8', 'ALARCON PINO JOAN JOSE', 7, 3, 1, 4, 'j.alarcon.8', '$2b$10$oJRwjkiCOUvx5afGTxOag.LZJc6vJ7v4SsiOg6vDadK3Jychaynue', 0, NULL),
(19, 17398887, '7', 'ALBERTI SILVA DIEGO ALFONSO', 7, 3, 3, 4, 'd.alberti.7', '$2b$10$5R/rXkCGifr5omrlCn2LrumH8W4icDZlW9p/wqytHGAuCWzu6ypJK', 0, NULL),
(20, 19208907, '7', 'ALBORNOZ HERMOSILLA NATALIA VALENTINA', 13, 4, 2, 4, 'n.albornoz.7', '$2b$10$PsqTNcgAu9nY9vSvA7iZBu6WOGhwt4bWDDIeuFb./.Rl1h7QIMEWa', 0, NULL),
(21, 25993352, '8', 'ALBORNOZ VELASCO FRANCISCO JAVIER', 17, 2, 2, 4, 'f.albornoz.8', '$2b$10$17vGTTNjQPadENUmiUUzP.y.EDqu4mTSZ67xGwoDKOds0jFga4NLi', 0, NULL),
(22, 9697105, '2', 'ALLENDE RODRIGUEZ VERONICA DEL CARMEN', 4, 1, 4, 4, 'v.allende.2', '$2b$10$vupzoBluCBs84Pw3twabKu0frGgNlFJYe7t5rPU7umYj2kDXU956.', 0, NULL),
(23, 9634601, '8', 'ALLENDE TORO ANA DEL CARMEN', 18, 3, 3, 4, 'a.allende.8', '$2b$10$MnyH2q1u/imr6jIrlh2spOdzAqeMiwWM8NnfxCkupHazJWxu6f1ca', 0, NULL),
(24, 13681361, '7', 'ALLENDES FILIPPI ELIZABETH FABIOLA', 16, 2, 1, 4, 'e.allendes.7', '$2b$10$XQwmwJmfqDujBkUyJl1SOOjSX76aZteHy/NkZcURiiwWKtXunDJ0O', 0, NULL),
(25, 18213059, '1', 'ALMARZA ESQUIVEL ANDREA DEL PILAR', 19, 2, 1, 4, 'a.almarza.1', '$2b$10$bgZ9Ax.D2w35SIpxD7zFvep6H6jWRUl5wYn3tfCOGNPxz3C4tNSma', 0, NULL),
(26, 18488567, '0', 'ALMARZA SANTIS MARIA JOSE', 20, 2, 3, 4, 'm.almarza.0', '$2b$10$egtr5GPT/tpnwhbRKMIqGOM6tZAX6tIHyHL9UZgULNiPquSypwAKa', 0, NULL),
(27, 15403947, '3', 'ALVARADO VILCHES ROSARIO DEL PILAR', 21, 2, 3, 4, 'r.alvarado.3', '$2b$10$usr4mT9v8dxuuDEzFVEGfuYiTxlgDaCx6Iyr6ZmtKF4PpXAMQ0MSq', 0, NULL),
(28, 18213730, '8', 'ALVAREZ ARAYA ANA KAREN', 22, 2, 1, 4, 'a.alvarez.8', '$2b$10$Jzh0p2pAD2/OoYrGG0X80.dUrbA.x6RfPRIT.KzqywRnv.nbwDfQu', 0, NULL),
(29, 16410517, '2', 'ALVAREZ BARRERA MAXS ELIAS', 17, 2, 2, 4, 'm.alvarez.2', '$2b$10$P/fo5HSkcHyd1WMDXbCWvO7SmX71AyK31PdHrH88NhpcVY1y5tORy', 0, NULL),
(30, 14131303, '7', 'ALVAREZ DE ARAYA CARDENAS FERNANDO', 24, 3, 1, 4, 'a.alvarez.7', '$2b$10$OGgCY0N0wuo./Uau758ebucO.lGup53dbXjgVBKabot5ekA9sgqbK', 0, NULL),
(31, 17834918, 'K', 'ALVAREZ DROGUETT TAHIA TAMARA', 25, 2, 2, 4, 't.alvarez.k', '$2b$10$o4iJckin1jwYNiTFOMUu/.4FGrWOqIi2H1QkInQ3RALg.P9dx/a0u', 0, NULL),
(32, 15403854, 'K', 'ALVAREZ IRRAZABAL ROMINA ANDREA', 26, 3, 3, 4, 'r.alvarez.k', '$2b$10$zfDB2wqEJcj5J1FjcGc1cuuFjP8ijZfVOtJCs0MRzNoRaApnEt3H.', 0, NULL),
(33, 18777755, '0', 'ALVAREZ PINTO CONSTANZA CATALINA', 27, 1, 1, 4, 'c.alvarez.0', '$2b$10$ZkdoQ8q9KEw0GQLi8gfqcO/Iq0dsctt6aIw/Tu6z9VfnYNanXOdLu', 0, NULL),
(34, 18778525, '1', 'ALVAREZ RIQUELME FRANCISCA SALOME', 19, 2, 1, 4, 'f.alvarez.1', '$2b$10$XCGQgcfsjdxnAw7qKXbBKu1E46Eav.rxIrwQoTIYkp0wF/xWNaHM2', 0, NULL),
(35, 16944929, '5', 'ALVAREZ ROJAS FERNANDA BELEN', 28, 2, 2, 4, 'f.alvarez.5', '$2b$10$79btyGXAFBcGJb/Heyb1M.kvQjPqVCWYcguieImlamICT2.AJTSHi', 0, NULL),
(36, 15405183, 'K', 'ALVAREZ TAPIA JOHANA ROMINA', 29, 2, 5, 4, 'j.alvarez.k', '$2b$10$1Cwz6mMtDPic77bycAG.y.Fl7a6zML1eYWQEkrz49JTamDJEccvji', 0, NULL),
(37, 17615735, '6', 'ALVAREZ VIDAL CATHERINE ANDREA', 13, 4, 2, 4, 'c.alvarez.6', '$2b$10$p2whGXXH2rwH/nmyYeX39OQywCyOfy7K8pIS7YJzA6qN6t/pWG9Qe', 0, NULL),
(38, 10572416, '0', 'AMPUERO HINOJOSA PEDRO JUAN', 8, 3, 3, 4, 'p.ampuero.0', '$2b$10$w8J3w0YIm4s7IH91srIovu/fajdMS66w/7QhETt19yArXBInHc7ES', 0, NULL),
(39, 11608874, '6', 'ANDRADE GALLEGUILLOS TERESA PAOLA', 14, 3, 4, 4, 't.andrade.6', '$2b$10$RlsinYO0ZPHS5/Pl7ghJkeKSTlhCRF/N8VSqAVhoMnFas6yyPZyxK', 0, NULL),
(40, 18046732, '7', 'AÑAZCO VARGAS YOHANNA IVETTE', 29, 2, 1, 4, 'y.añazco.7', '$2b$10$hHUy/d5tU.L.x.45IjvE/.22lFU9li54OxlDsgtDaPM8q5Gb0WpAO', 0, NULL),
(41, 17397678, 'K', 'ARANCIBIA ASTUDILLO CATALINA FERNANDA', 30, 2, 5, 4, 'c.arancibia.k', '$2b$10$qL.JoO/qn1uT1EgUXAX9t.VhLhjK0nxj98YmPrBZEx3XeIVXNsPSK', 0, NULL),
(42, 17399101, '0', 'ARANDA OLAVE DOMINIQUE CAROLINA', 3, 2, 3, 4, 'd.aranda.0', '$2b$10$x3urE7R94XuFgfOBBp5Tqe/FKacMSdK2EFz5LGniQVZD3p4f6vYIq', 0, NULL),
(43, 16291566, '5', 'ARANEDA MIRANDA VALESKA PILAR', 31, 3, 1, 4, 'v.araneda.5', '$2b$10$zGdhXell3S5592Z2wPb1S.Xja/GlpcJ84MSgx3W/6QIy1bmfeTBwi', 0, NULL),
(44, 20603914, '0', 'ARANEDA QUINTANILLA KARLA ANAÍS', 1, 2, 3, 4, 'k.araneda.0', '$2b$10$AXcCaxoNKDTSh60/IzM0GeApfpiKuH3UDlBLXVK7XorNM2Im7XDde', 0, NULL),
(45, 17397699, '2', 'ARAOS ALVAREZ MARIA FRANCISCA', 19, 2, 1, 4, 'm.araos.2', '$2b$10$JyuqErBhZSmxY35zyKIwc.eUbXaceKxRON.LyJhRTOWxfuyyp5wNq', 0, NULL),
(46, 10179897, '6', 'ARAOS ARMIJO SANDRA MARIA', 15, 3, 3, 4, 's.araos.6', '$2b$10$5KGgAGrJ5IEs0McdjjP9pedOYd/gM9vZJvAmtjxjh7a36IG.2.eNq', 0, NULL),
(47, 19069644, '8', 'ARAOS MANZO PAMELA ANTONIA', 32, 2, 1, 4, 'p.araos.8', '$2b$10$T55VBjBDfqsuxtjw2nEoaeaPXIDlJCPukXqMzSZB7oRcaR/lI1CCS', 0, NULL),
(48, 16197771, '3', 'ARAUS FLORES CARLOS GONZALO', 33, 2, 3, 4, 'c.araus.3', '$2b$10$L2u/ATLD1LTEwpjufg0Pre6mXUhe6UFE2t3ftlYIznn0bj72qnc4C', 0, NULL),
(49, 16685926, '3', 'ARAUS FLORES GISELLA ALEJANDRA', 24, 1, 3, 4, 'g.araus.3', '$2b$10$Rk5IM4ARYjYIZqzh2WV77eSc3LZF3q0lvbT/F9ZIw8YvWaMaNtqwO', 0, NULL),
(50, 15920588, '6', 'ARAVENA ARELLANO ALEX FABIAN', 25, 2, 2, 4, 'a.aravena.6', '$2b$10$3f5HZ6HZT/DjVreqVVQ/MujU3OTBlvLvp21Emuz/v9ibFDhkb9uPS', 0, NULL),
(51, 11696685, '9', 'ARAVENA BELTRAN GABRIELA FELICIA', 25, 3, 3, 4, 'g.aravena.9', '$2b$10$i9w.1xCI86ZVak1F0YGcYeM/63PXZ4E6kHemBi9IuV8aRKdK2q0wa', 0, NULL),
(52, 12584653, 'K', 'ARAVENA LAPIERRE JESSICA PAOLA DEL CARMEN', 19, 2, 3, 4, 'j.aravena.k', '$2b$10$zy7BlBetVaKzhv4MvWZRgeD0c4R3SxjMGAd6DknrPY81ztaV9RZ3C', 0, NULL),
(53, 17682441, '7', 'ARAVENA REYES MARISOL DE LOS ANGELES', 34, 2, 5, 4, 'm.aravena.7', '$2b$10$x9T2ElAYbhmoPEkC/E88M.oeLj8ROnKzxhgCqfrRHNAmgfHP/xIOe', 0, NULL),
(54, 15430128, '3', 'ARAVENA VENEGAS JORGE JUAN', 21, 2, 6, 4, 'j.aravena.3', '$2b$10$VmWAVLfc3e1v22HLRisDPOzHYC.KYc9CVf9ken2fXvn4K8lEmcwrm', 0, NULL),
(55, 18337961, '5', 'ARAYA ARAYA MACARENA TAMARA', 15, 2, 3, 4, 'm.araya.5', '$2b$10$1jx7eNzgh3r5h3C8xuVZsOJ3P0pVg0Q48B3lYqxc/hx2VPEGm/Qe.', 0, NULL),
(56, 18411208, '6', 'ARAYA DIAZ VALENTINA ANDREA', 4, 1, 1, 4, 'v.araya.6', '$2b$10$EKo/HujwDBoTGPihbep/b.2z3Lm4wLFonJ/HybF26EywoakVOsOh2', 0, NULL),
(57, 14612930, '7', 'ARAYA MAZU PIA MACARENA', 33, 2, 7, 4, 'p.araya.7', '$2b$10$bO8WJTIL4uRxE1O4lJcfyummxTvf9aUw.fsfQyyUdxJiafQsBdNaC', 0, NULL),
(58, 17986973, 'K', 'ARAYA PLAZA TABATA VERENA', 7, 2, 1, 4, 't.araya.k', '$2b$10$1O5e78bIKVB9dTgABVoN1.NhWdxkgXUtNP0jeFRSYIFoQLzpRuTJq', 0, NULL),
(59, 17397964, '9', 'ARAYA SANTANA KARLA MARICEL', 31, 2, 1, 4, 'k.araya.9', '$2b$10$z28.7GqVPEyOecPlgRqcEeaXNRImzHHJ.bFSyGwI0K8hcJWw0qPCu', 0, NULL),
(60, 10823462, '8', 'ARAYA SILVA JUANA ABELINA', 7, 3, 5, 4, 'j.araya.8', '$2b$10$ewbUrwMd1JZB8nfFKy88NORy/CDanvtX/NVOxOHZcnDphAEaurg.q', 0, NULL),
(61, 19503067, '7', 'ARCE ALVAREZ FERNANDO IGNACIO', 35, 2, 1, 4, 'f.arce.7', '$2b$10$zAei2JAZ0VR2IYKp25Gsyur0z8rQJnO4/vpOivNph2Nyimo56HxnO', 0, NULL),
(62, 17684198, '2', 'ARCE MENA CAMILA JAVIERA', 36, 2, 5, 4, 'c.arce.2', '$2b$10$y6Rk/3Od8ZlUaRW6aFHTn.0jLZMXrR5pLJ/9spB.LMnDjBi.u3SZq', 0, NULL),
(63, 17905800, '6', 'ARCE ROMANINI CATTERINA FRANCESCA', 1, 2, 3, 4, 'c.arce.6', '$2b$10$9FsrBh.BhwKdDZ6a6JcSmOSOJXvry6AGzz7w4a55aHaK/AaTt0F0.', 0, NULL),
(64, 17082155, '6', 'ARCOS SEGURA MARIA KARINA', 33, 2, 7, 4, 'm.arcos.6', '$2b$10$iPrvT2pSwgOHje9WdONW2.cK1grNQqXYaQmCby7GVMG2CSA8pMCzm', 0, NULL),
(65, 17987037, '1', 'ARENAS CARVAJAL FRANCISCA SOLANGE', 25, 1, 1, 4, 'f.arenas.1', '$2b$10$bnB0EzBhs3dzkLemZsj5FOe874FI6CEuIxTAIB7qjcGTLplxUOWDu', 0, NULL),
(66, 20521255, '8', 'ARIAS VALENZUELA MAGDALENA BELEN', 25, 2, 3, 4, 'm.arias.8', '$2b$10$jFuCZMiqd2oHlUkTFS3abu0alLsEjPcnDCuXUT.sgUJu5rw2tYVTa', 0, NULL),
(67, 17682617, '7', 'ARMIJO ARAYA CONNY CAROLINA', 3, 2, 1, 4, 'c.armijo.7', '$2b$10$aZdH/3hVfwZ3a6G5sxHCeuvPQyie37KpVifIJSdxCVS32mzXnLVnS', 0, NULL),
(68, 11231372, '9', 'ARMIJO GONZALEZ CECILIA DEL CARMEN', 7, 3, 3, 4, 'c.armijo.9', '$2b$10$4ldDgkLXwo6wTut8mtbDsui2aNjyZd97v2ucoSPO0jx2A/VcDpOXO', 0, NULL),
(69, 17682987, '7', 'ARMIJO MAUREIRA MARGARITA ANDREA', 7, 2, 3, 4, 'm.armijo.7', '$2b$10$YBi4hPTFxXvbQIYCG2K6w.LP69PiclvQBRTy21W2f2aKpzTGLdjVu', 0, NULL),
(70, 15866813, '0', 'ARMIJO OROZCO EDUARDO ANTONIO', 8, 2, 4, 4, 'e.armijo.0', '$2b$10$DUA2pVZ0NE/ioSrAgLi/e.2ik3cBwD0vsb68UEtjqvlKWNJu.DvUC', 0, NULL),
(71, 15866856, '4', 'ARMIJO RETAMALES JOSELINE MACARENA', 11, 3, 3, 4, 'j.armijo.4', '$2b$10$T0u8nC4xSXy2pZIFmoT0BuF2gh3IlJmfcXYKWFr7kgloEyN6DUT2C', 0, NULL),
(72, 16856328, '0', 'ARMIJO ROMERO DIEGO ENRIQUE', 4, 2, 4, 4, 'd.armijo.0', '$2b$10$F6oQJ56LA6ofqCAehsYZ0OSD/nZGqpSSf1fpL.O/EdPRE5jkEjKsa', 0, NULL),
(73, 12179052, '1', 'ARRAÑO BAHAMONDES YANETT FRANCISCA', 37, 3, 5, 4, 'y.arraño.1', '$2b$10$5suUEPCdngUr6gtd9/7A3.5hLngwscINs51Ab6uv06FOQiNbqH2s.', 0, NULL),
(74, 25847844, '4', 'ARREDONDO GALINDO ROSALBA AUXILIADORA', 12, 2, 2, 4, 'r.arredondo.4', '$2b$10$R1pci6SZaNL892t5dFzlGOR/diOKc8gN.YG2.Srvl5fbhcEzIV1t6', 0, NULL),
(75, 25785403, '5', 'ARRIOJAS SILVA SIMON ANDRES', 12, 2, 2, 4, 's.arriojas.5', '$2b$10$GnUwvQkvnCuhvM946hGlgemlDpcS3tKGNvdsanc5gZHQKQ0n4tkk2', 0, NULL),
(76, 27094636, '4', 'ASCANIO CARMONA JESUS EDUARDO', 17, 2, 2, 4, 'j.ascanio.4', '$2b$10$zrzOciyg3.BGRXbuJWfzd.U5NFrIDg1I0QBeZtQ5FYNtB90XtHzre', 0, NULL),
(77, 17580023, '9', 'ASTORGA GUITRIOT MARCELA THIARE', 7, 2, 3, 4, 'm.astorga.9', '$2b$10$cOMAtb5EolA0GXzUVn9zFu33CA2tg.BT89mY4rMw8gfaB8ICBo8h2', 0, NULL),
(78, 18761767, '7', 'ASTORGA PIÑA BELEN CAROLINA', 14, 1, 1, 4, 'b.astorga.7', '$2b$10$jXwAynmZVJuH1FcFRIV3w.KYvk1lL8vtKv.Pf7/Yms0JWOeowRB9G', 0, NULL),
(79, 15511335, '9', 'ASTUDILLO VERA MARIA OLGA', 11, 2, 3, 4, 'm.astudillo.9', '$2b$10$8jnN.X1G6iA6e7Pm0Z7tFOP1vArE/ZYO4vuHZ5aZkvLekHr1i4q8i', 0, NULL),
(80, 18488244, '2', 'ATABALES OBREGON FRANCISCO JAVIER', 18, 2, 5, 4, 'f.atabales.2', '$2b$10$aVz5boIPvXJjQog.allPLO2w38mIK.L8fpbhERxuijCvVU5JAoiSS', 0, NULL),
(81, 17986603, 'K', 'ATABALES PAILAMILLA CAMILA BETTINA', 3, 2, 3, 4, 'c.atabales.k', '$2b$10$kYz/D8X.Ni3jeTsQ5iCFNeVdAMLPzLPMifR2Ge9jBqGEb2Ib.6.7C', 0, NULL),
(82, 20311877, '5', 'ATENAS CATALAN PABLO ALONSO', 25, 2, 3, 4, 'p.atenas.5', '$2b$10$I00t2N9fYEMb00MOvn0Z5uia5ehKLm7OydtyddF1o47bZGo9dD33O', 0, NULL),
(83, 14008346, '1', 'ATENAS GOMEZ LORENA PILAR', 24, 2, 1, 4, 'l.atenas.1', '$2b$10$LVjU0tYYdc8IfK0hWnWshuCs760Lkv6yGCTlG6Zsgkzelq2FUMWfi', 0, NULL),
(84, 8603917, '6', 'ATENAS MAULEN ISABEL ROSARIO', 25, 3, 3, 4, 'i.atenas.6', '$2b$10$vW.80D7n7tjrWYL/TXSdSODPfJi.v1T1x.QB3S0oSNwXmzCZP3CeC', 0, NULL),
(85, 15841626, '3', 'AVENDAÑO ALUCEMA GALO DEMIAN NICOLAS', 38, 2, 2, 4, 'g.avendaño.3', '$2b$10$/SFfmPvMPPLbvRvKevrQJ.R3d81OjkKSHj7Xe9FgQSyhkNoL/9VdW', 0, NULL),
(86, 9542952, '1', 'AYALA ALMARZA HILDA MARGARITA', 7, 3, 3, 4, 'h.ayala.1', '$2b$10$ERhGbZLXfqUzwYMLm/v9B.XTcCSfTetIr4H8Si2VscjPTILNvKqYi', 0, NULL),
(87, 15347225, '4', 'AYALA ARMIJO GLORIA PAULINA', 39, 2, 1, 4, 'g.ayala.4', '$2b$10$Rxt8nCkiVx7nZAohhmxRq.2jwCHCnD9X2gr/Gf0F5zQnzWiatxFnK', 0, NULL),
(88, 10104015, '1', 'AYALA QUINTANILLA LUCIA MIRIAM', 8, 3, 3, 4, 'l.ayala.1', '$2b$10$DyreAiCjOU9KwtqAutTInu/nOweb.ax3NOt94JCGJVFDmGYdtiO7O', 0, NULL),
(89, 26639383, '0', 'BAEZ BOHORQUEZ MAYBELLINE VIRGINIA', 40, 2, 2, 4, 'm.baez.0', '$2b$10$43L7yZb3ilCzHMkMURY.B.klIjS00dcwLC0V3AyNmtqIzmBciNzx2', 0, NULL),
(90, 13037180, '9', 'BAEZA OYARCE MARIELA BETSABE', 25, 2, 3, 4, 'm.baeza.9', '$2b$10$kbtjzv9VXLAw.t715dPwee87SRfs2klIIlDrVr2ViQeMhPIytLWeq', 0, NULL),
(91, 17708245, '7', 'BAHAMONDEZ SOTELO CARLOS ALFREDO', 31, 1, 3, 4, 'c.bahamondez.7', '$2b$10$zbnKqulUeyXZB2K/fW6l0O0HWnjraupkOuryxf9DzMG8ccxOsHYD6', 0, NULL),
(92, 26542996, '3', 'BALLAN ALNABWANI SIMON WAD', 17, 2, 2, 4, 's.ballan.3', '$2b$10$puDFippoGlPJCFEMHSwiS.1eFnXZUnZr7Gyam.9CngjeLiwhEW2KW', 0, NULL),
(93, 8764148, '1', 'BALLESTEROS CORDOVA PATRICIO', 41, 2, 5, 4, 'p.ballesteros.1', '$2b$10$ObzZVHW7.u3t.uNlAf5tGeAaE6e9J1Jmq.diLTkXVE1PZ4QtjaCwO', 0, NULL),
(94, 15404712, '3', 'BARRERA DIAZ JOCELYN KATIA', 3, 2, 1, 4, 'j.barrera.3', '$2b$10$u03w5WdwU3R2eXiz1GFyGemDAXUrGTBCKepq9EokrgJf.62I/ICtG', 0, NULL),
(95, 15337739, '1', 'BARRERA MANRIQUEZ ANGELA CELESTE', 33, 2, 7, 4, 'a.barrera.1', '$2b$10$rcC.07D5bYeDtxNn7Tvn2OcFtqOZlbxtQthqG15n2o6DCXnWADa1m', 0, NULL),
(96, 13172399, '7', 'BARRERA MARIN NATALIA FRANCISCA', 21, 2, 6, 4, 'n.barrera.7', '$2b$10$xk1cY8N8b1D5LzXfUlZ4AuGMq2sCcfkjIo29ArOTxMM5as2EmQai.', 0, NULL),
(97, 16467725, '7', 'BARRERA PAEZ CAROLINA DEL CARMEN', 35, 3, 1, 4, 'c.barrera.7', '$2b$10$bJxflXs8i4XXzOhk8FrUwetvjnjmxkFGqhLDL20.7/89kpiXIWIh.', 0, NULL),
(98, 17682328, '3', 'BARRERA URBINA VICTORIA ANGELICA', 19, 2, 3, 4, 'v.barrera.3', '$2b$10$M37eBmVwGwHpzs03UUDJ0OZlcqA92g6AKgrPLW2d8XiYPDtQaHlk.', 0, NULL),
(99, 26375379, '8', 'BARRETO VASQUEZ CARLYS ROSELYN', 6, 2, 2, 4, 'c.barreto.8', '$2b$10$pjV9Ro8mcB/s5M6rkxKJIeiKBWZbElK4R08wsfotzRjKHyz/G7Kjy', 0, NULL),
(100, 15307447, 'K', 'BASCUR CASTILLO JOVITA ANDREA', 32, 3, 3, 4, 'j.bascur.k', '$2b$10$Sy4U55DhHvVwrGRnBJC4XO1fMgx71Gi87DM0NSeYt7zW0/lJpnGUC', 0, NULL),
(101, 16429162, '6', 'BASTIDAS ARRATIA PALOMA BELEN', 8, 2, 1, 4, 'p.bastidas.6', '$2b$10$hao3Z8p3up5cS6lrzoGQtOvZOT2vp3G4sNz8YChOBvWYztaphxZJq', 0, NULL),
(102, 18166761, '3', 'BAYAS AREVALO ISIDORA PAZ', 13, 4, 7, 4, 'i.bayas.3', '$2b$10$I.12Ic/yyZVLmd4X.KfKju5T/hJNiKTmyZkwzz6ieejs9WGBu9Xz.', 0, NULL),
(103, 15350347, '8', 'BECERRA ACEVEDO DIANA CAROLINA', 25, 2, 1, 4, 'd.becerra.8', '$2b$10$Ts.qeMUwRW1RMKuAieVJoOlHym.Pxyuux.iQVquNobvZMiMPA4o7O', 0, NULL),
(104, 17702755, '3', 'BENITEZ SAAVEDRA DANIELA DENISSE', 39, 2, 1, 4, 'd.benitez.3', '$2b$10$vXsIbnxYUXHgnSLw8yN99ewH0iHXp2ll4fAQnQsNH32.18zYEGd6S', 0, NULL),
(105, 18702517, '6', 'BERRIOS MORA ALISSON ISABEL', 10, 2, 3, 4, 'a.berrios.6', '$2b$10$xLaYGoo1Be0FWRKUsSOU..N/DJQ0a8oPBYVPzdgNNyhMJXPxjsTfO', 0, NULL),
(106, 14576418, '1', 'BLANCO AVELLANEDA CAMILO DE JESUS', 25, 2, 2, 4, 'c.blanco.1', '$2b$10$89uc/IZSZGpuGKu0OrYiwePJ5YtDPGHTLCLD63B4OLZ0Bywg9Aurq', 0, NULL),
(107, 10925632, '3', 'BLANCO CHAMIZO ROSA ELIANA', 42, 3, 5, 4, 'r.blanco.3', '$2b$10$SJUfHMYhoggEvueKDhWVeeQgT5DNwO8a7.02CLGIUBpM5wmQ2vYy2', 0, NULL),
(108, 25972179, '2', 'BLANCO FARAMIÑAN EDUARDO', 19, 2, 2, 4, 'e.blanco.2', '$2b$10$5c2JGFwYwnMRd2Vu8D6iNOOQjsIICOijSv.QeQON2a2m3fxNZP6FW', 0, NULL),
(109, 26850517, '2', 'BRANDAO PARTIDA IVONNE JOSEFINA', 12, 2, 2, 4, 'i.brandao.2', '$2b$10$yQ5gCXM4P8X21AIirCcJLuKpu7mdD9S27Z8LPBHPCV/3gmHoomQ16', 0, NULL),
(110, 26802560, 'K', 'BRAVO FLORES JULIO FEDERICO', 11, 2, 2, 4, 'j.bravo.k', '$2b$10$WSWdh6K6Q.wUE5N0aiExseRZ5IQV4Q9v0jH3joVRxo7eLlUeJzFfe', 0, NULL),
(111, 18385436, '4', 'BRICEÑO SOTO VALENTINA ELIANA', 13, 4, 2, 4, 'v.briceño.4', '$2b$10$ez7R0rF1/tsOxIXhq06.Kedlwy8xcEelIzJcu1h/Lbvj1BCzIroWy', 0, NULL),
(112, 18624405, '2', 'BRIONES ESPINOZA HECTOR MISAEL', 43, 2, 5, 4, 'h.briones.2', '$2b$10$loGjWGCqx/LSs.E0fFbnj.r4EIhnCFBqobMVJ4u8NAYYdY5jnrgha', 0, NULL),
(113, 9545824, '6', 'BRIONES RIVERA DANIEL ENRIQUE', 8, 3, 1, 4, 'd.briones.6', '$2b$10$cYx0GsPXw3wM5V4BBwGGXO4o5oWui9o66Z3.kbp5.PD0F4hJKWJqG', 0, NULL),
(114, 17303423, '7', 'BRUNA VELIZ STEPHANIE', 25, 2, 1, 4, 's.bruna.7', '$2b$10$kZlgJo3MwN.miwK3HcVjSuJP/4pUfxZ14V0IgHsrLf2CMD1TsRXJW', 0, NULL),
(115, 14621069, '4', 'BUSTAMANTE BUSTAMANTE RAUL MANUEL', 44, 2, 1, 4, 'r.bustamante.4', '$2b$10$9cj5TPtfXBXB4lkSsEh5Fu7ekMeWuCOetc2431v2u2neESCc9QNX6', 0, NULL),
(116, 19750261, '4', 'BUSTAMANTE JEREZ FERNANDO JAVIER', 11, 2, 3, 4, 'f.bustamante.4', '$2b$10$wo/7OSqJcyZePFngabCRPec9knjP7klhvIH5jJTXi6RKbsRSFKZtm', 0, NULL),
(117, 17135745, '4', 'BUSTOS ALFARO FELIPE IGNACIO', 45, 2, 1, 4, 'f.bustos.4', '$2b$10$oD4WtQ5TqNZJIPm8u3CNT.QL0YgcOHN.awntrtznyAgxr8PdgKmGy', 0, NULL),
(118, 17398751, 'K', 'BUSTOS GOMEZ BRIAN MIGUEL', 18, 2, 5, 4, 'b.bustos.k', '$2b$10$v7551l9QRZF9eVaR7fKPv.Uj8FfrEz4j7n2C5u7TJtplB6vMCzEPq', 0, NULL),
(119, 18404262, '2', 'BUSTOS JARA CARLOS JOSE IGNACIO', 4, 2, 1, 4, 'c.bustos.2', '$2b$10$Gx56rEGIYUGzy00csnDug.vZg9vdw0jcUF84QS963aYD.bKeGLqO.', 0, NULL),
(120, 14006935, '3', 'BUSTOS MORALES LORENA ROMINA', 8, 1, 3, 4, 'l.bustos.3', '$2b$10$uIO7qcw9it36QBcEexbYhOJTddDzWlNeLCB78GmQxWCRvHFhWiDnO', 0, NULL),
(121, 8459294, '3', 'BUSTOS NILO CRISTIAN RODRIGO', 19, 2, 2, 4, 'c.bustos.3', '$2b$10$hX.Pld3VjXPn60KqXJHfm.OzoO8.KdK.13/zC8kdpq.WkLep9PWjS', 0, NULL),
(122, 20913630, '9', 'BUSTOS ORTIZ DENISSE ANDREA', 46, 2, 5, 4, 'd.bustos.9', '$2b$10$ibA1CKn129KzUWYXWHBKpOAi4UGco/cwoYtyZvSMC8QcM10SRlTWi', 0, NULL),
(123, 18213373, '6', 'BUSTOS QUINTANILLA ALEJANDRA NATALIA', 11, 1, 3, 4, 'a.bustos.6', '$2b$10$iMHWf5ZZrztdcbIkwMO/U.ymlMuKc3mnZ/TSQ8frBpGwqC7jS3rq2', 0, NULL),
(124, 10163916, '9', 'BUSTOS VALENZUELA ROSA JACQUELINE', 1, 2, 5, 4, 'r.bustos.9', '$2b$10$GQPwVZrK/xyp3SYiQl5C9.awbAzny86TpIOPRS12xnj4Iq5nr9pq2', 0, NULL),
(125, 17398520, '7', 'CABELLO PAVEZ BRIAN ALEJANDRO', 31, 2, 3, 4, 'b.cabello.7', '$2b$10$YwGD.S5FD9nzHJfr7Mx.FOhjJy8E2gFXLx391groAePPcUZvXTJra', 0, NULL),
(126, 8299499, '8', 'CABRERA OVIEDO EVELYN ANDREA', 32, 3, 3, 4, 'e.cabrera.8', '$2b$10$g7V8zlU82yR53cj2kYFijO5huwDSoTYLwuaJ7cgPBqmOpBKxIaKWm', 0, NULL),
(127, 25670611, '3', 'CABRERA PERNIA ELIOMAR', 17, 2, 2, 4, 'e.cabrera.3', '$2b$10$8a6EVL38sQ5O1wGEHT6QY.jMvrqwb7XJRtu3musJf1RmkFItC/VlS', 0, NULL),
(128, 19154246, '0', 'CACERES GONZALEZ SEBASTIAN RAMON', 13, 4, 2, 4, 's.caceres.0', '$2b$10$Ts4CANipCfTUFOPkRWEWXuSRSzo36Vg/3k1DdEjjKZFi1vLZSiDGy', 0, NULL),
(129, 17397506, '6', 'CACERES GUERRERO VANESA DEL PILAR', 1, 2, 3, 4, 'v.caceres.6', '$2b$10$OFV/AmQHSxGI5ANLJF8vQ.gaOJIr4QHlrM5yLVJpvGytsgqaWKohC', 0, NULL),
(130, 15149366, '1', 'CACERES PALMA ALEJANDRA CAROLINA', 33, 3, 3, 4, 'a.caceres.1', '$2b$10$WgFZEVg7CwULzC4DOjO46O/VN6dDdHgw/CZbmQIxln0qjoPkc5Cye', 0, NULL),
(131, 19750296, '7', 'CACERES PLAZA FRANCISCA FERNANDA', 39, 1, 1, 4, 'f.caceres.7', '$2b$10$Nr4ONkQMTfNeBMfNWlw0R.IVqfk/p3W.r9vnc0oDTHxBEYSIdJ8US', 0, NULL),
(132, 14431900, '1', 'CACERES VARGAS CLAUDIA DEL CARMEN', 8, 3, 3, 4, 'c.caceres.1', '$2b$10$62BtXaJfYKsLTZ.0cbbpAuVaDlwIKousR4JY4uX0ldaTVeHcS8nW.', 0, NULL),
(133, 9901052, '5', 'CACERES VARGAS MARIA TERESA', 3, 3, 3, 4, 'm.caceres.5', '$2b$10$zMhzlmTfkGnREXOvIaJ6se0/xp23LOCkOF44tXdM0syq2lD0xf3xC', 0, NULL),
(134, 14311818, '5', 'CADENAS CONTRERAS CHRISTIAN ESTEBAN', 47, 2, 5, 4, 'c.cadenas.5', '$2b$10$W9GIjdsVO8xHGOl.UCs7t.p2p/SMtx.8.7Uh.uAIc6CoaYtuZXPpO', 0, NULL),
(135, 13340287, 'K', 'CALDERON ARANEDA MARIA JOSE', 5, 2, 3, 4, 'm.calderon.k', '$2b$10$QqAGe7ozVzV43msMD6deVeK1OH9D2FmTfIC5aDOBjWZV76isCb13i', 0, NULL),
(136, 24377974, 'K', 'CALDERON GUTIERREZ NEIDA', 13, 4, 2, 4, 'n.calderon.k', '$2b$10$UCJg0J4xNqFsI8Rs7riYfuG2PS.1zwVxxHo18LauCRJu9J27Tkjha', 0, NULL),
(137, 19750004, '2', 'CALDERON SALINAS FRANCISCA JAVIERA', 24, 1, 4, 4, 'f.calderon.2', '$2b$10$jCYYEfOYJmePfDsVTQE8EO/Y/.ssND3VIHDixcwVWcZenPQzph9iq', 0, NULL),
(138, 15404008, '0', 'CALDERON VARGAS PAMELA DEL CARMEN', 19, 2, 3, 4, 'p.calderon.0', '$2b$10$ICATr22uF.EjprqsipPDReGye8.TnYSL/Lqru/fTMT69gTxJEFgXW', 0, NULL),
(139, 15405284, '4', 'CAMPAÑA ORTEGA GIANINA TAMARA', 32, 3, 1, 4, 'g.campaña.4', '$2b$10$JzVcUpG4YgIjpWHjGOQZh.2nq0QbdQ.cjUJUq.W28wTLdcOlMwVz6', 0, NULL),
(140, 13758855, '2', 'CAMPOS GAETE MARIA JOSE', 9, 3, 1, 4, 'm.campos.2', '$2b$10$U/kG/KiJige79kYdZWaYfuby/.7U9EqSLrYkobp4Dg3e2HFZuy3yG', 0, NULL),
(141, 14698928, '4', 'CAMPUSANO GRANDA IVAN ALBERTO', 25, 2, 2, 4, 'i.campusano.4', '$2b$10$go8VOzeOnSJdAxjviyk8OOMYn/YetStkJBO0FLnEhAMwEnTx2ONhu', 0, NULL),
(142, 18580655, '3', 'CAMUS CORTES NICOLE FRANCISCA', 35, 2, 1, 4, 'n.camus.3', '$2b$10$mESWOMUmYnsSlra6JpElxupFKafCmJ5L11gPCK1DIErmJF9SCaSqe', 0, NULL),
(143, 15333134, '0', 'CAMUS LEIVA MARIA CAROLINA', 21, 2, 3, 4, 'm.camus.0', '$2b$10$POPJOdUm/NdPiuCQOw409Oxr23XHJciIRPMMlwQOgO29/grKUU2HC', 0, NULL),
(144, 18072069, '3', 'CAMUS MARTINEZ MARIA TERESA', 1, 2, 1, 4, 'm.camus.3', '$2b$10$pPw1OYMmFsKmzbAAqE2hcOMYh7iCIZuYLgtcJyFvOV/4m9LtrZcSm', 0, NULL),
(145, 14564450, 'K', 'CANALES GONZALEZ JOHANNA PILAR', 11, 2, 4, 4, 'j.canales.k', '$2b$10$OPJjjbJTHZsq9CZeNQ4yNewmQuf7CICe5FgdNZxkN59BQMAtSIJSO', 0, NULL),
(146, 17986761, '3', 'CANALES LOBOS IVETTE JUDYTH', 31, 2, 3, 4, 'i.canales.3', '$2b$10$12Fmr0MXABQ0INbF.FQzX.lWZRrCzk1eo.5eb7Is/U.WO2ygiw6Wa', 0, NULL),
(147, 15771810, 'K', 'CANCINO LOBOS IVONNE DEL ROSARIO', 3, 2, 1, 4, 'i.cancino.k', '$2b$10$KKA0lhUVB43cq38ozpx5FuyYkaWJ.CP6Cq/f4B.vuipMd3gDqXhRG', 0, NULL),
(148, 17986757, '5', 'CAÑAS SANDOVAL GIANINA PATRICIA', 19, 2, 1, 4, 'g.cañas.5', '$2b$10$ghFf3pdb8nM4W9nsw0ayeumT5n45a.IwjWssOs5pIudrqLrjuO45K', 0, NULL),
(149, 9468656, '3', 'CARMONA ROJAS MARIO MISAEL', 8, 3, 2, 4, 'm.carmona.3', '$2b$10$2WMXNG5yitVCR0PluA0QJ.1RCVmrmXaoPm7bEoyD5iGzOJ4Vd3We.', 0, NULL),
(150, 12226566, '8', 'CARO CUEVAS JOHANA VANESSA', 8, 3, 3, 4, 'j.caro.8', '$2b$10$CFby9Tj7agGDCQKDCa4xLugTjhYMmv/muZsY1vVYupAlyVLuFIjV2', 0, NULL),
(151, 18487379, '6', 'CARO TAPIA FELIPE ANDRES', 31, 2, 3, 4, 'f.caro.6', '$2b$10$a58zFEbTeoKaZh4hRikvy.srhURRMqgkUir1fgmmoQ2sFuoh1Ay66', 0, NULL),
(152, 16984413, '5', 'CARRASCO CARRASCO MADELAINE DANAE', 19, 2, 1, 4, 'm.carrasco.5', '$2b$10$UpgkPCBFjaM27KvKTtU1NuCA6GEuqAtI6PR96xGoDMexHXRVvVX5O', 0, NULL),
(153, 17081903, '9', 'CARRASCO CORNEJO PAULA ROMINA', 35, 2, 3, 4, 'p.carrasco.9', '$2b$10$e9eWP1U6Ag02A2/pcDgTPOwSDMSzA/7v5zwLJX5YkGP4RnfoiKExq', 0, NULL),
(154, 15867166, '2', 'CARRASCO JARA MARITZA RAQUEL', 34, 2, 1, 4, 'm.carrasco.2', '$2b$10$eHdRj1Rc3Pnkgcq0awO4I.Z8dyqpMdxfizPYvfD4.C3JGrCFcHlNq', 0, NULL),
(155, 12178796, '2', 'CARRASCO ROJAS AMANDA DEL CARMEN', 22, 2, 4, 4, 'a.carrasco.2', '$2b$10$GVtudcLV3PHY4PdiE34EOeLvJWGBy.Qx9fNA.mc7bj.Hxa4Tcvx8e', 0, NULL),
(156, 14245942, '6', 'CARRASCO SANTIS CARMEN GLORIA', 8, 3, 3, 4, 'c.carrasco.6', '$2b$10$dk/86z4lvsr8Naxe/PSrsOrhBRZyL8PMwro8eWZxNq/cV5EDeabxS', 0, NULL),
(157, 10104487, '4', 'CARRASCO TORRES OLIVIA DEL CARMEN', 48, 2, 5, 4, 'o.carrasco.4', '$2b$10$gT6W8twKAXjC0sP0TLd1geutqksbsWDJ9HdT5ed6LE36cwa.Ls0pO', 0, NULL),
(158, 18777133, '1', 'CARRASCO VILLEGAS LISETTE ESTEFANI', 8, 2, 3, 4, 'l.carrasco.1', '$2b$10$x4k0jWsFIohee30gqfyU2.QatRB1N73zW/1kB2HtKyDBhRfHbfG9.', 0, NULL),
(159, 18213935, '1', 'CARREÑO ALVAREZ ALEJANDRO IGNACIO', 13, 4, 2, 4, 'a.carreño.1', '$2b$10$oEtpxC53i5gjdk/RBF.Q2.L1GtE56lV46Bv4cay.o11dxD6lc7i5y', 0, NULL),
(160, 19750363, '7', 'CARREÑO GONZALEZ JAVIERA ANDREA', 38, 1, 3, 4, 'j.carreño.7', '$2b$10$nNUoEGCZXY1QS8QR4qTlw.W4Vl/yLzKYyHK5qaAjWAt.XdL86yoWa', 0, NULL),
(161, 11608450, '3', 'CARREÑO LOPEZ MERCEDES CARMEN', 3, 3, 3, 4, 'm.carreño.3', '$2b$10$xsV7KEVBnl/PFO.vx.O0veGXIFb01jh8aKKvX3kT4WuIwds6Rt4qi', 0, NULL),
(162, 16477819, '3', 'CARREÑO MIRANDA GUSTAVO IGNACIO', 11, 2, 1, 4, 'g.carreño.3', '$2b$10$2kYPVj99XXE0NYYS5O4fQ.7//WFVtc6cebQxLu0Bvcq4Vb9xaX7Cm', 0, NULL),
(163, 18487558, '6', 'CARREÑO MUÑOZ GLORIA ANDREA', 8, 1, 1, 4, 'g.carreño.6', '$2b$10$UG6m/Vs1tCQEM5NeH/lOsOApMlEB9uGOIeO2RI1yafU6/CZdy11Iy', 0, NULL),
(164, 18212530, 'K', 'CARREÑO ZUÑIGA NINOSKA MARGARITA', 1, 2, 3, 4, 'n.carreño.k', '$2b$10$z48KmwctmELQOhaspXAMZukGGYEW8H7cXhbqvPRGnS2Abv0hBlmVa', 0, NULL),
(165, 17986182, '8', 'CARRILLO PALACIOS ELISA DE LOS ANGELES', 25, 2, 3, 4, 'e.carrillo.8', '$2b$10$Tk08sB19esEhgLiDFG97I.FFBp/OArDXNqzAGTh575kpN5UhQuoSW', 0, NULL),
(166, 25140059, '8', 'CARRILLO SARANGO CHRISTIAN XAVIER', 23, 2, 2, 4, 'c.carrillo.8', '$2b$10$tXObpdf1IPmNQlq7qrT9D.puJ40yKzY0xTSJXeB4e4f6ZjOdly.6O', 0, NULL),
(167, 17671594, '4', 'CARTES MUÑOZ ROSSANA KARINA', 31, 2, 1, 4, 'r.cartes.4', '$2b$10$W2701ZkWaM5.FaT/fKytnOJ4fgBBARI.Y21crRFe1aSx4vEcEuDne', 0, NULL),
(168, 8557372, '1', 'CARTES ROJAS ENRIQUETA CARMEN', 44, 3, 4, 4, 'e.cartes.1', '$2b$10$RXpCZvDR/PeaInZxHHgqLOAWPSSuWun.No7aP3CrQ2wpO5We7bi8C', 0, NULL),
(169, 17684210, '5', 'CASTAÑEDA GALLEGUILLOS MARIA SOLEDAD', 25, 2, 3, 4, 'm.castañeda.5', '$2b$10$AarOlkxXT4XYiAM7Lx1cSeogughkyg2SvTiW4iajHRYBPIToQY4gG', 0, NULL),
(170, 17987136, 'K', 'CASTAÑEDA JEREZ JIMENA ANDREA', 15, 2, 3, 4, 'j.castañeda.k', '$2b$10$q2Lqvven/z05Lr8nDq/Fp.m9tRg87OcX5lJ2meeudNwOYDkDwfALO', 0, NULL),
(171, 16125169, '0', 'CASTAÑEDA PIZARRO MARIA JOSE', 32, 3, 1, 4, 'm.castañeda.0', '$2b$10$aO.8giHOJ9.WnuVX.8bi8OMgvga2p7FbyVJw/nMUGbH.Nkn.joCzS', 0, NULL),
(172, 25807650, '8', 'CASTILLO GARCIA SALOME PEDRO', 49, 2, 2, 4, 's.castillo.8', '$2b$10$Nx6L0pmdWkfhjG9MyldVQ.ZILUax/zmuipccmm0O2yVx0MthKiYu.', 0, NULL),
(173, 20603815, '2', 'CASTRO RETAMALES JAVIERA ALMENDRA', 25, 2, 3, 4, 'j.castro.2', '$2b$10$GJNopL759iy6.V45Zm4p0uyHEb5cZIRxGWwpQEg3ToOesQyOQiW9e', 0, NULL),
(174, 15867526, '9', 'CATALAN AYALA IBONNE BEATRIZ', 11, 2, 1, 4, 'i.catalan.9', '$2b$10$sesQtkRuKLp9Pone15Ui8.IJ3X3IXKyH9KmsXhGcj5pU2o.LAtFGS', 0, NULL),
(175, 15405706, '4', 'CATALAN CRUCES MARIA VERONICA', 22, 3, 3, 4, 'm.catalan.4', '$2b$10$21EOomdHguiXcQtg712ghO6AzGcgLl/gCX1q5/xM3oh7.0lGqMyle', 0, NULL),
(176, 15623369, '2', 'CATALAN CRUCES PAOLA ALEJANDRA', 3, 2, 4, 4, 'p.catalan.2', '$2b$10$IO1loRcZ9Bj6yGm4ndkt3e9r3D9yaEZbqMJuBTxEmlP5wrEcwgHBS', 0, NULL),
(177, 9531797, '9', 'CATALAN FARIAS LUISA', 46, 2, 5, 4, 'l.catalan.9', '$2b$10$6ZUocGK2me22aMUgosMx0eZu.pCWuydNBfFaUj6Aj4tdxin5SIH0O', 0, NULL),
(178, 20879374, '8', 'CATALAN FUENTES DENISSE SCARLETT', 25, 1, 3, 4, 'd.catalan.8', '$2b$10$a7dQptPGc7T.EZ5AEoM5IOQmtkVlUMd9Odma.9b6MlYf4OfBuuYCS', 0, NULL),
(179, 18777334, '2', 'CATALAN LECAROS ANGELO NICOLAS', 16, 2, 1, 4, 'a.catalan.2', '$2b$10$uMbuu38PdHRCZ5e8Kw9hd.wIZxQsIULQN/EcRUFxio9HK04AzoQZG', 0, NULL),
(180, 14671528, '1', 'CAVERO CARDENAS MARCO ANTONIO', 28, 2, 2, 4, 'm.cavero.1', '$2b$10$/Zx72Byd.ajFVZsNHZ7QoO7OqVIT9LCxFjILkEJKb4/zyRNhr0IDi', 0, NULL),
(181, 17986387, '1', 'CAZCARRA HERNANDEZ KAREN', 39, 2, 1, 4, 'k.cazcarra.1', '$2b$10$QZvnjYHobA2VbGedOj8zVu4CqqNspj1eiCJuA0P0H2VwO3Hu7PZ/u', 0, NULL),
(182, 11669647, '9', 'CEA TORRES JEANETTE PAMELA', 44, 3, 1, 4, 'j.cea.9', '$2b$10$dwBdAcM.KR9BqxtzO9G4SuEJbgPXaWC8TqaURD5Un/YLsIp6wJ6jG', 0, NULL),
(183, 24407078, '7', 'CEDANO BILLINI LIZA KARINA', 6, 2, 2, 4, 'l.cedano.7', '$2b$10$wTc82rXXcggemQcMRrgTLuxCx3TOQlD9RsrQnCjRFcv6UuO.fhzC6', 0, NULL),
(184, 17516018, '3', 'CENA CATALAN EVELIN ANDREA', 25, 3, 3, 4, 'e.cena.3', '$2b$10$J20kP4HmRpN6wBjseyl8keHs/I7utjTEbzk84jRkOwBa/RRXfR7Wm', 0, NULL),
(185, 16967417, '5', 'CERDA CERDA GABRIELA DE LOS ANGELES', 15, 2, 3, 4, 'g.cerda.5', '$2b$10$NAJnUIGL2/.DPKIONyWwVOrfeDBrmHIViI.aCfNIN1A5qyFf3nHkO', 0, NULL),
(186, 15405878, '8', 'CERDA CORTES JENNIFFER PATRICIA', 10, 2, 5, 4, 'j.cerda.8', '$2b$10$/yNkBsaQji10RakUPLEYtOqJMfwiYAoN7H79xIQpUkBoj6sgPpdwO', 0, NULL),
(187, 16292341, '2', 'CERDA PAVEZ MARIA GABRIELA', 19, 3, 1, 4, 'm.cerda.2', '$2b$10$c7bv8hwNbqg2QpO1l14VOeB4jmCjg4ayTMB6Fr4syqMc.0YPSF8ca', 0, NULL),
(188, 18777414, '4', 'CERDA TORO CATALINA BELEN', 39, 1, 1, 4, 'c.cerda.4', '$2b$10$ALCiqZv9PaR5oQPMMMri7urRJM2m.D3DVDj4wzAHUrVEG1f7ZmUgK', 0, NULL),
(189, 14246679, '1', 'CESPEDES AYALA NANCY MARGARITA', 50, 2, 3, 4, 'n.cespedes.1', '$2b$10$pFgMm9ElE/vQwR7ZrW8uVOVXTKHZav/GonriOPYv9gmytbzS2kE/e', 0, NULL),
(190, 16577220, '2', 'CESPEDES CONCHA KAREN MARGARITA', 45, 1, 1, 4, 'k.cespedes.2', '$2b$10$gkCcrpqWBcIeE8/JY.RcEeYXNMnCSAYQk.XtpFHOdubIYxbsDUsAe', 0, NULL),
(191, 15511376, '6', 'CESPEDES CORVALAN FABIAN HUMBERTO', 14, 2, 3, 4, 'f.cespedes.6', '$2b$10$bi2R4FTZa8JaJta2VbV5Dum.J8JxOicoJIWsILCgF1YLXMYAbPRo.', 0, NULL),
(192, 19412380, '9', 'CESPEDES HERNANDEZ FRANCISCA JAVIERA', 8, 1, 3, 4, 'f.cespedes.9', '$2b$10$XzEeP3pFl9v0dbHqb4.fQuAqc.3FRZgX5uxaVIflnXr8FOnjtqRAy', 0, NULL),
(193, 18081020, 'K', 'CESPEDES VALDES CARLOS ENRIQUE', 4, 2, 3, 4, 'c.cespedes.k', '$2b$10$eNcJSxNSmBm94//9pW3HZ.y9McQPq0D4ZsA8eTUN3JP9fZsjDhuS6', 0, NULL),
(194, 16058773, '3', 'CHACANA MOLINA HANS ARIEL', 35, 2, 1, 4, 'h.chacana.3', '$2b$10$FFgbrYPy/0zGj8ucYoBni.9YRs2SaWdAFqeISiydKc8iWGvNWIpgW', 0, NULL),
(195, 15866539, '5', 'CHACON MADRID SIMON EDUARDO', 3, 3, 3, 4, 's.chacon.5', '$2b$10$nsHYD357yc3PKvwytlKlH.jAleDiy51vAy.WPeKdVqHlkyc/dJ8y6', 0, NULL),
(196, 9465646, 'K', 'CHACON NICOCHEA VIOLETA CARMEN', 51, 3, 1, 4, 'v.chacon.k', '$2b$10$QuHa8/El7uKhdKUXqgs14eS7H0oKFSzgj2UWQpX1hrFUX6s5NzWSa', 0, NULL),
(197, 27845143, '7', 'CHACON RODRIGUEZ JEISON ANDREY', 6, 2, 2, 4, 'j.chacon.7', '$2b$10$wRsfkx798NfupcBTD9eZDe50f2APBZEQmGM0JqOtV2skjaX8ql0qm', 0, NULL),
(198, 14007019, 'K', 'CHAMIZO HERNANDEZ MARIA ALEJANDRA', 52, 3, 1, 4, 'm.chamizo.k', '$2b$10$7p2HqUsYcTf84v1wmOhUqOwQ9B/BibLpr2jfTcPnJ5hNtRX55a02K', 0, NULL),
(199, 19749922, '2', 'CHAURA URBINA TAMARA PATRICIA', 7, 2, 3, 4, 't.chaura.2', '$2b$10$HfI8VRA3KBPTjlZNSeJ.7OXpU5hzy/jfKe6Ayrk/LdyH0glhNdzhm', 0, NULL),
(200, 16354449, '0', 'COFRE BRIONES CATALINA MARIOLY', 14, 2, 4, 4, 'c.cofre.0', '$2b$10$xLol0c3G6YFF2QAZxKTyNuyHFB8rGwbopMSRGwdaLwwiIk8K/0Nxe', 0, NULL),
(201, 10352200, '5', 'COLL CORTES CLAUDIA IVETTE', 25, 2, 2, 4, 'c.coll.5', '$2b$10$heSelIQMsXRvFoCoskF0VOblBowB6QfB8YT1eJ1GnTGIVoqM4bC4.', 0, NULL),
(202, 14727559, '5', 'COLOMA VERA JAVIER ALFREDO', 16, 2, 2, 4, 'j.coloma.5', '$2b$10$t1RFSjJx5l069Z8twcYp0uH2BsoYQ9.X9rr2u9gSjwLIOHmoF4aaO', 0, NULL),
(203, 14147295, 'K', 'CONCHA BALLESTEROS CAROLINA LORETO', 11, 2, 2, 4, 'c.concha.k', '$2b$10$RUH4KqEm1sjTvtxmj2cWiO.rFOShobPOnRZeD//si0I9YKXzf3HDS', 0, NULL),
(204, 14007948, '0', 'CONCHA CORREA JUANA ROSA', 29, 2, 3, 4, 'j.concha.0', '$2b$10$9Y1DV9LrcPnfdvtkmbQug.zYDxtF5yxvW4aV8jebNHmnGp0qdTBIG', 0, NULL),
(205, 11697499, '1', 'CONCHA GOMEZ SERGIO HERNAN', 8, 2, 1, 4, 's.concha.1', '$2b$10$CYFnvNNNlL8DpdFss08dieGpN0srdAxu7aLuJGno3MFyLu0UNyx02', 0, NULL),
(206, 20333866, 'K', 'CONEJEROS VERA LISSETTE NICOLE', 25, 2, 3, 4, 'l.conejeros.k', '$2b$10$cIVahAfFZaFCaS5pOysRNe86YL6ezMGV836CJNkaVeLGLanpK7trW', 0, NULL),
(207, 20879056, '0', 'CONTADOR CORREA CONSTANZA PAZ', 51, 1, 3, 4, 'c.contador.0', '$2b$10$o85ymLaB9Ywxh9JKrMQHbe/gMPL5Qv0Zn6zpubua1xGuVyMeAn9a.', 0, NULL),
(208, 12178260, 'K', 'CONTRERAS FLORES CAROLA BEATRIZ', 11, 2, 5, 4, 'c.contreras.k', '$2b$10$4J8RmxnVWFtNn0iH0OvfG.B9og8h.oeG2H4gINgF/dslwPdSki2aG', 0, NULL),
(209, 16454415, 'K', 'CONTRERAS GARRIDO GABRIELA FERNANDA', 31, 2, 1, 4, 'g.contreras.k', '$2b$10$QgG.Gof1OogtVDdghBR4/ee7Rbf6T631XzHzyP6YVan2h7CxCPRei', 0, NULL),
(210, 10747143, 'K', 'CONTRERAS HERRERA RICARDO ERNESTO', 39, 3, 1, 4, 'r.contreras.k', '$2b$10$jUzK2qsff5kAzRZariyNwunf6T.DwvnVY1NF.ZK5D08CKznNBG166', 0, NULL),
(211, 26492708, '0', 'CONTRERAS RODRIGUEZ OSCAR JOSE', 19, 2, 2, 4, 'o.contreras.0', '$2b$10$hh1.EI6gIFJQFnx6jxjsGOJUlm66v6XK13RjLZEoyDEUyAI0vjtrK', 0, NULL),
(212, 15782184, '9', 'CONTRERAS SAGUA ELIZABETH ALI', 7, 2, 3, 4, 'e.contreras.9', '$2b$10$.0Uy6s97bSO10eEAMCMsv.qas5GTY6o17sZhxY0APH0P7AYmXEQSm', 0, NULL),
(213, 10456351, '1', 'CONTRERAS VALDENEGRO JEANETTE DEL CARMEN', 11, 3, 3, 4, 'j.contreras.1', '$2b$10$avz3iqYotHohmtXtX8NFIeC9V47v.JI5EKVlgv9pDGqwPM/TIcWGi', 0, NULL),
(214, 12150040, 'K', 'CONTRERAS VILLALON DANIEL MARCOS', 28, 2, 2, 4, 'd.contreras.k', '$2b$10$QH2Xk84rny1f5UK8ZPEAKeCXbv92JXhEUcBso/3Q3Kk.7wt9g3ASS', 0, NULL),
(215, 17645592, '6', 'CORDERO LOPEZ CARLOS ANDRES', 13, 4, 2, 4, 'c.cordero.6', '$2b$10$wt1kz2MWKpmcLEzKp7V7yer0UN/918fiupcHSFMUF6AqDqgZh8VlS', 0, NULL),
(216, 27033947, '6', 'CORDERO LUGO CARLENY JOSE', 19, 2, 2, 4, 'ca.cordero.6', '$2b$10$tpneoh6RKh9o6RoaZDMAF.XY29Jze4QEXnpo.08iBniR5yyuJ4C9G', 0, NULL),
(217, 20131019, '9', 'CORDOVA CASTILLO BELEN CAROLINA', 38, 2, 3, 4, 'b.cordova.9', '$2b$10$Kn30RE7ficYsJs3uU/HZiOk9h1UhwZIojeFAgwJThFaqosyasY1Qq', 0, NULL),
(218, 11397129, '0', 'CORNEJO BARRALES PAOLA ALEJANDRA', 22, 3, 3, 4, 'p.cornejo.0', '$2b$10$lqaZRvezT2Ntgipt8i7Q4.f6aH//Emar.IBjkA9FjSqqy13kp9Zua', 0, NULL),
(219, 17986488, '6', 'CORNEJO CORNEJO CAROLINA ANDREA', 39, 2, 1, 4, 'c.cornejo.6', '$2b$10$JKoJTxCce7IIJzA6AyKSy.5sCrFoFRVydETCoNP4Mfaogpg8RDBW.', 0, NULL),
(220, 8747429, '1', 'CORNEJO VERGARA JOSE ARTURO', 4, 2, 4, 4, 'j.cornejo.1', '$2b$10$VpWWpocAJjbEV57WXpTYcehfv9gA/JI9pIgYlYuP9SfMzaBVvUBeK', 0, NULL),
(221, 19068302, '8', 'CORREA CARVAJAL ANAIS SOLEDAD', 22, 2, 3, 4, 'a.correa.8', '$2b$10$TCl8BV7Nh5VDF4Y9QU/zZ.yfm2mC5Pdf2O0aC8nTnWj4K065lSabW', 0, NULL),
(222, 17399141, 'K', 'CORREA FUENTES CARLA FERNANDA', 53, 2, 5, 4, 'c.correa.k', '$2b$10$902e68F7bGeVBhY9OH8JDeWQqNNG.jTWpBP6JC/m/uugz6wxs2qTW', 0, NULL),
(223, 13772500, '2', 'CORREA MENESES CAROLINA ISABEL', 32, 2, 3, 4, 'c.correa.2', '$2b$10$jyvqz1akx523sdxHD7EBQuyvWvZGwFShTDNBR/wC6/G2cd615RRoK', 0, NULL),
(224, 10217600, '6', 'CORTES ROJAS JUANA LUISA', 54, 2, 5, 4, 'j.cortes.6', '$2b$10$1ceZIdRy0YDxm3bIVoSmNOXrsVKlmMA/zetoW5lCCarTXbSLbroRy', 0, NULL),
(225, 9429438, 'K', 'CORTES ROJAS MARIA EMILIA', 25, 3, 3, 4, 'm.cortes.k', '$2b$10$4bFTttD9FfWKYU6CckvGo.vG19pr/VeQttOow804ga4DERJ8YLcum', 0, NULL),
(226, 10823493, '8', 'CORTES RUZ ROSSANA LAS MERCEDES', 19, 3, 3, 4, 'r.cortes.8', '$2b$10$WKB.7DMLtp4XbY1U07PreOMup122TMQujjUSVY6pK5EvRsY4zRSK6', 0, NULL),
(227, 14379880, '1', 'COUCHOT RIFFO MAGDALENA ROSARIO', 16, 2, 3, 4, 'm.couchot.1', '$2b$10$XEpZe1C7iVAjsF5m6Sh2HOGbQd6N/L7VTpdFS3oQyJJsUYuJcmQNC', 0, NULL),
(228, 9271573, '6', 'CRUCES VERGARA RUBEN WLADIMIR', 8, 3, 4, 4, 'r.cruces.6', '$2b$10$dm7S2EsordmzSFC2KbGXL.JFKVTPqxwW.l2JAhB9yjtkWGMPLuFka', 0, NULL),
(229, 25376471, '6', 'CRUZ PESTANA ANA MARIA', 25, 2, 2, 4, 'a.cruz.6', '$2b$10$TKbqISdZ2gndIEAtVS1Vw.bor4j.WzSZlJ8rWoj5KdpH8OiuzM/n.', 0, NULL),
(230, 19068795, '3', 'CUEVAS BARRERA INGRID ELENA', 55, 2, 3, 4, 'i.cuevas.3', '$2b$10$4igu8NR0YEM6N2d8iNia/.yxRyr1o0xSMRU2eO2EubA3aEpY09jeS', 0, NULL),
(231, 18293988, '9', 'CURIHUAN MINIERI CRISTIAN ALONSO', 32, 2, 2, 4, 'c.curihuan.9', '$2b$10$nI5AxKpBEetGreiJ24ovx.h.A15.4BMJ2fkxGI8hRq6nKl.opUgHi', 0, NULL),
(232, 26589338, '4', 'DE ARMAS VICTORES ARISTONY', 25, 2, 2, 4, 'v.de.4', '$2b$10$bEpo.unOlNoJvi8dKPP81u2ZKCcUKugMofgXMUCLKpccuMo4TAXwO', 0, NULL),
(233, 22917811, '3', 'DE AVILA ROMERO ANTONIO MISAEL', 28, 2, 2, 4, 'r.de.3', '$2b$10$zXdUKWQzIukLq2NFmPOWjuvGXyb3BJj4fQGGZHylOJ8lgwrxF4U6W', 0, NULL),
(234, 27007833, '8', 'DE PACE SILVA DAVID ENRIQUE', 12, 2, 2, 4, 's.de.8', '$2b$10$qcotd9bV2kUbYZFAqv8DauGsX8CEOdW6rn59PcUopPswGmvooYLuG', 0, NULL),
(235, 15959744, 'K', 'DELGADO SOLIS CLAUDIA ANDREA', 33, 2, 7, 4, 'c.delgado.k', '$2b$10$yB5dO0nHMvs2Qudt4tWo5eQs3ya/IlRviU/cBv4I0jStzkUDjcw8m', 0, NULL),
(236, 17081502, '5', 'DIAZ CARRASCO ALEJANDRO ALLISON', 8, 3, 3, 4, 'a.diaz.5', '$2b$10$lM0WbLihC968tNuphvbpz.RZ1TziVwQLjxlIeiq.EO6xVSvkC2nrC', 0, NULL),
(237, 15404705, '0', 'DIAZ DONOSO BARBARA CAROLINA', 8, 3, 3, 4, 'b.diaz.0', '$2b$10$DHKaL/WpkcFCkFpIJ2p0KuVfTSaKfrVVIFw3o8.dtErZ9h8gJu0sO', 0, NULL),
(238, 27372077, '4', 'DIAZ GRANADOS GARRIDO VICTORIA EUGENIA', 16, 2, 2, 4, 'g.diaz.4', '$2b$10$gmRX5hBw4ys//9ppvUT.O.wo9NnPDZuMQT2Y/QsvSUZwZg8k.7joC', 0, NULL),
(239, 18727131, '2', 'DIAZ LLAMUNAO ERIC LEONARDO', 13, 4, 2, 4, 'e.diaz.2', '$2b$10$dNmTe6ND3iZpLqIlwEpnme2qAkilWk20dLHWWj5Vbn1V/kNHY5K8G', 0, NULL),
(240, 18488493, '3', 'DIAZ MANZOR ANGELICA MARIA', 32, 1, 1, 4, 'a.diaz.3', '$2b$10$xFwYYPwjWAZaHDBuASeVe.TvKKGgWrz9UnsMFCj8FBTnx3v/uLB4q', 0, NULL),
(241, 15348585, '2', 'DIAZ MORALES MICHAEL ALEJANDRO', 8, 2, 1, 4, 'm.diaz.2', '$2b$10$e0cnUd6nQMRRZq6bt.4.aeOvT7QTCyhbmjH3wNRv3o2n7bk8pXbmC', 0, NULL),
(242, 12117426, 'K', 'DIAZ MUÑOZ JUAN CARLOS', 49, 2, 1, 4, 'j.diaz.k', '$2b$10$Wa5ST8r0G4A.Ju1Jc9MuxObfAniUbXHWsSjatafGaPhD7G251fSDC', 0, NULL),
(243, 19413039, '2', 'DIAZ ORTIZ ALBA CONSTANZA', 1, 1, 3, 4, 'a.diaz.2', '$2b$10$BrMOoa4DHtQ1B9gXJn4KP.rBWKGtyHWsonh6FcI2N8occXMNtJfqu', 0, NULL),
(244, 14311737, '5', 'DIAZ PINTO MAURICIO ALEJANDRO', 29, 2, 3, 4, 'm.diaz.5', '$2b$10$IXyJ4nnq.o.Vw14C4Vo2seQafXFlrFdHEZIWeX4nPRDO3DMVHJKj2', 0, NULL),
(245, 9464396, '1', 'DIAZ QUIROZ ARTURO SEGUNDO', 4, 3, 4, 4, 'a.diaz.1', '$2b$10$LEVDkpd8JV42LlDIv90sPe1EkBqEX3EJpuXsDAmwGalekgatHBMIa', 0, NULL),
(246, 16197073, '5', 'DIAZ QUIROZ PAMELA LUCIA', 3, 2, 3, 4, 'p.diaz.5', '$2b$10$zM0X.nolvXlS.Ii.efhWFelwXf2STcw0NSOaawiRo0Wn.XlFh9iLq', 0, NULL),
(247, 12271397, '0', 'DIAZ TOLEDO CAROLA BEATRIZ', 14, 2, 5, 4, 'c.diaz.0', '$2b$10$XdHusXewaZMkK//gCN5Pd.vSvBbzHPx90g0zkl2Ez24bQr7LImG9K', 0, NULL),
(248, 20311869, '4', 'DINAMARCA ACEVEDO CATALINA ALEJANDRA', 21, 1, 3, 4, 'c.dinamarca.4', '$2b$10$vhCbHIGVSvaquAHnscTFjeSjLboMIjaBMoQBUlqjXrri7v24PGi/G', 0, NULL),
(249, 20124665, '2', 'DONOSO CALDERON TAMARA AILEEN', 56, 2, 5, 4, 't.donoso.2', '$2b$10$ZBZ2lG0a0SW2SSHjj2dxMemmoiXftcbehQ5ydLL6k8B0rAeeia3vq', 0, NULL),
(250, 13546799, '5', 'DONOSO DONOSO ALEX MANUEL', 4, 2, 4, 4, 'a.donoso.5', '$2b$10$D4K7eyHfuHTk6DOdc30NJOlBL.vOqWMswXyM02Gm2oeJvOf.rsggK', 0, NULL),
(251, 16855189, '4', 'DONOSO GONZALEZ DANIELA SUSAN', 32, 1, 3, 4, 'd.donoso.4', '$2b$10$xREsHgzkadmn916JckcYGeaVhGPePbPqRyBJl0S34nVPdvMdWLBS2', 0, NULL),
(252, 15534821, '6', 'DONOSO MUÑOZ MARCELA ANDREA', 11, 2, 3, 4, 'm.donoso.6', '$2b$10$riygBfkz6XIc1eLrxpGUSePIIT.7rAWTMgOBP9Q7GtofogOj53H1W', 0, NULL),
(253, 17684015, '3', 'DONOSO VALENZUELA CAMILA PAZ', 19, 2, 3, 4, 'c.donoso.3', '$2b$10$CrxWW5xqyer/XBtEGufuyeVhEs4MSDM5qJIY.Z8eVc7JAQsntTd6C', 0, NULL),
(254, 9424136, '7', 'DUARTE JORQUERA LUIS ALBERTO', 47, 3, 5, 4, 'l.duarte.7', '$2b$10$BfWpJ8X.AHikcXUJsnt5Q.KZOmAVEnmWR9saWi0WR8A2gyPHfJi16', 0, NULL),
(255, 15701093, 'K', 'DURAN GUERRA CAROL DANITZA', 34, 2, 5, 4, 'c.duran.k', '$2b$10$VheRnAr0QaWswgAmBMohe.7tQG6mhwJ.MKn3IhtDf.8NGhWqvwkeW', 0, NULL),
(256, 15679447, '3', 'DURAN SEGOVIA GRETHEL PAULINA', 47, 2, 1, 4, 'g.duran.3', '$2b$10$M3VUKwXdaZ5gQahs9aU59uj5Mic4Cw9oBenjNr4ElQeliqsEY7dUy', 0, NULL),
(257, 10730909, '8', 'ECHEVERRIA CORDERO LAURA ELIZABETH', 26, 3, 8, 4, 'l.echeverria.8', '$2b$10$2AwTERQ9gW18AviEXADJG.HIAQP6p7LlsNnc8a3g18hHoSjBJyKAq', 0, NULL),
(258, 17682459, 'K', 'ECHEVERRIA MANZO CECILIA NICOLE', 32, 3, 1, 4, 'c.echeverria.k', '$2b$10$Bn4Y3rldH620l55sQiMbT.14QFXGrSmJ33s8pdbur2MofFuhyKUBG', 0, NULL),
(259, 6069270, 'K', 'ELGUETA ORTIZ ANA MARIA', 25, 2, 1, 4, 'a.elgueta.k', '$2b$10$mM/YkX/Wen44O0OtEOrzrejmXTiEI0cOPWaTsCH3vWZwegFmJA74O', 0, NULL),
(260, 18777445, '4', 'ENCINA GONGORA MELISSA DAYANA', 3, 2, 3, 4, 'm.encina.4', '$2b$10$LvdJPXYHwjo8pDYo9DHAoeK04yfp8.5heJkOmg6fXK2MX/nOtgwtK', 0, NULL),
(261, 11969470, '1', 'ENCINA PALMA MARIA ELENA', 57, 2, 1, 4, 'm.encina.1', '$2b$10$CU7rdCI//uY8Gn/TujJoCOfGW/KfqI.2OXZHWCR8TWX5ObvH8kClG', 0, NULL),
(262, 16577307, '1', 'ESCALONA ZUÑIGA DANIELA ROSA', 48, 1, 5, 4, 'd.escalona.1', '$2b$10$sVcfohtUeV2AkgjK1eIYw.Ehf6NPeKzKozx7Wb9EE0RXBeN0KApXy', 0, NULL),
(263, 16292028, '6', 'ESCARATE PADILLA MARIA MERCEDES', 8, 2, 3, 4, 'm.escarate.6', '$2b$10$4mTKT8qIeom8rOq7oSsYj.tYLv1IXPQGRJsPtV9KTP2puFrkXFjyK', 0, NULL),
(264, 20604054, '8', 'ESCOBAR ARMIJO CONSTANZA MILLARAY', 11, 1, 3, 4, 'c.escobar.8', '$2b$10$cZVoNazTP4f5YTX0ZA9fwuYKOHOqvQekmCiRWrkOQHED5LX2M0/BS', 0, NULL),
(265, 15405317, '4', 'ESCOBAR PAJARITO SERGIO HERNAN', 14, 2, 3, 4, 's.escobar.4', '$2b$10$93FG0SQZmyZJUnVPBGsvHO4FocaolxPldhe.LltdNKtb.lXLhXKDi', 0, NULL),
(266, 12859314, '4', 'ESPINDOLA CONTRERAS EVELYN DEL CARMEN', 33, 2, 7, 4, 'e.espindola.4', '$2b$10$JJarwim.vfWxaJnWNf5D8uzoqFiERbP9.oJRM3Xu1QVB1Ul191MF2', 0, NULL),
(267, 15353437, '3', 'ESPINOZA JIMENEZ KARINA ANDREA', 33, 2, 7, 4, 'k.espinoza.3', '$2b$10$r4l5a04zCG4VgRrqrZ/QWuhekpU3gf0vvuWoF2LzdftDICwuUn4hW', 0, NULL),
(268, 10449115, '4', 'ESPINOZA MEJIAS GLORIA IRENE', 51, 3, 3, 4, 'g.espinoza.4', '$2b$10$xpOyH2tprq5f8y4bDapfFuf1MyljOH95wUW4VAaIXiiVy9eSUwVTa', 0, NULL),
(269, 16765122, '4', 'ESPINOZA MORENO CAMILA FERNANDA', 33, 2, 7, 4, 'c.espinoza.4', '$2b$10$A4vDakaJigVDCKn/v5d3ZuB9GY.FqYFbdRvdvbLIOVqEBNy5xRjCa', 0, NULL),
(270, 13050793, 'K', 'ESPINOZA VEGA MARCELO ANTONIO', 35, 3, 1, 4, 'm.espinoza.k', '$2b$10$kRBKy8iBXaPIMDBoeypD7u8lpG/VaKhFDwQ/4vpVgNhqJEXFvp1xm', 0, NULL),
(271, 17081941, '1', 'FABIO GARATE GABRIELA FRANCISCA', 11, 2, 3, 4, 'g.fabio.1', '$2b$10$JBemz/DlyNLHSU5Z.9gduesjY.GvpE1M7USc.KVGwqYbQhcoCl67i', 0, NULL),
(272, 19618909, '2', 'FALCONE ALCALDE CLEMENTE', 13, 4, 2, 4, 'c.falcone.2', '$2b$10$PmXStef3/1swxGlXeD64yOZyQN7GloBQe..VbinNIcRZdT7.Kp40O', 0, NULL),
(273, 25824993, '3', 'FARFAN ARAUJO JESUS DANIEL', 32, 2, 2, 4, 'j.farfan.3', '$2b$10$njhJZXtncwCI7XqOKBVk6uXlOy3fiRRQpoIzmKAtr05mScI4Y/soC', 0, NULL),
(274, 26674084, '0', 'FARIA COBIS LUYELVIS KELWING', 17, 2, 2, 4, 'l.faria.0', '$2b$10$O8weV46n9W94c8A2ZWjjNOidKW6NulO4CmpjmCObpdXIlTDrT6eLO', 0, NULL),
(275, 8736987, '0', 'FARIAS CARREÑO MAGALY FRANCISCA', 56, 2, 5, 4, 'm.farias.0', '$2b$10$d3ZaSi2giC4hq6PN7ylKqOXvaFaft1x2ZCJpYhou9ik8ox/6MeBzq', 0, NULL),
(276, 11473628, '7', 'FARIAS MALHUE LUIS IGNACIO', 56, 2, 5, 4, 'l.farias.7', '$2b$10$vg2/.LR/m4elk3gnsA80/OmTWV9GQxwRe1QYmuX8F9Fm6rIXJHc1G', 0, NULL),
(277, 10341066, '5', 'FARIAS MALHUE SONIA TATIANA', 58, 3, 5, 4, 's.farias.5', '$2b$10$LrX/sg9LUw1ujvyaW2j14.K.gD1hiERVoLue1/hwVYo3PhlHOGIUK', 0, NULL),
(278, 9169547, '2', 'FARIAS MUÑOZ PATRICIA ANTONIA', 7, 2, 1, 4, 'p.farias.2', '$2b$10$2PHbsNdkRNtfHNTAlw1QRutWR9Q2bugqj.OsFwJ7Gd7C0UG1AbWWq', 0, NULL),
(279, 11608888, '6', 'FARIAS SEPULVEDA DORIS ALEJANDRA', 15, 1, 3, 4, 'd.farias.6', '$2b$10$dkqEFoWt.IK93QF/9l1vZuOCXU0eM1Jusw5eV9mvThbxpMqu1oiLG', 0, NULL),
(280, 14311958, '0', 'FARIAS TRONCOSO JENNY SUSSAN', 10, 3, 5, 4, 'j.farias.0', '$2b$10$59DPeW4dAmMELsZ8Pr0fMuY1Z08rhQegLMGCL/ZNrN/gNZr2ddmmW', 0, NULL),
(281, 14504782, 'K', 'FAUNDEZ MARTINEZ PIA LORETO', 46, 3, 5, 4, 'p.faundez.k', '$2b$10$ZGKp9J1hNez8f1a6J2pE.OqE.OiB5bkNdHDoKXwCKRaz9ZNdIbTgS', 0, NULL),
(282, 15772294, '8', 'FERNANDEZ CEPEDA TAMARA INES', 7, 2, 1, 4, 't.fernandez.8', '$2b$10$Ah5aYitS5F2EXeqEoz4reesbVMhl8IQ8.iI/DKKbpLTUyXXQJSg1u', 0, NULL),
(283, 9857434, '4', 'FERNANDEZ GUTIERREZ MARCELO EDUARDO', 7, 3, 1, 4, 'm.fernandez.4', '$2b$10$8BrfqLGqRn7Qog/9s5AUnun.bfk4ptttk8.MkktofzlDYCBja/.eq', 0, NULL),
(284, 26926674, '0', 'FERNANDEZ MONTILLA LUIS', 32, 2, 2, 4, 'l.fernandez.0', '$2b$10$6J7zHvCq4.Ylqr9sbzAR3eai7G7TEK63nsKzeCKd.CDVF7lvfQaxa', 0, NULL),
(285, 6690110, '6', 'FERNANDEZ VIEYRA GUILLERMO', 7, 2, 2, 4, 'g.fernandez.6', '$2b$10$iw7RHX9VnpNZIwoYx1CUBu3N16Oa.Ywy4bkZmQMTNas0arMIPiwbS', 0, NULL),
(286, 15865843, '7', 'FERRADA BUSTOS PAULA ANDREA', 32, 2, 3, 4, 'p.ferrada.7', '$2b$10$3K1.RjR68uw6/lxG4dbmvuc88bSBPfLortYPOXQhPfcAgKoo8iU3K', 0, NULL),
(287, 19288692, '9', 'FIGARI GONZALEZ JAVIERA', 14, 2, 1, 4, 'j.figari.9', '$2b$10$A6C.yPg4s/gk338jFN8FhOFOH0ji/QXGO8cUa0IWU35bqUyQO09pO', 0, NULL),
(288, 15623201, '7', 'FIGUEROA ARMIJO DANIELA ROSA', 51, 3, 3, 4, 'd.figueroa.7', '$2b$10$3JploP1fFlQEoHRfPx0yRuhWNh0yESt.WzVTQ2dbqPPwSV103nbS2', 0, NULL),
(289, 16447489, '5', 'FIGUEROA COFRE FRANCISCA ANDREA', 22, 3, 1, 4, 'f.figueroa.5', '$2b$10$LWSvjBYBT1dCugFia6srE.nhwIcBkLiuiURj4x4kSKlqtm9tgLxz6', 0, NULL),
(290, 18777176, '5', 'FIGUEROA MALLEA KARLA BELEN', 3, 2, 3, 4, 'k.figueroa.5', '$2b$10$T8s1Is8Mns8K6sEvu3QW0OZ3t9pXe1lYuooRPAYXv2za8KoJS1ri2', 0, NULL),
(291, 16068334, '1', 'FIGUEROA ZUÑIGA ANA MARIA', 1, 3, 3, 4, 'a.figueroa.1', '$2b$10$oQGDZ6n2AY3ePJ3Ermw/hu6.y49vREC1F5ucwzVDw59H4xVXd2Lu2', 0, NULL),
(292, 16855587, '3', 'FLORES SILVA GINA MARGOT', 15, 1, 3, 4, 'g.flores.3', '$2b$10$ZjggR4BPqKi4o6OEbCPL3uox3Zz.VY8ifsU.2UzNyAoFrr4Lxobu.', 0, NULL),
(293, 25482033, '4', 'FORTE FILIPPI MASSIMO EMANUELE', 28, 2, 2, 4, 'm.forte.4', '$2b$10$nwNHU7doF/H7A0muL0fGnubtPTB.vvOdimVwBGWB3CwxOsVXK8jCG', 0, NULL),
(294, 21320411, '4', 'FRAUSTO CIENFUEGOS ANA KAREN', 13, 4, 2, 4, 'a.frausto.4', '$2b$10$.JOZTNrGsw1SeD0jF62.oeIEOTS4pg6yNC6YfCeBUUCt8Y2EUloQ6', 0, NULL),
(295, 17682935, '4', 'FRIAS CISTERNAS ANA KAREN', 33, 2, 3, 4, 'a.frias.4', '$2b$10$f78qc0iWlacwdTSWdlxWGOy/Ea9ea8nGJBsS.nTKo7t/I0Kq3doVG', 0, NULL),
(296, 16653354, '6', 'FUENTES BANDA CRISTOBAL IGNACIO', 13, 4, 2, 4, 'c.fuentes.6', '$2b$10$4H8MJjZIed/ZZJaPC2TwHeRvkE7iC8h/kehrGlqfcJqQBbMQlVCIG', 0, NULL),
(297, 17683678, '4', 'FUENTES HERNANDEZ KATHERINE BERNARDITA', 3, 3, 3, 4, 'k.fuentes.4', '$2b$10$fRpBJKqhE8dZzAU3PihpVOe7cz5DMm.zHijrci.5o4HnF9Ceb.htu', 0, NULL),
(298, 25373043, '9', 'FUENTES ORTEGA GIOVANNY JOSE', 29, 2, 2, 4, 'g.fuentes.9', '$2b$10$QJKabTERS3zjMR/jlrxoF./Jbkk0HqUh43y2lgZy92SIqARdGnHuy', 0, NULL),
(299, 15404729, '8', 'FUENTES TORO LILIANA ANDREA', 8, 3, 3, 4, 'l.fuentes.8', '$2b$10$jWPl8efLtDZgv71yIrXQ8.OY9Sv70U.f.WdE7EHAHsdOT/jn9awsW', 0, NULL),
(300, 18736817, '0', 'FUENTES VIVEROS FELIPE ALBERTO', 21, 2, 6, 4, 'f.fuentes.0', '$2b$10$QTQgi.aU6Ipv5uqnZ3N4AeMnFaE8Bguz3g1CwG8oX/fLnAtmpy78W', 0, NULL),
(301, 15585292, '5', 'GAETE MARTINEZ ANGEL MARCELO', 14, 2, 4, 4, 'a.gaete.5', '$2b$10$X.6oRq3ZJIYHIqsD2PAoGuzx5ZF7YdDbc0sRK7U1B9BBgajfxU4ZW', 0, NULL),
(302, 13509789, '6', 'GAETE MOLINA LUCIA IVETTE', 24, 2, 3, 4, 'l.gaete.6', '$2b$10$h81Qz/tuJjKEnpOF9mICS.9SOyFDWSWv10MpDPWcmmfDPRig63Nr6', 0, NULL),
(303, 26349244, '7', 'GALARZA VACA SEGUNDO HECTOR', 11, 2, 2, 4, 's.galarza.7', '$2b$10$P2FFpDXlq07oPVFhRwjdcOdFvooyg2wkBK9ORQ01ch/ohvMN92iA.', 0, NULL),
(304, 10812872, '0', 'GALDAMEZ ALVEAR ANA ROSA', 29, 2, 3, 4, 'a.galdamez.0', '$2b$10$o1rFsqfPxpmVQ5HFU6DV9uTf4NVK63YBlq7h/iy1qBew1xHk0nEQq', 0, NULL),
(305, 12412577, '4', 'GALLARDO MORALES KARLA ALEJANDRA', 29, 3, 4, 4, 'k.gallardo.4', '$2b$10$KrbHr5OIuUr0YD0XRggtQeAq087m4BtYfZY3wtTLQ2eoXgOwbLuZu', 0, NULL),
(306, 17087996, '1', 'GALLARDO POZO CRISTIAN HERNAN', 36, 2, 1, 4, 'c.gallardo.1', '$2b$10$DUWjl1yllREnJ.hxcIIrde6PsxymLdVf531QiND2WOee7Xt2Migjq', 0, NULL),
(307, 15624198, '9', 'GALLEGUILLOS GARCIA ALEXANDRA DEL PILAR', 59, 3, 3, 4, 'a.galleguillos.9', '$2b$10$lvegMvUmxrlpQu.U8VupHeS9uWKL0TKHyOn7FwDaK/g6QWd.JKoSG', 0, NULL),
(308, 18487280, '3', 'GALLEGUILLOS HERNANDEZ TOMAS ANDRES', 25, 2, 1, 4, 't.galleguillos.3', '$2b$10$JRs9atBqQ7EMGaUtr9u6CeeR4aBxC1d5QZBnFJGF5iTqlhjxkK6Oi', 0, NULL),
(309, 9810162, '4', 'GALLEGUILLOS IRRAZABAL LORETO ROSARI', 59, 3, 3, 4, 'l.galleguillos.4', '$2b$10$KclyKyGRYjNeHbmjg6X6C.fObuTCHbhDTO1ci9MjiH0b5zDmpfkNu', 0, NULL),
(310, 9810161, '6', 'GALLEGUILLOS IRRAZABAL ROSA MARIA', 25, 3, 3, 4, 'r.galleguillos.6', '$2b$10$exOJ6HzB5d0HtTMYP7bQmO3syzfw/aBADeF00.fTRtEOOfZkWqPf.', 0, NULL),
(311, 11608784, '7', 'GALLEGUILLOS TORO BLANCA ISABEL', 32, 3, 3, 4, 'b.galleguillos.7', '$2b$10$YbbWobmNlsCfYEB5XNlW0.eKcp6kq/rIuyiqgqQH.uOToExuLkU/a', 0, NULL),
(312, 18213163, '6', 'GALLEGUILLOS TRUJILLO JOSELINE SOLEDAD', 3, 2, 3, 4, 'j.galleguillos.6', '$2b$10$lV87HmvF5MeP6jc4/H27g.epqUaPhFbqlSs6Co4l9yw0QulTG.sEC', 0, NULL),
(313, 15181507, '3', 'GARCES BRAVO ANDREA ELIZABETH', 5, 1, 1, 4, 'a.garces.3', '$2b$10$TDqwfM.Yka2IV1L4hCHOXeFBknvZD1PB5yLFtFPdg2UPRU4m3a/0e', 0, NULL),
(314, 10779562, '6', 'GARCIA CABRERA ALEJANDRA PAZ', 16, 3, 1, 4, 'a.garcia.6', '$2b$10$sQF7hh09VjO/Nh3acIRH5eatt4elKFxElDBSCxwuDmknI6uZ83BRO', 0, NULL),
(315, 9429579, '3', 'GARCIA GONZALEZ MARIA CARMEN', 14, 2, 4, 4, 'm.garcia.3', '$2b$10$qDrGOMcS1WkU7BebnfjYC.iCD.gJo0VQR0iyoVdG9Z7cekidRSrEa', 0, NULL),
(316, 9429586, '6', 'GARCIA GONZALEZ ROSA DEL PILAR', 22, 2, 4, 4, 'r.garcia.6', '$2b$10$0Nw.sMzmDH4PZgvOFndsQOveYciFkBM.PkZ2GHD6MmUV5hrXro6bu', 0, NULL),
(317, 27735168, '4', 'GARCIA VELASCO JOSE EDUARDO', 16, 2, 2, 4, 'j.garcia.4', '$2b$10$s8nNov3rLGiL9n13bAZJkuyoh1nQZ1w9m/e/UfGGD8pJgyBaQRWmi', 0, NULL),
(318, 10507315, '1', 'GARRIDO LAGOS OSCAR RAUL', 4, 3, 4, 4, 'o.garrido.1', '$2b$10$zAaaG90xqL28grB6V9LxaeoFIOnqh5FlCtk/ELy4j75lbBePHef4.', 0, NULL),
(319, 18487655, '8', 'GARRIDO ORELLANA PAULA DEL PILAR', 19, 2, 1, 4, 'p.garrido.8', '$2b$10$5bKJqZoGXqNM.fsKfD0QAOEIAhxTSHXjPJNd4nkMWIo1HpDu8UCP6', 0, NULL),
(320, 16197595, '8', 'GARRIDO SANTIBAÑEZ ELENA DE LOS ANGELES', 52, 2, 5, 4, 'e.garrido.8', '$2b$10$NCrqPFchirhGF8REfKUQae531VZFYk/nsBmhhzRaTM96vQorG7.fm', 0, NULL),
(321, 14440812, '8', 'GARRIDO SUAREZ JOSE ALEJANDRO', 16, 2, 2, 4, 'j.garrido.8', '$2b$10$XdbyDIIxqzCVxIDQaGMvH.TXCWOmLd3G5..a5dGv63dkoIPGzC5l6', 0, NULL),
(322, 25935036, '0', 'GIBENS CORTEZ JESUS JOSE', 6, 2, 2, 4, 'j.gibens.0', '$2b$10$OBoU4rEJX62Xe9D5gxvvP.DYv5vhytkaRdq5pyqmZ2fYebi4j5JkW', 0, NULL),
(323, 18641139, '0', 'GODOY FERNANDEZ DIEGO ANDRE', 13, 4, 2, 4, 'd.godoy.0', '$2b$10$NpkFjBgvYq1SieXSbRoqCucZkyzYQpj/TSPVgZNq3YMAAYdoWRhf6', 0, NULL),
(324, 12178307, 'K', 'GODOY SILVA JORGE MANUEL', 60, 3, 5, 4, 'j.godoy.k', '$2b$10$SjarYVULNquByAZr97GrzuSsWsYtdyslndmN3dwgJ3y3B4Ut2u5Fe', 0, NULL);
INSERT INTO `usuarios` (`id_usuario`, `rut_usuario`, `dv_usuario`, `nombre`, `id_servicio`, `id_tipo_contrato`, `id_estamento`, `id_tipo_usuario`, `username`, `pwd`, `borrado`, `email`) VALUES
(325, 8735797, 'K', 'GOMEZ ARGUEDAS JUAN CARLOS', 28, 2, 2, 4, 'j.gomez.k', '$2b$10$R9jbSxfMKx7/Fy3muL4zRO/WAgS5hrKW456fiYhDaqSHhiePwgzIS', 0, NULL),
(326, 13772563, '0', 'GOMEZ ARMIJO ALEJANDRA ANDREA', 32, 3, 3, 4, 'a.gomez.0', '$2b$10$FyUDBGsxPU40YIKhQavXYOoKrMRzBv3N7bs.nBU0yw8j2tRIAvk2m', 0, NULL),
(327, 17770417, '2', 'GOMEZ CANIULAO VANESSA NICOLLE', 11, 3, 3, 4, 'v.gomez.2', '$2b$10$IHcYFau4CSH5R88pU7Nv8eLbKcD2GSgMy5LBLIPKOb20EHpz/TXyK', 0, NULL),
(328, 19974816, '5', 'GOMEZ DONOSO TAMARA BELEN', 19, 2, 3, 4, 't.gomez.5', '$2b$10$DvXaeGaEigBuNQpO1L/.EuLKD3bhItPOtqRGqkCIOmoZzcKbadVC.', 0, NULL),
(329, 14007296, '6', 'GOMEZ GONZALEZ MARLENE KARIN', 29, 3, 3, 4, 'm.gomez.6', '$2b$10$PnLx3uD6LMeg.LK9TZnW3eNchgE3gJK57JTcfDbz2uDRLRPdCpkma', 0, NULL),
(330, 19354649, '8', 'GOMEZ INZUNZA VALENTINA FERNANDA', 39, 2, 1, 4, 'v.gomez.8', '$2b$10$YSSyStLt6iVKNLKrjjo2Eu/usGsaKucHcD4yv6UF9QQUdX24wtS5O', 0, NULL),
(331, 12800206, '5', 'GOMEZ NUÑEZ YAMILET SOLEDAD', 15, 2, 3, 4, 'y.gomez.5', '$2b$10$V20YJXPH7B4WWyDKEa6eheYM5lhHEhJJj77Y2fsw5hHfjm3e1Py1q', 0, NULL),
(332, 17516290, '9', 'GOMEZ OPORTO EVELYN DAYANA', 1, 2, 1, 4, 'e.gomez.9', '$2b$10$Nueu5kkoH15FmghCx4KzB.jiiZarL/y5aDYxQf0FC0pldMIw7OlIa', 0, NULL),
(333, 25884038, '0', 'GOMEZ ROJAS MARIA ZOILA', 25, 2, 2, 4, 'm.gomez.0', '$2b$10$tVIKLxbkAExRkP6mxcLfCejwyxPnBsByJQWYJTpLhiN9Auo2X6ZSe', 0, NULL),
(334, 19411158, '4', 'GOMEZ SALDAÑA JAVIERA BEATRIZ', 15, 2, 3, 4, 'j.gomez.4', '$2b$10$2Bg/95ZychSv4mVlRxfVCeCcwqm6e89O/rYs.azpBMp8YP9KYTqNW', 0, NULL),
(335, 14380320, '1', 'GONZALEZ ALVAREZ FIDELMA DEL CARMEN', 8, 3, 3, 4, 'f.gonzalez.1', '$2b$10$WshbUH01GrqC2QGuItzmr.Y6rTkrt6hzBd9i0RkWmYbcRFhhXwm.O', 0, NULL),
(336, 19411710, '8', 'GONZALEZ ALVAREZ LUIS ANDRES', 13, 4, 2, 4, 'l.gonzalez.8', '$2b$10$Dkyqsup.iHzUEt/uvDMvguWf1TVEZkAqBdCKOmVCzEywsZg2QDHjG', 0, NULL),
(337, 19594710, '4', 'GONZALEZ ARTEAGA ALVARO ESTEBAN', 13, 4, 7, 4, 'a.gonzalez.4', '$2b$10$M5u980b1Kq6noAkfivfWwugYahLMgmISBT/n8av0BhmpJQX8K4Tw6', 0, NULL),
(338, 20603764, '4', 'GONZALEZ BARRAZA PAZ CATALINA', 25, 2, 3, 4, 'p.gonzalez.4', '$2b$10$DW8tmJgRwKIwW/rZqToSM.ERbJwwWwGuQXvx/KbJXoIYjTu7L85Cy', 0, NULL),
(339, 19644814, '4', 'GONZALEZ CASTRO FELIPE ANDRES', 13, 4, 2, 4, 'f.gonzalez.4', '$2b$10$mrDvjnxScTJxrjpnYRb8HOimjvcNpbWluQcIeUIdllPm4BK1dQ/kO', 0, NULL),
(340, 17398768, '4', 'GONZALEZ CORNEJO KATHERINE VICTORIA', 8, 3, 1, 4, 'k.gonzalez.4', '$2b$10$5ThS5qoPA/uojdBxT.4nsOGpdrPiPMi6KIH4KSazvMLqOk7WQTLZ2', 0, NULL),
(341, 17398161, '9', 'GONZALEZ FARIAS LUCILA DEL CARMEN', 7, 3, 3, 4, 'l.gonzalez.9', '$2b$10$CVEyI0q.hspw0PJiklObLOzbftT0pPoJBXrpeXWpZRc.OpJusbeg6', 0, NULL),
(342, 12799323, '8', 'GONZALEZ FARIAS PATRICIA ALEJANDRA', 16, 2, 3, 4, 'p.gonzalez.8', '$2b$10$aFWGVrXdUZnLxa5y.i3ZCO0NgQ3ZDQOztE0HwkXJxMddOHDBmNSsy', 0, NULL),
(343, 16615166, 'K', 'GONZALEZ FERNANDEZ PAOLA ANDREA', 7, 3, 3, 4, 'p.gonzalez.k', '$2b$10$8toZfBZYxKWtsxVsSsiprOdGp5kORsr8LxsdnRKvzzEWV9lXdMITm', 0, NULL),
(344, 17683816, '7', 'GONZALEZ GOMEZ FANNY MACARENA', 11, 2, 1, 4, 'f.gonzalez.7', '$2b$10$YzKVW6MNdkQXJtI/Xz68eeEKMM0he4JXNEzIA3RlpBf0rnT5X0LwS', 0, NULL),
(345, 18674286, '9', 'GONZALEZ GONZALEZ ARANZA BELEN', 61, 2, 1, 4, 'a.gonzalez.9', '$2b$10$pdNt/F4KT6voZ3bzI9C2WexjjMOqb.fFBz4rQcW0QgbJtklHR75cS', 0, NULL),
(346, 14246118, '8', 'GONZALEZ GONZALEZ PATRICIA ALEJANDRA', 59, 3, 3, 4, 'pa.gonzalez.8', '$2b$10$wqxMZ5csykb8li.P03cYu.o4/p7ZeD2g43YjPtV/8jIoRHF6txrRq', 0, NULL),
(347, 10327205, 'K', 'GONZALEZ GUTIERREZ CLAUDIA SOLEDAD', 11, 2, 1, 4, 'c.gonzalez.k', '$2b$10$eLA/87CPJSbnYpkUASCDG.ojtIH.4AfDOHkOGuHTPr5YXT2qA92u6', 0, NULL),
(348, 15405556, '8', 'GONZALEZ JERIA FRANCISCO IGNACIO', 32, 2, 1, 4, 'f.gonzalez.8', '$2b$10$KV9q81ZFPbSkj7ysDESnOueCcL0j6Ph0H5bRS.MlGcYZ4oY9L5IAi', 0, NULL),
(349, 16577038, '2', 'GONZALEZ JERIA ROCIO BEATRIZ', 22, 2, 3, 4, 'r.gonzalez.2', '$2b$10$2sB7XQsOhhnHXNUB24G/yeF6xalhV7Y32TvtNa.NxKpmDI6c5Qt6S', 0, NULL),
(350, 17397585, '6', 'GONZALEZ LECAROS LOURDES BELEN', 62, 2, 1, 4, 'l.gonzalez.6', '$2b$10$7Sap0bCtsThJxhfR9B2r3umJ/eFMEWLIea2t.9qixP2SO0MZVBZmy', 0, NULL),
(351, 18778543, 'K', 'GONZALEZ MALLEA BEATRIZ ANDREA', 22, 2, 1, 4, 'b.gonzalez.k', '$2b$10$qt5VZgLx4jVpSLBpxvi8xeqstgYXoZt75Oj43P6TIZecw461f2fSe', 0, NULL),
(352, 13559725, '2', 'GONZALEZ MARQUEZ CATALINA ANGELICA', 27, 3, 3, 4, 'c.gonzalez.2', '$2b$10$.3K/n9BSf9hD6KoJJpW.Q.KqqxxKLYkwwyZ2gwUhanLKy/rK5boLS', 0, NULL),
(353, 20604001, '7', 'GONZALEZ MAUREIRA JULIANA ANDREA', 63, 1, 3, 4, 'j.gonzalez.7', '$2b$10$nssif/SAYhYyYsWm2W4HC.u.HHvhLKoh5/56QG3XHoJfKeaczDreG', 0, NULL),
(354, 7887496, '1', 'GONZALEZ MUÑOZ RICARDO ROBERTO', 7, 2, 2, 4, 'r.gonzalez.1', '$2b$10$4kHy2ohQ6AWPwsn0xCqgau3li27RWMZCn90lPGcYDpaKQB3eK32M2', 0, NULL),
(355, 18620886, '2', 'GONZALEZ OLIVARES MARIA IGNACIA', 3, 1, 1, 4, 'm.gonzalez.2', '$2b$10$5JPhGBS0s.vnE/iIQ3AGRu22BVOyQMDZhxKiPqYeT9Y0rIBxGDKCq', 0, NULL),
(356, 20707883, '2', 'GONZALEZ RODRIGUEZ CARLA ANTONIA', 25, 1, 3, 4, 'ca.gonzalez.2', '$2b$10$3Z0FRr4ey6F8B5Lpi7pSN.eKYIu142hSv4qRTwTCCdW6ndeHve.z.', 0, NULL),
(357, 18117894, '9', 'GONZALEZ ROJAS ABEL ANDRES', 13, 4, 2, 4, 'ab.gonzalez.9', '$2b$10$oD1ilxuzC7jHLNG/F2TKUeGcy/uyTDj6RZfmAktSWhRGepIF96kGG', 0, NULL),
(358, 16953875, '1', 'GONZALEZ ROMAN MARIA CELINDA', 11, 3, 3, 4, 'm.gonzalez.1', '$2b$10$zTNZa2z/IWNnMwEQX5OOAugQuuU/AElvozxe3Upws7RFhi7plIUMm', 0, NULL),
(359, 17398557, '6', 'GONZALEZ SANHUEZA JUAN IGNACIO', 8, 1, 1, 4, 'j.gonzalez.6', '$2b$10$noDh/39BUTyN/yPSDxkGmujTcAtrRpo1FzhdQkW/.GbXLAkR3V7ne', 0, NULL),
(360, 12178263, '4', 'GONZALEZ SANTANDER MOISES ALEJANDRO', 8, 3, 3, 4, 'm.gonzalez.4', '$2b$10$cFomaKwUznpxUFQRPuz5XeO71TjqavpOcoJ2meUY0YTyA/ktpw6B2', 0, NULL),
(361, 10320633, '2', 'GONZALEZ SANTIS MARISOL ANDREA', 8, 3, 5, 4, 'ma.gonzalez.2', '$2b$10$dGpeEVob6gkWparCKLG2oees2qV/UfNWjq.keGI.noDKoxbM6yIo6', 0, NULL),
(362, 14245583, '8', 'GONZALEZ SERRANO ELIANA DEBORA', 34, 2, 5, 4, 'e.gonzalez.8', '$2b$10$5zJUAfC47M16R2wQuy/MJuuEyHSqGr0XoTAbkDH8yCJn9hpM3U7ta', 0, NULL),
(363, 13772393, 'K', 'GONZALEZ VILLEGAS GEOVANNA MARIBEL', 26, 3, 3, 4, 'g.gonzalez.k', '$2b$10$SNYVuSyub0N/PbYTnWHRkO/iN2pJJCcVVeL2VybjJUWa8rgXdokKS', 0, NULL),
(364, 13020792, '8', 'GORIGOITIA OLGUIN JUAN ALEXIS', 64, 2, 1, 4, 'j.gorigoitia.8', '$2b$10$r6J.T5Zzs53iF8cW7dX02u3KeeXrnNbw6xB60Ba/jnrjxbPbLpJQq', 0, NULL),
(365, 25517556, '4', 'GUACARAN ROMERO DOUGLAS OMAR', 25, 2, 2, 4, 'd.guacaran.4', '$2b$10$IgdxFqvu4nOypp2TSQQWYep794QJp7P2I4vp0m1A.UieiFE97M1/G', 0, NULL),
(366, 17081765, '6', 'GUERRERO AGUIRRE PAZ FERNANDA', 22, 3, 3, 4, 'p.guerrero.6', '$2b$10$VYpk7Icc6jJq./f6QfQpieraWuHtbCn8a0lvJ1sSlKY8fs6v3Ij86', 0, NULL),
(367, 11608054, '0', 'GUERRERO CAULLAN CLAUDIA FABIOLA', 8, 3, 3, 4, 'c.guerrero.0', '$2b$10$1eHsGX0Ohj/GTqayCM22UOXBOURqSEn7OHkdD5pmHkHEREa4u2pTS', 0, NULL),
(368, 17062258, '8', 'GUIÑEZ SANHUEZA ARIEL ESTEBAN', 7, 2, 1, 4, 'a.guiñez.8', '$2b$10$ovfU.x2Ac1ta8A3Yk1Gy9enpJ7Igk51LIL68wIhYvQwU/xfocdyBW', 0, NULL),
(369, 16627520, '2', 'GUTIERREZ DE LA CRUZ KARINA ANDREA', 24, 3, 1, 4, 'l.gutierrez.2', '$2b$10$/gV9epd0XJuS4/U88Ey5L.sptbZM5XfGtCFLow17YRyjFs5NWV87K', 0, NULL),
(370, 18777848, '4', 'GUTIERREZ NUÑEZ CATALINA IGNACIA', 25, 2, 1, 4, 'c.gutierrez.4', '$2b$10$ploPI/UveudJ.k7s8fvA1OfYW8budMeNGgPcCmPEsSmuiN5bGy/V2', 0, NULL),
(371, 19412957, '2', 'GUTIERREZ ROJAS NICOLE MIREYA', 25, 2, 3, 4, 'n.gutierrez.2', '$2b$10$cSlobY4hwchrnUcYxqACG.zUroZ3WGHhKFRMg/s8i4NzO8Zg.o2yG', 0, NULL),
(372, 21175445, '1', 'GUZHNAY FLORES JOSE DAVID', 40, 2, 2, 4, 'j.guzhnay.1', '$2b$10$CzCTEjAg4AJeZ.RavWIK3epNfwHYIzWcMkJLPBNLZc1xzHX.xK5HC', 0, NULL),
(373, 16727768, '3', 'GUZMAN CERDA CAREN PAOLA', 51, 2, 1, 4, 'c.guzman.3', '$2b$10$G3dZmqO/CcMX7ieENyn4TOI7CtJCEIi4fU1EDCvfO69R96yTRK6V6', 0, NULL),
(374, 6203593, '5', 'HENRIQUEZ GUTIERREZ JUAN OSCAR', 8, 3, 2, 4, 'j.henriquez.5', '$2b$10$zFs6DsmX.SU35zBVOiYxA.FBkmgVN33zfmgYIVycTM5xBgd88QXMq', 0, NULL),
(375, 15624005, '2', 'HERNANDEZ BLANCO LORENA ANDREA', 1, 2, 3, 4, 'l.hernandez.2', '$2b$10$asEHn1NICzy9Iz3PqTyLj.pVatd/cIvdEsYNyCfjQa.7hR5QaINuS', 0, NULL),
(376, 17600454, '1', 'HERNANDEZ CACERES DANIEL JESUS', 13, 4, 2, 4, 'd.hernandez.1', '$2b$10$pcw1zOOwGIm5gVEX67e.d.GpantY30IKBry.Ui3lqGQqkTKapsVim', 0, NULL),
(377, 17986598, 'K', 'HERNANDEZ DIAZ ELIAS FELIPE', 25, 1, 5, 4, 'e.hernandez.k', '$2b$10$gATvDC6mt5w7JFK3s1zXZ.xxBM0PHv7.0fr/LwCpK59WH/fAafyKG', 0, NULL),
(378, 25839124, '1', 'HERNANDEZ GONZALEZ HONORIO ANTONIO', 8, 2, 2, 4, 'h.hernandez.1', '$2b$10$uCf3UP7eXeu1dkw0R6dbS.HwCpcZLoxWwLnls37AauPc0.MKZ3yCS', 0, NULL),
(379, 7997269, 'K', 'HERNANDEZ GONZALEZ MARIA EUGENIA', 3, 3, 3, 4, 'm.hernandez.k', '$2b$10$hhYcQahqm1HtbMBzvu0wOutyWSroO0bwlZd7ztWmZm5cymLhyhGaO', 0, NULL),
(380, 9900163, '1', 'HERNANDEZ JARA LAURA DEL CARMEN', 16, 2, 3, 4, 'l.hernandez.1', '$2b$10$F1wEGXU97CSO7/2Dj6.qNe0ULtTYzypaYNbK.j/C.fWTv/6WCa3u6', 0, NULL),
(381, 15381267, '5', 'HERNANDEZ LUCERO EDGARDO JOSE', 29, 1, 1, 4, 'e.hernandez.5', '$2b$10$6MAs4bO99nwlzll6xg88qegZ146LomhmiL099r2EyzfsIR/7KWEKm', 0, NULL),
(382, 12053355, 'K', 'HERNANDEZ MAULEN ANA MARIA', 19, 3, 3, 4, 'a.hernandez.k', '$2b$10$0.ezQWzdFrhSiNXHTf6jYeXsLgmLMWUbgy0mf.BqffCQ5kJnfiZW2', 0, NULL),
(383, 16128358, '4', 'HERNANDEZ MOREIRA MARIA ANGELICA', 3, 2, 3, 4, 'm.hernandez.4', '$2b$10$D9llCUKVDt3W25CPQqpir.VHHqirUnM2AQ2vn6lariK5Bqp1HqEmy', 0, NULL),
(384, 6579873, '5', 'HERNANDEZ MORENO JUANA ENEDINA', 25, 2, 2, 4, 'j.hernandez.5', '$2b$10$4nnlKVMlNwDsCMk55JPlj.zCtiK4rLXLB4ooMSUuZvBbsK9e2dhgm', 0, NULL),
(385, 26541996, '8', 'HERNANDEZ PEÑA ALEJANDRO JOSE', 8, 2, 2, 4, 'a.hernandez.8', '$2b$10$LfyJBwPzFV4Ev.culcTxduaMxBSGPxD81bGNRwMuL7o5lygjjgSCm', 0, NULL),
(386, 10618891, '2', 'HERNANDEZ TOLEDO MARIA PILAR', 35, 3, 1, 4, 'm.hernandez.2', '$2b$10$3HopFUdYET40NbtBobd/4e7mbaJJDkQecjXHgTFXlEOsJdB2GC/0q', 0, NULL),
(387, 17986813, 'K', 'HERNANDEZ UTRERA DANIELA DEL CARMEN', 22, 2, 3, 4, 'd.hernandez.k', '$2b$10$phq5CVXopBhdNcdEyPpkd.XcxB3a2AonfqZ0gfm6lsTLydqSKVfgW', 0, NULL),
(388, 15623251, '3', 'HERRADA AMPUERO BARBARA DEL CARMEN', 15, 3, 3, 4, 'b.herrada.3', '$2b$10$UEoaJtuKqnFNPYoxU1a5nu4ZfinwJBxgL1vhVCuMraFYTau4bbI0e', 0, NULL),
(389, 14379712, '0', 'HERRADA VALLADARES JUDITH PAOLA', 15, 2, 1, 4, 'j.herrada.0', '$2b$10$MMat/u/wigSOk/ks/A4pnO.ntU0dZpQue/lnwebkPmLE475KnO8ii', 0, NULL),
(390, 7629363, '5', 'HERRERA BELMAR MARIANNE DEL PILAR', 62, 2, 1, 4, 'm.herrera.5', '$2b$10$d1oQXCnzzfuC/KTvKbnNiOzMhyFYEXFNtFgGaQe62fNeV4jIpUAGO', 0, NULL),
(391, 17517907, '0', 'HERRERA BUSTAMANTE SERGIO HUMBERTO', 13, 4, 7, 4, 's.herrera.0', '$2b$10$e33kGU9Bt3zJF1RQWOT5Keg8nJr2B8Pu4DlWMBtN7XDpHRprDCFHO', 0, NULL),
(392, 13085577, '6', 'HERRERA FIGUEROA JORGE ENRIQUE', 65, 2, 1, 4, 'j.herrera.6', '$2b$10$L4Ykx0/PZ5JAHtDEjijIIuy4zUZq7DNjMiaus/hlxJub1eGG5D7HS', 0, NULL),
(393, 18930164, '2', 'HERRERA SANDOVAL MARIA JOSE', 11, 2, 3, 4, 'm.herrera.2', '$2b$10$EPC3Aa33Wy2/bCm6Z/1QluzM1OulXmD1q52HN9eOs93eUm/Mgyh3K', 0, NULL),
(394, 26014669, '6', 'HERRERA SARCOS ERWIN JOSE', 11, 2, 2, 4, 'e.herrera.6', '$2b$10$VF5nM4FpGJzggHdvLcu2DeAnXjxr6F.UHm8XZ3gQomqKCITPeJ742', 0, NULL),
(395, 14485682, '1', 'HINOJOSA ACUÑA PATRICIA ANGELICA', 8, 3, 4, 4, 'p.hinojosa.1', '$2b$10$p0z567UcvOqOsKhFqIhQb.8hCdXH8BYFNqqBAN7C2csEZMKTI64Aq', 0, NULL),
(396, 16290674, '7', 'HINOJOSA CORNEJO DENISSE CAROLINA', 9, 2, 1, 4, 'd.hinojosa.7', '$2b$10$y3AmDJWI/zSO4AvFQ6MxC.nRUDsdm2tSxkASKlg.TF8SNsSOaurCW', 0, NULL),
(397, 17285888, '0', 'HINOJOSA TRUJILLO JOSELYN NOEMI', 8, 2, 3, 4, 'j.hinojosa.0', '$2b$10$80zwvolkJNv.DHQc8XtVC.Rc8uw3E4DGQPZ1a6n9lUs54f29yEbaK', 0, NULL),
(398, 17956885, '3', 'HOJMAN JIMENEZ JOSEFA IGNACIA', 13, 4, 2, 4, 'j.hojman.3', '$2b$10$b7/PUgGHaKXg5soadrdUSeideGkORvXf40XOmJYWuEu8XrlwmA.Se', 0, NULL),
(399, 25865040, '9', 'HOMSI SABEE MARIA ANTONIA', 17, 2, 2, 4, 'm.homsi.9', '$2b$10$mgeevjoGvaEO8pNIYANnju8Z0ZZIPRw64fC3GkEYOi4nq6d6F8OW6', 0, NULL),
(400, 17733090, '6', 'HUERTA MEDINA CAMILO RICARDO', 39, 2, 1, 4, 'c.huerta.6', '$2b$10$SJAVR/UkoxvWjyGt6bXFZeGTWFy.8bj1KCwkbmnBVOw/.jeuq5HhW', 0, NULL),
(401, 20325628, '0', 'HUERTA TORO VICTORIA FERNANDA', 21, 2, 3, 4, 'v.huerta.0', '$2b$10$F8NA9VP7GAYsHax7ohbvFOX13x48y8YgZAEnzlFlirQxhr0FElTa6', 0, NULL),
(402, 18869522, '1', 'HURTADO CERDA PATRICIO EDUARDO', 25, 2, 3, 4, 'p.hurtado.1', '$2b$10$bFe0ggjLYxeFAN0M.kXX4eulPK3QR6X4aaHuCW1rFomcH4hO3mH/u', 0, NULL),
(403, 18465873, '9', 'HUSSEIN ROJAS NAYIB IGNACIO', 13, 4, 7, 4, 'n.hussein.9', '$2b$10$bxFo.jooG8J7cfWMYIs3o.e5G2Ml2myHnzIFEUK6czWte/qxRY8.q', 0, NULL),
(404, 15866877, '7', 'IBAÑEZ NEGRETE SUGEY MAGDALENA', 8, 3, 3, 4, 's.ibañez.7', '$2b$10$tegWDluqm3gEugnfITkda.75Y0WdGQiRksDz27qvDfIr4g9koDYEq', 0, NULL),
(405, 25876195, '2', 'IBARRA SANCHEZ RUBEN ALEJANDRO', 28, 2, 2, 4, 'r.ibarra.2', '$2b$10$zL51uo0G6tSzvVzqWolykuliX52GM6AzvnaxmAMedq2UxRollT9Wi', 0, NULL),
(406, 18084655, '7', 'IBARRA TORRES JUAN PABLO', 13, 4, 7, 4, 'j.ibarra.7', '$2b$10$DL3d86eX3FrMW8GiSMYjw.rfPHtbFgCl5xIobZJ7p5XWRC4T28jiW', 0, NULL),
(407, 9249212, '5', 'INOSTROZA GARATE JAVIER ANTONIO', 30, 2, 3, 4, 'j.inostroza.5', '$2b$10$8Mt002obxem4T/5UgKpbHuoTPwqT5.a8SYj.j2.HVQ6GqRVfCsGIu', 0, NULL),
(408, 9825515, 'K', 'IRRAZABAL BUSTAMANTE HORTENSIA INES', 7, 3, 3, 4, 'h.irrazabal.k', '$2b$10$qSzsTxKAYM2Xq5aUpo15/uQzGUFmICR68h9tQGONK6V2bdJiB9vmS', 0, NULL),
(409, 18361484, '3', 'IRRIBARRA MOLINA CATALINA BELEN', 7, 2, 1, 4, 'c.irribarra.3', '$2b$10$sJWau5GozmUOylic1/roSemalV/bOi2z5gdJuzyGXlLgHxEFGfn0W', 0, NULL),
(410, 19181363, '4', 'ISASMENDI GOMEZ ALMENDRA GEANELLA', 21, 2, 3, 4, 'a.isasmendi.4', '$2b$10$r1HSkb0Sl3Mp90FFRsiD5OeXentcZ6P2tJj2NgUN6qUyoAygYI9je', 0, NULL),
(411, 12058123, '6', 'JARA AYALA HAMILTON RODRIGO', 35, 3, 1, 4, 'h.jara.6', '$2b$10$bK0FZzi5o5lwcQtW7tpoiuxD819mPh8z0j3XekPbr9ROpLTVdvijS', 0, NULL),
(412, 14007835, '2', 'JARA MORALES MIGUEL SEBASTIAN', 4, 2, 1, 4, 'm.jara.2', '$2b$10$V6mTS1nRuAZxsE7WDUVJkOrT5BRth0XYYeVCMdsnHHrt6eLqD1C6y', 0, NULL),
(413, 11607947, 'K', 'JARA SILVA IRIS MALFISA', 11, 3, 3, 4, 'i.jara.k', '$2b$10$TJT3RQoRrRoEmcp3k1k9E.h4kFfsxa4TdssZF656/98i/qfpBjZPq', 0, NULL),
(414, 15404230, 'K', 'JARA VIDAL MONICA ALEJANDRA', 30, 2, 5, 4, 'm.jara.k', '$2b$10$gp/k0eMjhr0eg12hY/QGIOZLg1gHXTfdtX/wWy/ycQ9qbcE.VlpR6', 0, NULL),
(415, 15623326, '9', 'JEREZ SANTIS NATALIA ANDREA', 19, 2, 3, 4, 'n.jerez.9', '$2b$10$flv..6i/mevvBvD7DoUO2eWmOx6EVLkBGwlE5PeJCZQvJJYj7.ogS', 0, NULL),
(416, 15867452, '1', 'JERIA FARIAS CLAUDIA ANDREA', 8, 2, 1, 4, 'c.jeria.1', '$2b$10$U6nOilmlt1DM6pWnejvMEOBPcGrT.1/2NOF2ovcTV2wTyKgZwEBsm', 0, NULL),
(417, 17307619, '3', 'JERIA JIMENEZ MARY FRANCISCA', 25, 2, 1, 4, 'm.jeria.3', '$2b$10$FWzZQBJ8SkGuhFpIYdpYC./YThwM7n3qdL/cEDYvsyzxBGz9OuZT2', 0, NULL),
(418, 17682599, '5', 'JERIA MARTINEZ DIEGO ANTONIO', 16, 2, 1, 4, 'd.jeria.5', '$2b$10$vEGvkHOt2Q2z86CBk9n6IedPCMjDvzWPi38DYgNJGcHD295ZCtyya', 0, NULL),
(419, 16006231, '2', 'JERIA ROJAS PAULINA ANDREA', 35, 3, 3, 4, 'p.jeria.2', '$2b$10$Gsv9GcSDq3EXiPGwOiSvduAUr60bETUNZng1oD01tr1EqarBMfz3C', 0, NULL),
(420, 15623514, '8', 'JIMENEZ CATALAN ADELA DEL PILAR', 32, 2, 3, 4, 'a.jimenez.8', '$2b$10$yzwBiXcj2IIIU0W590074.mP1il7DdRiKIwmQO7hKhdC1VhaedoiO', 0, NULL),
(421, 15642171, '5', 'JIMENEZ SANDOVAL VICTORIA GABRIELA', 33, 2, 7, 4, 'v.jimenez.5', '$2b$10$T1yoMg2mbXQq/vNTvkpRlO5vnGyJFENngWywQHnNJH4DgwmajwdNC', 0, NULL),
(422, 17825995, '4', 'JIMENEZ SOTO MARIA VICTORIA PAZ', 8, 1, 1, 4, 'm.jimenez.4', '$2b$10$TOcH8xx/osw6U9vhMrQU4ON6/ew4xZJ1WjhCMfbrROaq7cawUqHni', 0, NULL),
(423, 16339919, '9', 'JORQUERA ARANGUIZ MARIA PAZ', 36, 2, 1, 4, 'm.jorquera.9', '$2b$10$vZCl2HfIaq79K6ylrCWAQOH6Nok1a3XPJd1Vpp8fgmjU7tyyCDKS2', 0, NULL),
(424, 11608834, '7', 'JORQUERA FARIAS ELIZABETH DEL CARMEN', 35, 2, 3, 4, 'e.jorquera.7', '$2b$10$k1aZKU/N91aOMgvpBOULhOpv.vfIc77T.TBLSN5A5aiJTtF7jTsCy', 0, NULL),
(425, 14007479, '9', 'JORQUERA JIMENEZ NADIA KARINA', 43, 2, 5, 4, 'n.jorquera.9', '$2b$10$iGRlIMmSMGFTGDf3zq6yl.lkfT1cXkf0Si8FUMg827JQXrKYKZHiK', 0, NULL),
(426, 20604868, '9', 'JORQUERA LOBOS PAULA', 25, 2, 3, 4, 'p.jorquera.9', '$2b$10$UeTnO136g5AQvkyJ1hy4nu2jq0ptpeWq1XmlVZaj4Vzmlilkf5U/e', 0, NULL),
(427, 6523407, '6', 'KAGELMACHER CALE WOLFGANG CARLOS', 25, 3, 2, 4, 'w.kagelmacher.6', '$2b$10$mpeoDP3rF2wCnM/ppRrPmuOk9MW9zCkguD7jqfYJN.VmNUQp0MlaG', 0, NULL),
(428, 18080879, '5', 'KEPEC PEREZ IVANKA LUJBICA', 11, 2, 1, 4, 'i.kepec.5', '$2b$10$.Jl1gfcUVDYa6nd8FxHXo.TqtInHIyIZrDhWJJgdclDLPmxd7NsJu', 0, NULL),
(429, 15106446, '9', 'KLEIN ESCOBEDO JAVIERA IGNACIA', 66, 2, 1, 4, 'j.klein.9', '$2b$10$ZBYol3V0QWouHatJ.tco6.kQC5h2.0.c181Wi0WZRK/HttEKo0/9m', 0, NULL),
(430, 15648168, '8', 'LACOUTURE LOPEZ MARIE CLAIRE', 7, 2, 1, 4, 'm.lacouture.8', '$2b$10$pg1rIVoP0DO8I342m9LtzOCqdPkQqi55Px5Epo8ECAnSpIYtePC92', 0, NULL),
(431, 17766439, '1', 'LAILHACAR MIRANDA ERIK ALEXANDER', 18, 2, 5, 4, 'e.lailhacar.1', '$2b$10$Z.4w1G5M3Tmk4mQz9jkO2uAYBbKssfrr3tyqXw/P4Unr09VrEbOYK', 0, NULL),
(432, 17110195, '6', 'LANDAETA MUÑOZ JUAN IGNACIO', 47, 2, 1, 4, 'j.landaeta.6', '$2b$10$JNbJtLPWhb2CNYVP6nxQgeB5KgX/RbUF0Ybc6Pz89OoNCSOzG3DQC', 0, NULL),
(433, 27100746, '9', 'LAREZ PEREIRA MARIELYS JOSEFINA', 25, 2, 2, 4, 'm.larez.9', '$2b$10$h6eLXqRh/C747ecadfuJhuDX7yo7wY2OE.8zRzXtZPU4orcKHY5DO', 0, NULL),
(434, 14312850, '4', 'LATORRE MEZA JOSELINNE DEL PILAR', 51, 3, 1, 4, 'j.latorre.4', '$2b$10$IoXx8zrLXfuvli8y20H3GeKulUMWhA1BStQ2PtKa.2q3b.Jtl6dTS', 0, NULL),
(435, 18488253, '1', 'LATORRE TAPIA MARCELA CAROLINA', 7, 1, 3, 4, 'm.latorre.1', '$2b$10$zmKz4aR1wAjEQDgPOigNpefBPjnWm35xqP3Hb3Qm2uMxnvM2srdHu', 0, NULL),
(436, 17026594, '7', 'LAVANDEROS BRAVO VALESKA ANDREA', 13, 4, 2, 4, 'v.lavanderos.7', '$2b$10$XArlB5Vlw32i73bMHfUzzOAGxTmXm4FhxjWILgQIofCXFB7HR2zPy', 0, NULL),
(437, 12411892, '1', 'LAZO GUERRA MARIANA LAS MERCEDES', 44, 3, 5, 4, 'm.lazo.1', '$2b$10$x6zGY0ymTTGa9GXCgYEAaeD8BiYUtzBsHsNnbDOejfwdIkWv.u.Eu', 0, NULL),
(438, 25321391, '4', 'LEA PLAZA RODRIGO', 23, 2, 2, 4, 'r.lea.4', '$2b$10$Ei6lfjDNDItD6TFAAJGHMunSbBWpZfOdeEDUMkeC5qNMB6W/1bAfu', 0, NULL),
(439, 14245712, '1', 'LEON HERNANDEZ ANDREA DEL PILAR', 11, 3, 3, 4, 'a.leon.1', '$2b$10$0kh.3Yx7k5VKC2cmUHflP.z6DlM5W5fZNcMFC/K/408nPZ4uN8iiu', 0, NULL),
(440, 9894557, '1', 'LEON MUÑOZ CLAUDIO ROBERTO', 4, 3, 4, 4, 'c.leon.1', '$2b$10$Z9kaFmReKsFVm31fsFxp4.OZmfZep9dOVSX2YHMBHpED7ZiQPt8JW', 0, NULL),
(441, 9025809, '5', 'LEON MUÑOZ JUAN CARLOS', 41, 3, 5, 4, 'j.leon.5', '$2b$10$xaAPOiWz6rL.eaRQVh3sbex9FsNFLrKsXf8uI.6Vu.Ki/X2gMVxXC', 0, NULL),
(442, 9894541, '5', 'LEON MUÑOZ WALDO EUGENIO', 46, 2, 5, 4, 'w.leon.5', '$2b$10$oYxTHX2zj7q/j5hBwh/rIOzFGXcF8D/6ZywMe7Y.NqrccdT/3/fvG', 0, NULL),
(443, 13559621, '3', 'LEON QUINTANILLA MARIELA ELENA', 1, 3, 3, 4, 'm.leon.3', '$2b$10$KYprVdxuFVVDviRv178n5uqTBi.hxs1usXjE0Jys99wy2.bKf1wBy', 0, NULL),
(444, 17702999, '8', 'LETELIER HINOJOSA CARMEN GLORIA', 14, 1, 1, 4, 'c.letelier.8', '$2b$10$gx2IxjTZVIE9Wv/CBIpzVuo5sAfWFMpykGNHRLkuZddLTeGn5bpty', 0, NULL),
(445, 16505050, '9', 'LEYTON LEYTON LOYNS ARIEL', 8, 2, 1, 4, 'l.leyton.9', '$2b$10$aznZCZVRyqtSY5hbGak7p.ZcMSoYaBdyRR7R6Ly4jFcmUWQ27dQry', 0, NULL),
(446, 19069534, '4', 'LIZAMA JIMENEZ LIESELOTTE KARINA', 38, 2, 1, 4, 'l.lizama.4', '$2b$10$dmgTMQHGxjX6TrZoQO6BDO2jxk3mn8UxpOxVin655N.s0u7muPufm', 0, NULL),
(447, 16577780, '8', 'LIZAMA MIRANDA JENNIFER ROMINA', 19, 2, 3, 4, 'j.lizama.8', '$2b$10$CXZyk6uSkRYU728cLhfkyOIenafDZYgwJ50TCQx4hI/.qX3LrAZWW', 0, NULL),
(448, 24442290, 'K', 'LLANA BARZANA CAROLINA', 25, 2, 2, 4, 'c.llana.k', '$2b$10$SSuoJwoqOFrJkYl1Qe3jcecy9JX7IyDBfTzXfUpJ2Z2pjINCe8dUK', 0, NULL),
(449, 26599868, '2', 'LOGREIRA RODRIGUEZ RAFAEL ENMANUEL', 8, 2, 2, 4, 'r.logreira.2', '$2b$10$9QK.wWSxf0gBuY55W5Mb3eAtuBXd2VtSTEz88J9pvxhQkOa0E6ELi', 0, NULL),
(450, 18090203, '1', 'LOPEZ LEIVA FRANCISCA LORETO', 13, 4, 2, 4, 'f.lopez.1', '$2b$10$n2zk4QtLC00pxR3h5IEQLOAM2L4VrnmZKu/iBmw8rusrpQb28dDr6', 0, NULL),
(451, 19411712, '4', 'LOPEZ MALHUE LILIANA CAROLINA', 16, 2, 3, 4, 'l.lopez.4', '$2b$10$ZmxV9XuFfWoNOhc8WfDggOCUcTrQ73P7/KHtJoZZVoNYzLBfXB89u', 0, NULL),
(452, 18212424, '9', 'LOPEZ MERINO CAMILA FERNANDA', 46, 2, 5, 4, 'c.lopez.9', '$2b$10$Kip9wx1FP5smNL/ChGFspOtwrFBdggchlYvK6ZohVKKSIkzNderQK', 0, NULL),
(453, 25876293, '2', 'LOPEZ REBOLLEDO RICARDO VICENTE', 7, 2, 2, 4, 'r.lopez.2', '$2b$10$so/iVF64U4JoYxmzqZde2eWJppVpmmH0ggmx2EhjP0N0MJcW/ADxm', 0, NULL),
(454, 13559354, '0', 'LOYOLA ECHEVERRIA JUAN PABLO', 35, 2, 4, 4, 'j.loyola.0', '$2b$10$NelkdJoGrVq6alLWI0PFcuM1Ia4l7viUeUT9OwJBhYkUQL7n4tBwq', 0, NULL),
(455, 15865923, '9', 'LOYOLA RETAMAL KARLA ALEJANDRA', 21, 2, 5, 4, 'k.loyola.9', '$2b$10$i.xIdJHGpPKJZVHgeYCTTeaOWwR1vo5RStlcUuD2lXBOdtZ2Xw2ua', 0, NULL),
(456, 26652039, '5', 'LUZARDO MONTIEL MAIRA ALEJANDRA', 11, 2, 2, 4, 'm.luzardo.5', '$2b$10$4z763zHvpsbCXs1Q5Cx.t.mMw6BI7wM4ypGtN5JlVetS3ERavNRuy', 0, NULL),
(457, 13791575, '8', 'LYNCH ARELLANO RODRIGO ARTURO', 19, 2, 2, 4, 'r.lynch.8', '$2b$10$jbt0LSpwK5GCunuARzMEXuKr8vbh5zL1x0bjPPD51165BCXOw2F9a', 0, NULL),
(458, 26393976, 'K', 'MACHADO CORCEGA ODEMARIS MARIA', 24, 2, 2, 4, 'o.machado.k', '$2b$10$pxZC0vGK.tU41qm8RvYPyONpMZ42KPDsv60BM/2WUucOOWdt7GLai', 0, NULL),
(459, 17683773, 'K', 'MADRID CESPEDES ROMINA KAREN', 11, 3, 1, 4, 'r.madrid.k', '$2b$10$oz6115YO2CvW6ypTegX8pOQM5Djy1uzjlpfHirw7dlr.B3IUv2ukm', 0, NULL),
(460, 19067903, '9', 'MADRID LOYOLA KIARA CATALINA', 19, 2, 3, 4, 'k.madrid.9', '$2b$10$isc0oelB2tY62/ok7M5vMeCYHeGzXvOeiz4r/Cx.Zo0s9UCofBxke', 0, NULL),
(461, 18158452, '1', 'MALDONADO LANG MIGUEL ERNESTO', 13, 4, 2, 4, 'm.maldonado.1', '$2b$10$46k88Z/mvwms5bM/8yyEz.atOTGrBUcHRLz3r7Aep4vWclAI./Hw6', 0, NULL),
(462, 17399078, '2', 'MALDONADO MATELUNA DANIEL AGUSTIN', 31, 1, 3, 4, 'd.maldonado.2', '$2b$10$5yOzat3/FUbVeTN6tq5VturrHLgUY7TVJsIfHjpFIKJmUp4owaZGq', 0, NULL),
(463, 18487737, '6', 'MALDONADO QUINTANILLA NICOLE ANDREA', 27, 2, 3, 4, 'n.maldonado.6', '$2b$10$RfB.MUkG37Lh9.POb/bduecfEGAB6zBGRme5Hej12/uUFgMXXrMbm', 0, NULL),
(464, 15448019, '6', 'MALDONADO SALDIVIA GONZALO ESTEBAN', 31, 1, 3, 4, 'g.maldonado.6', '$2b$10$4swby7zT8gECq1DH0cbr9.kRE43VtgTG8aC/iJaBhzjXTvwOfM1xG', 0, NULL),
(465, 17986498, '3', 'MALDONADO VILCHES CECILIA CAROLINA', 31, 3, 1, 4, 'c.maldonado.3', '$2b$10$Sj8b7ze6SQboJZUCFmqXfuqfuRv1/5LJ7wqGFj/rRqmCyAFknIrCi', 0, NULL),
(466, 12178990, '6', 'MALLEA HUERTA INES DEL CARMEN', 31, 2, 5, 4, 'i.mallea.6', '$2b$10$ERSzJ5azDS7udrajLEfNUOK9xKKnW0pwNja/b83WIBtZoleNIeOiy', 0, NULL),
(467, 19067774, '5', 'MALLEA MUÑOZ MARIA DE LA LUZ', 25, 2, 3, 4, 'm.mallea.5', '$2b$10$6d7WsVd83e9ZDJnnuIAoSuDm/NSmU3fQzj7Z/Ke7FCngq2ArgMJSC', 0, NULL),
(468, 19069658, '8', 'MALLEA NUÑEZ CAMILA SOLANGE', 7, 2, 1, 4, 'c.mallea.8', '$2b$10$r/ZYDVcVJwS14B6ZMslB8.MlRRewyN5XF9bMDQbzXTwZ7FcfGQ1V2', 0, NULL),
(469, 9454217, '0', 'MANDICHE RUIZ OLGA OLAYA', 31, 3, 3, 4, 'o.mandiche.0', '$2b$10$eZ.vCgrF5965mQclMVU5P.EDOoY7au5QMsOuFoPNUm5u6IKx93.K2', 0, NULL),
(470, 19985247, '7', 'MANZO MUÑOZ MARIA JOSE', 55, 2, 3, 4, 'm.manzo.7', '$2b$10$7dxvvLJoHiZZiO4qz2epx.0gXad5pfxR7hqEsqwdX8zPjpUcGfZLW', 0, NULL),
(471, 19412226, '8', 'MANZO OLIVOS KAREN BEATRIZ', 22, 2, 3, 4, 'k.manzo.8', '$2b$10$PmpxK1RvowVcKsfyKGJTVeRIQtWm3mMkTnPIrNnV9qs3DY8jNf/Va', 0, NULL),
(472, 15585550, '9', 'MANZOR MORA FRANCISCA ELENA', 32, 3, 3, 4, 'f.manzor.9', '$2b$10$bn4P4aaH50kjHE1xaViOse2KYDbCHekq9S1ThTtcqOIEtpvIKAAoO', 0, NULL),
(473, 15352841, '1', 'MANZOR PIÑA EVELYN PATRICIA', 67, 2, 1, 4, 'e.manzor.1', '$2b$10$fM9A1fpE728I0IzoQ41yi.vhMh1YpcbHZh8a2uv6LaW6hUavbJGmq', 0, NULL),
(474, 18364934, '5', 'MARABOLI VERGARA ABIGAIL DEL PILAR', 16, 2, 3, 4, 'a.maraboli.5', '$2b$10$J.EGkgD3YOt1OIHuDqXHJOK6ZvvZICDl671Iks8Lad5VQiqngFq8C', 0, NULL),
(475, 18624745, '0', 'MARAMBIO CONTRERAS VALERIA ROCIO', 45, 2, 1, 4, 'v.marambio.0', '$2b$10$.qvyZP2vhaN5NorO9LNd.uf/PX7qEG.9DNTpCGCB1G6z0FwOMEQnK', 0, NULL),
(476, 11608173, '3', 'MARAMBIO FUENZALIDA ANGELICA ROMANÉ', 46, 3, 5, 4, 'a.marambio.3', '$2b$10$WLebn6MORxGDjaGa0dyZ6Opvx5lkK/0dReBKR/FZVXJoASBQafheO', 0, NULL),
(477, 15956992, '6', 'MARCHANT MARTINEZ ANDREA DEL CARMEN', 65, 2, 3, 4, 'a.marchant.6', '$2b$10$kfH/7/3baPeu9iAb14j2JO6aZasHTjH4FNUKieWyv3J9YEYex6kYW', 0, NULL),
(478, 11697022, '8', 'MARCHANT MORENO ISABEL MARGARITA', 32, 3, 3, 4, 'i.marchant.8', '$2b$10$hDdZysy6.1t/In.1BMg/f..X7Fm6VHWyXLSNNPRR/oBMBDTFEAlq2', 0, NULL),
(479, 8104610, '7', 'MARIN MUNOZ EMILIO', 14, 3, 4, 4, 'e.marin.7', '$2b$10$.6MLXpXb.xhB1SKoemDKF.3yHyusHesuFuZl2X.kNCSBNNCHFYPXy', 0, NULL),
(480, 13756787, '3', 'MARIN SEREÑO MARIA JOSE', 32, 2, 1, 4, 'm.marin.3', '$2b$10$CnjifR9ZtF8AzLgHu5ysEOYWrIRvypF26F1BNMQQgqL6sXjTW.lly', 0, NULL),
(481, 26686581, '3', 'MARTE SALCEDO JAINIANA CAROLINA', 8, 2, 2, 4, 'j.marte.3', '$2b$10$3EcGxllANEKAzVw05diYPOhflWLf1.bwTc2sc3u3VJgpRNe0nkF1K', 0, NULL),
(482, 16856262, '4', 'MARTINEZ ARTIGAS CRISTOPHER RODRIGO', 38, 2, 3, 4, 'c.martinez.4', '$2b$10$5P.Mp.hfX0AxeZA4t9sNQeigZtQDNxT1dXxPQ0c1yUaG55JYBXmaO', 0, NULL),
(483, 11696841, 'K', 'MARTINEZ BARRERA ROSA MARITZA', 7, 3, 3, 4, 'r.martinez.k', '$2b$10$8tsKq.oSAUhoseGB6LdmKuFngCpDnYy.XHUPmOvvRj3dilM9ZBnzu', 0, NULL),
(484, 11169882, '1', 'MARTINEZ CARREÑO ANA MARIA', 22, 3, 3, 4, 'a.martinez.1', '$2b$10$TVc.ZsY9jb34pUv7LuOtgONeCpg8/y89xEv.eVZQPnYFYkxg/M58q', 0, NULL),
(485, 10084246, '7', 'MARTINEZ CARREÑO SOLEDAD DEL CARMEN', 8, 2, 3, 4, 's.martinez.7', '$2b$10$Eg3HrZOb3QBJowpLXKB57OSdrEkAHFWzG8AG6h8mK7UHkYtOufNeK', 0, NULL),
(486, 13447965, '5', 'MARTINEZ MEDINA PABLO ANDRES', 46, 2, 1, 4, 'p.martinez.5', '$2b$10$2AssR3cNTQnTVk8jmDEwfOvhMkEsz.9VdmN8sp8urUpz6rkiiFrZ6', 0, NULL),
(487, 14208628, 'K', 'MARTINEZ STOCKINS SOLEDAD ANDREA', 11, 3, 1, 4, 's.martinez.k', '$2b$10$Ptu8pvxVEb0.WLvC3idy5eQpg3ImkQ0qr7OSiF134e6wZFpAY8uyS', 0, NULL),
(488, 16585530, '2', 'MARTINEZ VEGA GABRIELA ALEJANDRA', 7, 3, 3, 4, 'g.martinez.2', '$2b$10$9jmx0OcEJ6niLOQ3TShNpuQHb3Pv5rHlawSUOTMlsQrCCF/oGZlg.', 0, NULL),
(489, 18047918, 'K', 'MARTINEZ ZUÑIGA CLAUDIA ANDREA', 33, 2, 3, 4, 'c.martinez.k', '$2b$10$RLgg.iUlYlAEtc/3ASQg1OcozLY7UOmTwuD8r1psw10POMFhLRc8G', 0, NULL),
(490, 16290741, '7', 'MASSARELLI GONZALEZ ROBERTO AURELIO', 65, 2, 1, 4, 'r.massarelli.7', '$2b$10$0d4USjoqTU38SGuGCxty.uzdL5D0/PoFwJXJGcO8T7Em2dluM5wzm', 0, NULL),
(491, 11785615, '1', 'MATELUNA BARRA LUIS DANIEL', 4, 3, 4, 4, 'l.mateluna.1', '$2b$10$dwQm1iX.WliRx2LQWA675O93eQmlq2QxdzzhD/hLBEJlAzjdnppfS', 0, NULL),
(492, 16708589, 'K', 'MATTA VERGARA CAROLINA ANDREA', 11, 2, 3, 4, 'c.matta.k', '$2b$10$fBoSC.Y/HFSZTJrqF5QwsOhcygsJBP9Z.xDQwFkVavQW72B3F/hZa', 0, NULL),
(493, 17225662, '7', 'MATURANA SEPULVEDA JOCELYNE MACARENA', 8, 2, 3, 4, 'j.maturana.7', '$2b$10$9cgbRkMRkorYUG9nGYaHyOTMl3l9zNhCHR2//vgGJBnZu8pAH2Gam', 0, NULL),
(494, 18065643, 'K', 'MAULEN ZUÑIGA LESLY ALEJANDRA', 3, 2, 3, 4, 'l.maulen.k', '$2b$10$CcZA.0li70c1I9YHrsZHj.4j3mWaRoA1Q4g3.fVRp7du9ULQXhi8O', 0, NULL),
(495, 17398419, '7', 'MAUREIRA MATUS FABIAN HUMBERTO', 10, 2, 1, 4, 'f.maureira.7', '$2b$10$MelaPR9SgOvsNFKTpQrp8.IRkx/aZ./ghnNv3xTEKcgr9UX5cipd6', 0, NULL),
(496, 19412306, 'K', 'MEDEL MARDONES SEBASTIAN ALEJANDRO', 3, 1, 3, 4, 's.medel.k', '$2b$10$mGa3QJuGw1kWDbEf0ELk8u77fCt./CrIPGeomgg0AHkA0hiKYx8Ne', 0, NULL),
(497, 14007696, '1', 'MEDEL PALOMERA JESSICA ALEJANDRA', 7, 3, 3, 4, 'j.medel.1', '$2b$10$R6m2fhRJA1XT7vS9Ue5tHe10Ncv.YFynP5KgZDJMmVpt8RAbcL5aq', 0, NULL),
(498, 26858706, '3', 'MEDINA ROMERO ANDRES AVELINO', 29, 2, 2, 4, 'a.medina.3', '$2b$10$u1sBWd1/YQZv7iWQ5MdJNuxT8Pp4fJTSvbpprWLbS8sut1wAz1nv2', 0, NULL),
(499, 26667045, '1', 'MEDINA VARGAS DIEGO ENMANUEL', 11, 2, 2, 4, 'd.medina.1', '$2b$10$WyUbXWaEAs69FBJdHG1WvO5iZagEH08evRAQkSyYLrd61DPY7jK6.', 0, NULL),
(500, 9504550, '2', 'MEJIAS CARRENO FANNY EVELYNE', 25, 3, 2, 4, 'f.mejias.2', '$2b$10$I1Er4Re1ii/.EzhpL7it3eDbt3a8cWqs8upl8ex2CIzRuI89/3LBi', 0, NULL),
(501, 19067657, '9', 'MEJIAS ZUÑIGA NICOLAS EDUARDO', 10, 2, 1, 4, 'n.mejias.9', '$2b$10$KrZn/GfQaPOzwO07J/SfCO3494.Cy3z5jpegQipQ0uXysXkwDqMBW', 0, NULL),
(502, 7113141, '6', 'MELLADO NUÑEZ JOSE ALIRO', 4, 2, 4, 4, 'j.mellado.6', '$2b$10$tEO9V3Y8PRXqeuXDMED78.Ex4F1ya8nhFExsYyBG07GUqt2pRPnfK', 0, NULL),
(503, 12799273, '8', 'MENA HERNANDEZ MARIO FERNANDO', 4, 2, 4, 4, 'm.mena.8', '$2b$10$ZrMZDIgnd/M/Yg1sknly2OWp1hZZ7DkWMjM0QTMvfs1.xYEUht.MC', 0, NULL),
(504, 11944300, '8', 'MENA JARPA INGRID ALICIA', 8, 3, 1, 4, 'i.mena.8', '$2b$10$5rNn2NlmLLr.HKjrlHqi2.GaI93P80ZGS5BaK1wDDYueSF/.XkAT.', 0, NULL),
(505, 14007722, '4', 'MENARES RAMOS ELIZABETH SOLANGE', 16, 2, 5, 4, 'e.menares.4', '$2b$10$a.hY9RynyXHkBAILHjKwou4q/rv22uN12t7mfVkEWrrYIBfc12R7.', 0, NULL),
(506, 8712417, '7', 'MENDOZA DIAZ JAIME MARTIN', 40, 3, 2, 4, 'j.mendoza.7', '$2b$10$O.PLx7U3whkdRRpIhU24MuXeK8ldoxPDarxKu3d.ogVTGVCiHzxTm', 0, NULL),
(507, 15616510, '7', 'MENDOZA PEÑA MARIA JACQUELINE', 8, 2, 1, 4, 'm.mendoza.7', '$2b$10$6XRZmpERfnGBGqfVQi/YJeZbWWrK7uruqJl2ErO37Tr11JipnUjNW', 0, NULL),
(508, 17682839, '0', 'MERIDA VARGAS ERNESTO ARIEL', 32, 2, 1, 4, 'e.merida.0', '$2b$10$TeF0QOKYzBZ6yiB0aDQ2neWxo9MF48V7X2sYKm9m3lBrkekztDgaW', 0, NULL),
(509, 18777663, '5', 'MEZA LEON CRISTINA DE LOS ANGELES', 1, 1, 3, 4, 'c.meza.5', '$2b$10$DIsnYfVfL.IQLBsGdLq8oewh/Ywa46ui0lHeqFlvZmhLAbfn2m5Q2', 0, NULL),
(510, 12411514, '0', 'MEZA MATELUNA MAGDALENA ISABEL', 21, 3, 3, 4, 'm.meza.0', '$2b$10$fKm8cR3Enn1BivLyAJIGWO7Ha8IhoQ6fScYxOa4H821nJmjK87I5u', 0, NULL),
(511, 12799250, '9', 'MIRANDA BULBOA MARCELA PILAR', 14, 3, 4, 4, 'm.miranda.9', '$2b$10$TEBbWthU5R0i6BCEbpwmwOldUb2O0o6YFrnXBHrjt9hoTJn6ydp8C', 0, NULL),
(512, 15622843, '5', 'MIRANDA CATALAN FLOR ANDREA', 8, 2, 1, 4, 'f.miranda.5', '$2b$10$vqE7esRkatmNmaC6HW5AkevEqE0u6NQ70Sr0ZdE9ApVbcCXRNy9IO', 0, NULL),
(513, 16291728, '5', 'MIRANDA MANZO JAVIER FELIPE', 10, 2, 3, 4, 'j.miranda.5', '$2b$10$MTFTw0hihSaDVLW52phuzOcrW7jDn/pWX4OrqFnYpCRQUASHCpFgy', 0, NULL),
(514, 18654383, '1', 'MIRANDA ROSAS VALENTINA DELIA', 39, 2, 1, 4, 'v.miranda.1', '$2b$10$g3ZJxISxJMnX3dCMGUgHCuvx0FDC.KWASFm0YBiiOY1nUZzeSF.Py', 0, NULL),
(515, 17354845, '1', 'MIRANDA TOBAR GONZALO ANDRES', 16, 2, 1, 4, 'g.miranda.1', '$2b$10$8.AsypfQPjnLPl7ZYeKuXOmng7ywE06xRBDtoap6EkBPf2Ly73lju', 0, NULL),
(516, 19404693, '6', 'MIRANDA TORO TABATA YERALDYT', 14, 2, 3, 4, 't.miranda.6', '$2b$10$tiwm9PEp0/Kh4orV200TnuldblOxh1uu97fYeUWjb1jvtXqFTC3.q', 0, NULL),
(517, 17148854, '0', 'MIRANDA VERA FRANCISCO FABIAN', 38, 2, 1, 4, 'f.miranda.0', '$2b$10$nIAmRsEAbDp/fYGcVjtxGOzixQrF68YXWwRbsE5a2ohz188fli7jC', 0, NULL),
(518, 13772555, 'K', 'MONDACA ARCE BERNARDA CARMEN', 21, 3, 3, 4, 'b.mondaca.k', '$2b$10$FURxy2VtRlM.7RXJIVrl.u7iw1baew9k5egPLYUYX22oRYqRsZ/AK', 0, NULL),
(519, 16740828, '1', 'MONDINO BARRERA IVORY MANLIO', 68, 2, 1, 4, 'i.mondino.1', '$2b$10$y2Kz6vAYaDX7p2qYq1vtLO79jfv4yIRtcJlqd2ZAwzMPDPSBM1ev.', 0, NULL),
(520, 16952844, '6', 'MONSALVE ARCE GLADYS NIVIA', 11, 2, 1, 4, 'g.monsalve.6', '$2b$10$VasQTYcsjXAhHahW6z46peSCzOlVWnC.EsSq2IulYcKAs8ePXS1HW', 0, NULL),
(521, 19068239, '0', 'MONTENEGRO SILVA GERALDO ESTEBAN', 32, 2, 3, 4, 'g.montenegro.0', '$2b$10$GZhzSRuota4oFDlLFanCLOtLIidITA5CJXeClgeFj0MIU79vS7PLW', 0, NULL),
(522, 27171791, '1', 'MORA GODOY KEURIS YOVANESA', 11, 2, 2, 4, 'k.mora.1', '$2b$10$PZQd5gFn7POvDOBaG9.UkuZb5N4h1aiiYYC4pcXLdCOEVQs14mSI6', 0, NULL),
(523, 9286337, '9', 'MORAGA VILDOSO JOSE BERNARDO', 7, 3, 1, 4, 'j.moraga.9', '$2b$10$TwijV1MrPvDOyiBOBXyhHOK4KzMV4V3KhhLEnMwUsxKiBC95LV0WC', 0, NULL),
(524, 16090734, '7', 'MORALES ADASME CLAUDIO ANDRES', 69, 2, 1, 4, 'c.morales.7', '$2b$10$mVCTQBXrn50IhiCp0fD21.kBtiEL6iVOtfTQD2qZZpjmRq8Pin93C', 0, NULL),
(525, 13705496, '5', 'MORALES CASTILLO PRISCILLA SCARLETT', 54, 2, 1, 4, 'p.morales.5', '$2b$10$0VIOvaRmDQJyZ0sDH5/3RuaTNuIYnKNDbjmkqM1Sn7GY./RgX.S4i', 0, NULL),
(526, 16292214, '9', 'MORALES JORQUERA MARIA DE LOS ANGELES', 43, 2, 1, 4, 'm.morales.9', '$2b$10$5aXTsqwcYcG9LH8WegqQDOZ3jaQdQgCesqCIBBiKGWm/McVhNWdEe', 0, NULL),
(527, 16577502, '3', 'MORALES JORQUERA MIGUEL ANDRES', 25, 2, 3, 4, 'm.morales.3', '$2b$10$3yAfaA5af4YdC.Kf.49LI.3vKNDZWhV5wr64Th9eaLUDi5pR6Wo9q', 0, NULL),
(528, 19646495, '6', 'MORALES KULM GONZALO ANDRES', 13, 4, 2, 4, 'g.morales.6', '$2b$10$nCRcZdjuX5W8Rc0w83Y8oetbdl5OsiDSEouKzV58Rxnok5H9Qhjci', 0, NULL),
(529, 8358998, '1', 'MORALES MEZA EDUARDO MOISES', 8, 3, 2, 4, 'e.morales.1', '$2b$10$/NvFA6fc1zbBPY3uBmoy/eS5yNp2OdRnEEh9r2eA43O.TNtVeOjvS', 0, NULL),
(530, 18487931, 'K', 'MORALES VALDEBENITO PAOLA ANDREA', 22, 2, 3, 4, 'p.morales.k', '$2b$10$/a8NKHm1lhVzEJTew9xQpO6GEyBhlXppz2IySFOhB5U7p15QRgfL6', 0, NULL),
(531, 17986544, '0', 'MORENO CALDERON LUIS OLVALDO', 4, 1, 4, 4, 'l.moreno.0', '$2b$10$yQy47ZRpFkNzlppre1/5.ezTNf4Sh.GyGo6nTraI1N6Yo9ogeuDPe', 0, NULL),
(532, 17188979, '0', 'MORENO MIRANDA DANIEL ELIAS', 19, 2, 2, 4, 'd.moreno.0', '$2b$10$N3qnPxN16ImiXidk92J8de5tVbJT8mKWya62qkZT0zZ/Dsi26JbeC', 0, NULL),
(533, 26340161, '1', 'MORON GONZALEZ YANELLYS DEL VALLE', 17, 2, 2, 4, 'y.moron.1', '$2b$10$/5jvtIwOLW5tIzA190x3N.cL.4l99zg4N9Bpt0W6kI8pghlOcknia', 0, NULL),
(534, 16290957, '6', 'MOYA VALENCIA ALEJANDRA MATILDE', 58, 3, 5, 4, 'a.moya.6', '$2b$10$JsMKoYfQ.oWuWRwC8ACE8OA6FaADWRblIebSharPuDU.gGGoWLKua', 0, NULL),
(535, 16531109, '4', 'MUENA VEGA PATRICIA ANDREA', 13, 4, 2, 4, 'p.muena.4', '$2b$10$BG2DVSmdWQEcImrqKDlQ5.nc7TThWOYfwhnkmMaBNb/vT3rcazwvC', 0, NULL),
(536, 16297678, '8', 'MUÑOZ ARAYA KAREN LORENA', 31, 2, 3, 4, 'k.muñoz.8', '$2b$10$7/oy2FwmAHoewHvQNlPtLuvJ7WVsGQne75NdNS/H.zf.QvBXg3Xla', 0, NULL),
(537, 15404562, '7', 'MUÑOZ CANALES PATRICIO ARIEL', 19, 2, 1, 4, 'p.muñoz.7', '$2b$10$mbXa/p9owN9q00pStgymb.o6BfRq0CzVSXjFnKJQYYg8QtmQlQgL.', 0, NULL),
(538, 16213745, 'K', 'MUÑOZ CAÑETE SILVANA PATRICIA', 70, 2, 1, 4, 's.muñoz.k', '$2b$10$M5O.uDAUnvJVFtljC/irSepNj8MQd5ThFBzmhgPe4yjsl0RtHDnFS', 0, NULL),
(539, 11697627, '7', 'MUÑOZ CERON PAOLA PILAR', 71, 3, 5, 4, 'pa.muñoz.7', '$2b$10$6fGRAODHt8L7cY.dGUAe3e2H0YBECrSdR4A.FB4NOsvjfjkY72fHW', 0, NULL),
(540, 16224595, '3', 'MUÑOZ LEIBUR PIA DE LOS ANGELES', 35, 3, 1, 4, 'p.muñoz.3', '$2b$10$Wi9XpcBfUrA8cCcZeQlobuPIs7.Rt85BxKVxFtyvD5DGh6Cnk/5LS', 0, NULL),
(541, 17660445, 'K', 'MUÑOZ MARTINEZ SEBASTIAN LEONARDO', 8, 1, 4, 4, 'se.muñoz.k', '$2b$10$7eCm2n5welfN7D9W6iX5LOueDPszl0mUDGJcBwnxAQrvAhITXZf5i', 0, NULL),
(542, 18576393, '5', 'MUÑOZ NEIRA BARBARA SOFIA', 13, 4, 2, 4, 'b.muñoz.5', '$2b$10$85DVz424E6XJpgJDh2wU5OkfVLBKF2uMW9sM2vc7eafPPAkGiwspy', 0, NULL),
(543, 9005088, '5', 'MUÑOZ QUIROZ ALEJANDRO BURIAM', 72, 3, 1, 4, 'a.muñoz.5', '$2b$10$5oN9/7BtvwCK6htbWJSiQu3E16Iqd9eyD27l9KXg3aXbPZSRxv7QW', 0, NULL),
(544, 18061040, '5', 'MUÑOZ ROSSO MACARENA', 31, 1, 1, 4, 'm.muñoz.5', '$2b$10$8Q70yVOFYGcTW4w8vfiwLuFoNuKNq1/dZkRc7rLluWP/o53ckgW06', 0, NULL),
(545, 9728357, '5', 'MUÑOZ SANTIS CRISTIAN ANTONIO', 4, 3, 4, 4, 'c.muñoz.5', '$2b$10$OivDKoOhrAmAMgAkMLYxQu5GYEnb6IT2gn1BuWWeY7NMt4ai1cwCW', 0, NULL),
(546, 15405684, 'K', 'MUÑOZ SILVA JORGE OMAR', 39, 2, 1, 4, 'j.muñoz.k', '$2b$10$jR00kf/XwAurVLMTzqVHzu1M85qythVG8ldEHAwdw63NMv0m7ZJm.', 0, NULL),
(547, 15794870, '9', 'MUÑOZ VERA LORENA ANDREA', 32, 3, 3, 4, 'l.muñoz.9', '$2b$10$RhjCL7QWua2wOfmfmawY1elXmZxhilrePVPnfN7KT.2sIw3YlRisa', 0, NULL),
(548, 17957063, '7', 'MUÑOZ ZAVALA TAMARA ALEJANDRA', 33, 2, 7, 4, 't.muñoz.7', '$2b$10$QUoBni78deES/QABjUkwZOZb64vYUo9zY9PWPoz/egyiwnwq9kjfe', 0, NULL),
(549, 11781106, '9', 'NANCUCHEO PAILAHUEQUE ERODIA ESTER', 19, 3, 3, 4, 'e.nancucheo.9', '$2b$10$yGo1SmQk/te7.74RSZSurO7F2Lfl89AyyoU7RH81Dw7MDaAelXbbi', 0, NULL),
(550, 16292280, '7', 'NAVARRETE LOYOLA RAMON ANTONIO', 46, 2, 5, 4, 'r.navarrete.7', '$2b$10$iObWZwI3NH01LQPhCSXtB.6vYtBDxS52pXPJLUoWE6D72BE9d0OTS', 0, NULL),
(551, 26347218, '7', 'NAVAS BEROES RONY ALFREDO', 8, 2, 2, 4, 'r.navas.7', '$2b$10$hhVQ3JXPCRltQpxEflVY5u9FjcRQdDReA3Kp5o/F9WAK3UOAgBex2', 0, NULL),
(552, 25533004, '7', 'NAVAS PINEDA DESIREE DENISSE', 25, 2, 2, 4, 'd.navas.7', '$2b$10$Jf09NNf/PfXa4ACSWOe/P.wABPH4EYRlCcr24rgBd2YhGxZzj/Hvm', 0, NULL),
(553, 15744248, '1', 'NAVEA NUNEZ JUAN LUIS', 73, 2, 1, 4, 'j.navea.1', '$2b$10$ifoKxE3VGV4t8JF57B4aNeoRmc8AC1x1PuV3ASXD2HC2rhIB/gbQC', 0, NULL),
(554, 13772711, '0', 'NEGRETE JIMENEZ MARIA ANGELICA', 19, 3, 3, 4, 'm.negrete.0', '$2b$10$xweVO.RM9zMr7rUZT4sBN.hregNPGl8SBL./CCL1fFhtVsV9W1cdy', 0, NULL),
(555, 19412165, '2', 'NEGRETE JORQUERA FELIPE ARTURO', 13, 2, 2, 4, 'f.negrete.2', '$2b$10$MtJSXnmxAJEktmBZlpXaXe8IpO8fNbN7GjSkem4XQo38h8HaOlive', 0, NULL),
(556, 10225346, '9', 'NILO ARTIGAS MARIA ALEJANDRA', 14, 3, 4, 4, 'm.nilo.9', '$2b$10$UQLYjy3u15aiZYXR5pSzL..v4lvar87TUh0byIhL24GQok12hhq2O', 0, NULL),
(557, 14696300, '5', 'NIÑO DUARTE ANA YELITZA', 33, 2, 7, 4, 'a.niño.5', '$2b$10$.LHTVE3U5AKce9cEKwm0JehGhVZCqKTptCE2N/S3ZimfXepTjufmy', 0, NULL),
(558, 16855363, '3', 'NUÑEZ CARRASCO CAROLINA VICTORIA', 11, 2, 3, 4, 'c.nuñez.3', '$2b$10$vmdX2UO7ZWnZp8oJ.wFYJuq9pBUXmV68/N4VhnH/.iY4k1q103OwC', 0, NULL),
(559, 18777807, '7', 'NUÑEZ CATALAN MITZI ROMINA', 8, 2, 3, 4, 'm.nuñez.7', '$2b$10$L3/0s7gGs7XF4cQd7XWguuMezvx3Af7Pp9waiIm9Gs5OZjie34Jim', 0, NULL),
(560, 17986382, '0', 'NUÑEZ GONZALEZ MARIA PAZ', 38, 2, 3, 4, 'm.nuñez.0', '$2b$10$fEqFGl7TmYnpzdtG0MPWz.2ilM/A3eClhIKgPU9JakHzya8Xpg2iy', 0, NULL),
(561, 11696892, '4', 'NUÑEZ IRRAZABAL MARITZA ELIANA', 3, 3, 3, 4, 'm.nuñez.4', '$2b$10$uClgCfUUlfUdAUNDGKpm1.1EytdSGRVeJTffkAHKD4bvcz6Aubnr6', 0, NULL),
(562, 8730397, '7', 'NUÑEZ LARENAS ANGEL CUSTODIO', 14, 3, 4, 4, 'a.nuñez.7', '$2b$10$N7oQiUKOv7IQ86kCpSRUNeoiN2L78/.J48ycboO00utO1Bcc4eHae', 0, NULL),
(563, 15566333, '2', 'NUÑEZ LEON CAROLINA DE LOS ANGELES', 14, 3, 1, 4, 'c.nuñez.2', '$2b$10$koI3brwAK8O26d/gq/apAOesaJ52/11YrK/qLKBu6wHe6J.i8uTta', 0, NULL),
(564, 20603605, '2', 'NUÑEZ OLIVARES JAVIERA ISABEL', 31, 2, 3, 4, 'j.nuñez.2', '$2b$10$EKwdLwqzJcF894x9OuMseO2UmTS1xEXwxIH6sxnv9S3ezb6kbIhB2', 0, NULL),
(565, 19411472, '9', 'NUÑEZ PINTO TAMARA FRANCISCA', 25, 2, 3, 4, 't.nuñez.9', '$2b$10$7EKuI7MNlhqBbzBUZkSLp.ihVLiFr2mLpZlfteLk6THMmlHE8q296', 0, NULL),
(566, 17398906, '7', 'NUÑEZ SANCHEZ KATHERINE CAMILA', 25, 1, 3, 4, 'k.nuñez.7', '$2b$10$vgq4BP4dS7AfJh7A/DBsS.w0z0rOSuAgl2Bmq6fm75ipTYB8qOcWm', 0, NULL),
(567, 14246645, '7', 'NUÑEZ ZUÑIGA JACQUELINE ANDREA', 11, 2, 3, 4, 'j.nuñez.7', '$2b$10$Hmu1rFPW2t6bPNvoOCRZw.4b/p0gYC4YKUettt0j4d3ZXyIR/U9Ea', 0, NULL),
(568, 19749861, '7', 'OBREGON MARTINEZ DIEGO NICOLAS', 43, 2, 5, 4, 'd.obregon.7', '$2b$10$bup2WurmpOFAWjo0OR/vuOGTMagK8TcLOSwkEgvX7riiBkOWIr5YO', 0, NULL),
(569, 14007834, '4', 'OBREQUE VALDOVINOS CATALINA ANDREA', 8, 3, 1, 4, 'c.obreque.4', '$2b$10$ayUU8xPnWqpqzZq9fGOZauxBwVbr0JyM5JbSgARHeKTE.TZ8vniua', 0, NULL),
(570, 8579414, '0', 'OJEDA ENRIOTTI EDDA MARIA', 7, 3, 1, 4, 'e.ojeda.0', '$2b$10$ZAxcNl8x0q7V7g8a7.aczu7Fgtrfy1Wx7won5l38kgtUocqwgcroG', 0, NULL),
(571, 8728275, '9', 'OLAVE VILLAGRA NELLY ROSA', 22, 3, 1, 4, 'n.olave.9', '$2b$10$PEIZ8nTi/zKuRdwNoeznJOd5YCjsXV.XbNy39l8KoAxxiIaXT239G', 0, NULL),
(572, 11170099, '0', 'OLGUIN GONZALEZ JACQUELINE MAGALY', 32, 3, 3, 4, 'j.olguin.0', '$2b$10$U425WhZgcXo19dW464RY5.L9f9W45aqolcmCTChLPlz0QQJPQpg.C', 0, NULL),
(573, 13773399, '4', 'OLGUIN PLAZA JOSE LUIS', 46, 3, 5, 4, 'j.olguin.4', '$2b$10$OWCabstRR0jVkJBqoFp9H.ztFmCDqObnuxgP50v7oAB27/33ofQMO', 0, NULL),
(574, 17986787, '7', 'OLGUIN SILVA JENIFFER DEL PILAR', 3, 2, 3, 4, 'j.olguin.7', '$2b$10$tFcZ94G/w7Upps7MLhRacu.5hgb.8OWYwKYB2Ogth08Bts7DPytK2', 0, NULL),
(575, 18213348, '5', 'OLHAGARAY GONZALEZ MARIA IGNACIA', 7, 2, 1, 4, 'm.olhagaray.5', '$2b$10$p.K.QYMxmShTLhxx/vL1i.uIru.IXyDt6Xnn0yIoKxjWFLRRtf3tW', 0, NULL),
(576, 10557580, '7', 'OLIVARES MADRID ALICIA DEL CARMEN', 7, 3, 1, 4, 'a.olivares.7', '$2b$10$c3cDNpfXFn/duAEsiVEeweNzN/zXsFvxR6RzumfaPbfS33KIknhQO', 0, NULL),
(577, 13559438, '5', 'OLIVARES OLIVARES ANTONIETA DE LAS NIEVES', 45, 2, 1, 4, 'a.olivares.5', '$2b$10$S0exRcb1oInM4k/gV7vZQe7L.LExNGfgYHcXoYXCv.0O0247YwqpS', 0, NULL),
(578, 9505402, '1', 'OLIVARES SAGREDO JEANETTE DEL ROSARIO', 3, 3, 3, 4, 'j.olivares.1', '$2b$10$eIHMkp4uwT0NvvPLQDgVwOT9F96jFMwdDktDmh2WSx/W5hPd1qtF2', 0, NULL),
(579, 9382719, '8', 'OLIVARES VEGA JOSE ANTONIO', 16, 2, 2, 4, 'j.olivares.8', '$2b$10$slN3DUyNI01nUs1PdmAp4e2g4pqObS0b5LxaO.O3J/sqDD/.AeWyC', 0, NULL),
(580, 15938653, '8', 'OÑATE ABARCA TIARE SEBASTIANA', 7, 2, 1, 4, 't.oñate.8', '$2b$10$l9kTxwrQHdoRaxKAxZizIuFQKvZ.L1jD1HkWPaX6ZMnd3pKlo0ceG', 0, NULL),
(581, 17600921, '7', 'OPAZO ARANGUIZ JAIME PABLO', 13, 4, 2, 4, 'j.opazo.7', '$2b$10$g14RMv5rW.xSjPjlCaXKXeOqwt6aWDqaug2/wG5RNQTA8VaUduA8S', 0, NULL),
(582, 18667899, '0', 'ORELLANA ARAVENA TAMARA ANGELICA', 39, 1, 1, 4, 't.orellana.0', '$2b$10$gstr0oAhkwA5DhAH.dOUquTOxtsL1T6j8.JKP/tvc8Z/uhG8ellb6', 0, NULL),
(583, 17368855, '5', 'ORELLANA ORDENES FABIAN PERCY', 7, 2, 1, 4, 'f.orellana.5', '$2b$10$UBBKh7F0hh.4QbLY7Gk.Q.OeCQhwdHeXdABlUaKM53ToghwLOalsO', 0, NULL),
(584, 17683314, '9', 'OROZCO HERRERA MARIA FERNANDA', 7, 2, 4, 4, 'm.orozco.9', '$2b$10$dUXIKJgRsRvlmyPEDfQcsOmcrwHDOU/oMLGxw1CtdwOXAjCHIIrzW', 0, NULL),
(585, 13212958, '4', 'ORREGO MEZA DAYANA BETZABETH', 10, 3, 5, 4, 'd.orrego.4', '$2b$10$Z2AaTQQgCtuOMrVQwRaQKeBIgxyAORN2kirGm3rX2GmMvxCIG43I6', 0, NULL),
(586, 20604327, 'K', 'ORTEGA DIAZ LISETTE FERNANDA', 21, 2, 3, 4, 'l.ortega.k', '$2b$10$g/3pQIdqvCHtcPOuNjVt7eFyEuGCenMJLh9HZpW7k96AonAl.2vOi', 0, NULL),
(587, 15726347, '1', 'ORTIZ IBARRA RUTH ESTHER', 33, 2, 7, 4, 'r.ortiz.1', '$2b$10$4WQirZ9cxbIYv8fHrQ.UKOZbOXLB0JBbJ/db0xDsmnKKvldwgRjEa', 0, NULL),
(588, 11697544, '0', 'OSORIO PONCE ALICIA NORMA', 33, 2, 3, 4, 'a.osorio.0', '$2b$10$VcJL2bEUJ4djKK4VBsdnRO2BBaeOc3RznltwC5TKSP1TrFDDqxsjy', 0, NULL),
(589, 19068215, '3', 'OSORIO TRUJILLO VALENTINA PAZ', 19, 1, 1, 4, 'v.osorio.3', '$2b$10$SFBIOR1mjiY8PeMU2yFdGurTRuDD9gnIzMx/h1Wq4Cw6jwRRf39k2', 0, NULL),
(590, 17987119, 'K', 'OTAROLA LATIN CAMILA ALEJANDRA', 19, 2, 1, 4, 'c.otarola.k', '$2b$10$iP6wcS1AIgXOP2ahUc9tMeR0xsWHQuGx6Xx389mE8pKR.I5EeylXO', 0, NULL),
(591, 6280705, '9', 'OVALLE PARRA ALBERTO ARTURO MANUEL', 10, 3, 1, 4, 'a.ovalle.9', '$2b$10$WTAeGfe58M4C1IWjQgaADeWDFdsD8U1qDWyF7XlKmfel0iu3e0PI6', 0, NULL),
(592, 17547492, '7', 'OVANDO MILLACURA MONICA IGNACIA', 16, 2, 1, 4, 'm.ovando.7', '$2b$10$JGWEpa1naqFokwGJnOZgZu2QwS0zK9ZLPogZdVEiI7Nnq0teRt2hW', 0, NULL),
(593, 16855957, '7', 'OYARZO CORTES JAIME DAVID', 38, 2, 1, 4, 'j.oyarzo.7', '$2b$10$1q24KedyLdpKT4v1nnZU5eGGnd2B23X6qfT2Cc4kO//1T5DuMSjb2', 0, NULL),
(594, 17683079, '4', 'OYARZO CORTES MARIA TERESA', 22, 3, 1, 4, 'm.oyarzo.4', '$2b$10$iGgtLp3Fru2pWnEPtbVjZ.yAXv7IR/12SAApymOYIixvkDFLdogSa', 0, NULL),
(595, 21800129, '7', 'PABON UEGO MARIA CECILIA', 74, 2, 2, 4, 'm.pabon.7', '$2b$10$NWTFGCg5WF5B.k972IzrweplfYfVtWmNYWUhmZJR4yb77Miw6uRB6', 0, NULL),
(596, 12900441, 'K', 'PADILLA QUIJADA PATRICIA ANGELICA', 16, 3, 3, 4, 'p.padilla.k', '$2b$10$zzF4oq1o/L94ZxWpjlrhGeo/jEPZslql.dMqAMo2VzSL.sLT6cPq2', 0, NULL),
(597, 17519373, '1', 'PADILLA ZUÑIGA VALERIA YANINA', 11, 2, 3, 4, 'v.padilla.1', '$2b$10$0jBuzneELt.oMbTBtlzuEODMdBBQLkbG4wy8UUM2GgXawuAGoUBoK', 0, NULL),
(598, 9449455, '9', 'PAILAMILLA CARRASCO TERESA JESUS', 35, 3, 3, 4, 't.pailamilla.9', '$2b$10$uB0xFIsgkyKLHFeCpQhRWuMeWRNC2lbh4l.qOqLDljQVCHcE0ujZS', 0, NULL),
(599, 14312510, '6', 'PALACIOS MATELUNA MONICA DEL CARMEN', 19, 3, 3, 4, 'm.palacios.6', '$2b$10$sfP7zPCSg5kPrzDOI.00Oe4kaYHqhJUYunHI1.tzKty9u10bMXboq', 0, NULL),
(600, 18617936, '6', 'PALACIOS PAWAHTON VALENTINA PAZ', 13, 4, 2, 4, 'v.palacios.6', '$2b$10$Q2wi6bwhNhpGdZbO.HABGO./AV/yE8vLojqHD3jw.3MFatJK7d0Ta', 0, NULL),
(601, 9214788, '6', 'PALACIOS ROMERO HILDA CARMEN', 3, 3, 3, 4, 'h.palacios.6', '$2b$10$.KbR0UngLWOCY8WjL9hML.ACBp3t/b1jZQ1oQyweMrDb5x76G6Vne', 0, NULL),
(602, 13772011, '6', 'PALMA HUERTA CATALINA ANDREA', 8, 3, 3, 4, 'c.palma.6', '$2b$10$kxtGZtpmvQ0tHRGUZJa3E.37gvnG82VZQTYZVWyz/uMg8yeHFHB/O', 0, NULL),
(603, 25842947, '8', 'PARADA AGUIRRE CARMEN MODESTA', 25, 2, 2, 4, 'c.parada.8', '$2b$10$oDGvCqinQzpxOD6e.Oewt./AtF47cgJrjKe25QSdrovGhJPh00CDS', 0, NULL),
(604, 15713729, '8', 'PARDO PARDO PAULA', 53, 2, 5, 4, 'p.pardo.8', '$2b$10$k2n6DgdI9A2Ts4sT.odj7eZIUJ/4gsziqXdSqlkYxiQSaOquG893u', 0, NULL),
(605, 11231407, '5', 'PARODI ORTEGA WALESKA LAS NIEVES', 35, 3, 3, 4, 'w.parodi.5', '$2b$10$5G6VwSMCQM8MZB0CQsXKmeQ7lwJJoMht5mN/xcByHVc1gLsMokIee', 0, NULL),
(606, 17186737, '1', 'PARRA VEJAR GENESIS YESSENIA', 8, 2, 3, 4, 'g.parra.1', '$2b$10$mmUXvHp2O3o.onRzBdG69.r0beMhkQnYF7ZtGYEtQfntmoIrIewgK', 0, NULL),
(607, 18487417, '2', 'PEDREROS URRA MARIA FERNANDA', 7, 1, 3, 4, 'm.pedreros.2', '$2b$10$cJCQuGr2ptqPurS/ADvmh.2pqbpdXMcchCjxZ8BCS5.OlorGfyTOe', 0, NULL),
(608, 19068033, '9', 'PEÑA CARRASCO MATIAS NICOLAS', 32, 2, 3, 4, 'm.peña.9', '$2b$10$rAlSp6G9.GraHo6eLM5ilOO5K.8clEEub1Jzq01b1JU8I3/pbeT.m', 0, NULL),
(609, 11608884, '3', 'PEÑA OLGUIN CECILIA ISABEL', 14, 2, 4, 4, 'c.peña.3', '$2b$10$m4R6LmjXDjkmvm4aiIOGK.v1i.0RCjiHs.ykImOg4Yw63ZOYUUmn2', 0, NULL),
(610, 16577706, '9', 'PEÑA ORELLANA JOSE MIGUEL', 46, 1, 5, 4, 'j.peña.9', '$2b$10$eKpJZT3jrqx.m3ByR6nmk.iWWNh.hGoR1Y7axX1YZ/J0T./njEZbS', 0, NULL),
(611, 18949398, '3', 'PEÑA REYES SARA EUSTOLIA', 7, 2, 1, 4, 's.peña.3', '$2b$10$2FAH77JcRsGBN4B4bVii8eiAozt93U26r3W40r8HGY5Q2ORsfrpam', 0, NULL),
(612, 26653340, '3', 'PEÑA TORRES CIRO', 32, 2, 2, 4, 'ci.peña.3', '$2b$10$Ux16ZGxsH.QJdBb7IHI74.rdFCaAshX5iOAxOcVjyE8kO2KpXnLAW', 0, NULL),
(613, 14579182, '0', 'PEÑA VASQUEZ DIEGO JACINTO', 19, 2, 2, 4, 'd.peña.0', '$2b$10$4/3qOcNMm/evi0z5jTzYdelmdzjKs.QNKdKKCWwPzCXmzJ935crrO', 0, NULL),
(614, 17962285, '8', 'PERALTA SANCHEZ NATALIA PAZ', 25, 2, 3, 4, 'n.peralta.8', '$2b$10$4LxmQq/7a02QKNgjpYr6je7tfjiD7oJT9PZh.sEO.P7aCOTL8tFLi', 0, NULL),
(615, 13843785, 'K', 'PEREZ AEDO JAMIE ZULEYKA', 57, 2, 1, 4, 'j.perez.k', '$2b$10$rvwiVs4JYAX7hKrPJM1YCOog8Md3qgk9JRmEivLUkRad8zOSG3Deu', 0, NULL),
(616, 26331455, '7', 'PEREZ ALVAREZ HERNAN OSCAR', 7, 2, 2, 4, 'h.perez.7', '$2b$10$eVf71k2sOog.apl3e1Tx0.3pCLAuYyDy/M3P7bV..C/syIsYZgUim', 0, NULL),
(617, 11231102, '5', 'PEREZ ARMIJO JEANETTE DEL CARMEN', 21, 3, 3, 4, 'j.perez.5', '$2b$10$dha/61/9Gey7hHMGV4Uv3OhCF39iumldC7371EghxoVV2Gvnfy/2a', 0, NULL),
(618, 15095561, '0', 'PEREZ HERNANDEZ CLAUDIA ALEJANDRA', 66, 3, 8, 4, 'c.perez.0', '$2b$10$v1EVHqeIXL0xxu9K3KRlMuSbFBFYnJP5hKbzQVABqQmIIbKINkkny', 0, NULL),
(619, 13340855, 'K', 'PEREZ MIRANDA RINA ESPERANZA', 11, 3, 3, 4, 'r.perez.k', '$2b$10$VjLYjZbQG7krsuwL0WEEQ.hKIDI795cfZzP8nackpJUiKPuGZpcg2', 0, NULL),
(620, 15866801, '7', 'PEREZ MUÑOZ MARIA CECILIA', 25, 2, 5, 4, 'm.perez.7', '$2b$10$UtULFUKQeWk62YzKggF4RO7Zfrgr94s5Y/0VK8Wgn3vQyNaPb2t96', 0, NULL),
(621, 17716619, '7', 'PEREZ PARRAGUEZ GASTON FERNANDO', 13, 4, 2, 4, 'g.perez.7', '$2b$10$fZZXOTN3KmjtZXLlmgaFOehNGYVCKUeB7iIwQd7LcsnCrodJWDQwu', 0, NULL),
(622, 17081856, '3', 'PEREZ SANTIBAÑEZ MELISA FRANCESCA', 11, 3, 1, 4, 'm.perez.3', '$2b$10$s.pcHyVQUoBb5skxZn24XeMLav3bdtEb3R36hFtz9mLUD9kFGxlJC', 0, NULL),
(623, 12567223, 'K', 'PEREZ ZULETA TEDDY ANDRES', 75, 2, 1, 4, 't.perez.k', '$2b$10$LjmNaseZUH0I2nLKNpe3Xu5u.PM9CNsAMYc70B4u7CQdpQ2ZUpmRu', 0, NULL),
(624, 25117223, '4', 'PESANTEZ ALVAREZ EDGAR VINICIO', 32, 2, 2, 4, 'e.pesantez.4', '$2b$10$fClolStvV72PpyeMA7VTpuYAE46anYHWyh6tlNNfZaXWJUKSyQo76', 0, NULL),
(625, 20311517, '2', 'PINO PINO SCARLETH DIANA', 22, 1, 3, 4, 's.pino.2', '$2b$10$/du4ooWKMMBKPE6ait8bAOv7.m2Z6JHqBHtFQ5ibhLkhgYHTKF.4y', 0, NULL),
(626, 11360750, '5', 'PINTO ABARCA LUIS ANTONIO', 41, 3, 5, 4, 'l.pinto.5', '$2b$10$2BnMhYqJV2dNInyA9iUrmem3bWwnzd.78yt..B84EWIsdCmRmWPyW', 0, NULL),
(627, 11737539, '0', 'PINTO ABARCA PATRICIA XIMENA', 41, 1, 5, 4, 'p.pinto.0', '$2b$10$K8asqjhUHQpX9BKxkLhD7OmDVSEbLBiNRHAFi60twIbDeidBV80X.', 0, NULL),
(628, 27876387, '0', 'PINTO CORDOVA ELIOMAR JOSE', 19, 2, 2, 4, 'e.pinto.0', '$2b$10$iz1EBfXim/.aHtVnyZMBb.QVhnbWq6vkaxQuqHVizkHo2ZXCMFUDy', 0, NULL),
(629, 18128659, '8', 'PINTO FLORES LEONARDO ANDRES', 14, 2, 3, 4, 'l.pinto.8', '$2b$10$6kT5G/XvX7F/8liUTRiYheA/jtzFi5MSNMoAroMtABynk3vNd7iX2', 0, NULL),
(630, 20124742, 'K', 'PINTO GONZALEZ KATHERINE PILAR', 19, 1, 3, 4, 'k.pinto.k', '$2b$10$5o2.q3SSZlOKs1toSGeCZuLU71ieJOMp.OZwwWwbBXrCqzIwT/jye', 0, NULL),
(631, 18394336, '7', 'PINTO TOLEDO FERNANDA JAVIERA', 13, 4, 2, 4, 'f.pinto.7', '$2b$10$Z0answZLVpvDQmc0aA8DrOiwUfsJAYVusugrBf6ZuORgputW/7Nee', 0, NULL),
(632, 16843945, '8', 'PIÑA BARROS KAREN DE LOS ANGELES', 76, 3, 1, 4, 'k.piña.8', '$2b$10$E1OcN3aT1agDm.8Wn5f59.fvZQfQM5Yl0gRpPGnhgJyqycynTuGHi', 0, NULL),
(633, 13547558, '0', 'PIÑA MOYA NANCY CAROLINA', 56, 3, 5, 4, 'n.piña.0', '$2b$10$Z9cbz7ELjE8EmeHhGZjEVujCzDd7KUMCPZZ5Gcn2SMG9wD9o1E3ge', 0, NULL),
(634, 15405078, '7', 'PIÑEIRO PIÑEIRO VIVIANA ANDREA', 54, 2, 1, 4, 'v.piñeiro.7', '$2b$10$GvNcrcpgW84J3EQ/F3wINevJGdlTsfx7OUvHsKZNt36rKlNDvJvOu', 0, NULL),
(635, 26795226, '4', 'PIÑERO GARRETT LOTTY ESTEFANY', 11, 2, 2, 4, 'l.piñero.4', '$2b$10$T9HozoBn6lFeu7UFLzdJ7uhkgHJlG.6tJ/U568M/hm/30wZtlK.ty', 0, NULL),
(636, 16122304, '2', 'PIZARRO ALLENDE VALERIA KARINA', 14, 3, 1, 4, 'v.pizarro.2', '$2b$10$sR4NIVfYqknyaYs8M69BZeRp1zQ/PEqImhzt661Q.fUpBFTywBqNe', 0, NULL),
(637, 15622885, '0', 'PIZARRO PIZARRO ALDO ANDRES', 52, 2, 3, 4, 'a.pizarro.0', '$2b$10$WXHcB80mzlAX9P3GP4NALeHyfyVranWMNBdlF9s4Emol7GhFFbhO.', 0, NULL),
(638, 11331140, '1', 'PIZARRO SAGREDO SUSANA ELIZABETH', 24, 2, 1, 4, 's.pizarro.1', '$2b$10$9xBoRvRHiluZDIi7MRlS/ed7VFTohDCaNxfwBQ6SkMHLlrYNhQEoi', 0, NULL),
(639, 15866748, '7', 'PLAZA MANOSALVA PRISCILLA ANDREA', 21, 2, 3, 4, 'p.plaza.7', '$2b$10$PnfaCVD56TYQybmWSPbgg.nCWq..XCEknATNrNph0jMzQr2QDKEAu', 0, NULL),
(640, 25783754, '8', 'PLAZA MEJIA ELVIS MAURICIO', 8, 2, 2, 4, 'e.plaza.8', '$2b$10$pZqzPajRG.shQuU3Ik8bAOU8eokH1/PSPxAPMSLUsediFM.fiemRy', 0, NULL),
(641, 19411714, '0', 'POBLETE CASTRO AILEEN FERNANDA', 25, 2, 3, 4, 'a.poblete.0', '$2b$10$xfNmoKMw4UPuaIglhyBD1eocacv/ZcXZKTwvWNQSjjbRW/sA/W97.', 0, NULL),
(642, 17177247, '8', 'POBLETE CESPEDES MARIA ELIZABETH', 62, 2, 1, 4, 'm.poblete.8', '$2b$10$AhKgqOIn2P5Ax36XCbGK9.cKxk3KvL5MKHLIjVU5nYbSHd2qx7Qgy', 0, NULL),
(643, 14586004, '0', 'PONCE MARTINEZ JOSE LUIS', 8, 2, 1, 4, 'j.ponce.0', '$2b$10$M6OPPfjKVP/gR17K7FHLYuC8bWFAg1wjAj2ERD/2cY6E5TDj1LL0G', 0, NULL),
(644, 18488377, '5', 'PONTIGO OLMEDO GABRIELA JOSELYN', 22, 2, 1, 4, 'g.pontigo.5', '$2b$10$IeKrRQJ2pKFDhbPkLJ/WMOL8WV6ksQqzr/ENNP0gEr3odV7VfYTY2', 0, NULL),
(645, 15404094, '3', 'PORRES ROBLEDO PAULA ANDREA', 62, 2, 1, 4, 'p.porres.3', '$2b$10$O9yc.bhO9.nQjXk6yh07SufnUbXJ5Dgj93C0PLZGQtuA32TJZ09w.', 0, NULL),
(646, 13772004, '3', 'POZO POZO VICTORIA PATRICIA', 29, 2, 3, 4, 'v.pozo.3', '$2b$10$q3NGJ9.LCXB1JoToks4Px.phjyXZTbzhKHok5xpQFhSXBUAeTXiom', 0, NULL),
(647, 18480445, 'K', 'PUENTES GARATE DAYANA ANDREA', 33, 1, 3, 4, 'd.puentes.k', '$2b$10$8xdcne/g1H0Kti4983sR..YLMVjArgPFnXezvXSNtg.zKNRhNoE.O', 0, NULL),
(648, 14246520, '5', 'PULGAR DUARTE CARMEN ALEJANDRA', 22, 1, 4, 4, 'c.pulgar.5', '$2b$10$uSmyvOpiiZsqXK3pXfRTLeQciNMoHk3NvNqfW.SFwihBKiN6A18W2', 0, NULL),
(649, 16727914, '7', 'QUEZADA RUBIO ROLANDO ALEXIS', 8, 2, 3, 4, 'r.quezada.7', '$2b$10$NKNvmmwpaFdKKwVw9t296eRwQnIGBn6ud8ISJK.7DvnBfVjDqbLcS', 0, NULL);
INSERT INTO `usuarios` (`id_usuario`, `rut_usuario`, `dv_usuario`, `nombre`, `id_servicio`, `id_tipo_contrato`, `id_estamento`, `id_tipo_usuario`, `username`, `pwd`, `borrado`, `email`) VALUES
(650, 16793493, '5', 'QUIDEQUEO ALBORNOZ PATRICIA PILAR', 1, 2, 3, 4, 'p.quidequeo.5', '$2b$10$9drCWimJWvNyi1r0BM/D2OLEdr8n7a7MlKVTJom.YXEWaBn9A69EC', 0, NULL),
(651, 9951880, '4', 'QUINTANILLA ALIAGA CORY DE LAS MERCEDES', 11, 2, 3, 4, 'c.quintanilla.4', '$2b$10$wgX5dRoxr8mcYC.FpXwHce9P0gZPzyCbtms05jovI9hq78fNepTXi', 0, NULL),
(652, 13772550, '9', 'QUINTANILLA ALLENDE BRUNO ENRIQUE', 4, 1, 4, 4, 'b.quintanilla.9', '$2b$10$3Av7a0s1jYF6XpfxGMw4z.PMLp2/hutN5zW1QUBt1bAH8Gm6tgLDW', 0, NULL),
(653, 18777661, '9', 'QUIROGA CATALAN CARLOS PATRICIO', 56, 2, 1, 4, 'c.quiroga.9', '$2b$10$nXWIERTkIQga1wkNWM/HIe5VbZtvI/cuynJjHuT40vmByM5S/mfma', 0, NULL),
(654, 22811636, 'K', 'QUIROGA IRREÑO LUZ DARY', 2, 2, 2, 4, 'l.quiroga.k', '$2b$10$2CzpBUm8Mip4HbIEEI4OmuHNCIIRAvEI.oVsxwbMDu.fO.3Q4SLde', 0, NULL),
(655, 18777408, 'K', 'QUIROGA VIDAL LORETA INES', 7, 2, 3, 4, 'lo.quiroga.k', '$2b$10$lRL8mcAWkadooBP4c4adXeD1XrYoWrgtku1W50rVjtqo5GayLksrO', 0, NULL),
(656, 10017154, '6', 'RAMIREZ GONZALEZ BERNARDITA DEL ROSARIO', 47, 2, 5, 4, 'b.ramirez.6', '$2b$10$pWXF.gFUV6qxy3EwzDLDIeLGlbufX4S5608F7htgS0aWc13v2crDm', 0, NULL),
(657, 15346159, '7', 'RAMIREZ PALACIOS SANDRA SCARLET', 43, 2, 5, 4, 's.ramirez.7', '$2b$10$767eFZ1vBFaEqFrlyHkcMu9JwapS1qCM89g9xz5fk5L9oKLtH9tSi', 0, NULL),
(658, 10334468, '9', 'RAMIREZ QUINTEROS ALEJANDRA DEYANIRA', 3, 3, 3, 4, 'a.ramirez.9', '$2b$10$oXe48lHOhDp5gmDdDUTHfuZYd3AbVhl302fnkENrdcX.rce7phl7S', 0, NULL),
(659, 9782154, '2', 'REINOSO GOMEZ ELIZABETH DEL CARMEN', 54, 2, 5, 4, 'e.reinoso.2', '$2b$10$yNT1xswJz7OW/P2/gYVNK.G9CvOG.K0HQ3zoc781I6P0pvhY36xkm', 0, NULL),
(660, 14008057, '8', 'REINOSO GOMEZ MAURICIO ALEJANDRO', 11, 2, 1, 4, 'm.reinoso.8', '$2b$10$6mvhbw3GQitfAV8BWwcJqeC5OOoRL7INdTqhiuWJnsFD5KPekCINq', 0, NULL),
(661, 15330973, '6', 'RETAMALES NUÑEZ CARLOS ERNESTO', 10, 3, 1, 4, 'c.retamales.6', '$2b$10$csUK9xWMfQwxUaO2a1wSU.3PWPam71VcXk8TCHxTdVzHNQLZySq9W', 0, NULL),
(662, 14046737, '5', 'RETAMALES PEREIRA FABIAN ANDRES', 32, 3, 1, 4, 'f.retamales.5', '$2b$10$fIBhL7lSx7VUFvI0LCHL8O.T9WFT7B.kL17totv2Toh9oPGiFfxAi', 0, NULL),
(663, 14379621, '3', 'RETAMALES PIÑA ISABEL DEL PILAR', 43, 2, 5, 4, 'i.retamales.3', '$2b$10$LaMzzCtN3Q.kMJ0jYZmJ2.GPfIBDbgzUSZD7BnHR.qSXemUlN0.au', 0, NULL),
(664, 9440905, '5', 'REVECO FISCHER MIGUEL ERNESTO', 35, 3, 1, 4, 'm.reveco.5', '$2b$10$Cik9HKO8TYu2E2kIJlOMxOLe2r2jsVwI2WgLEUzCUDTa7YpxSXTLi', 0, NULL),
(665, 19068423, '7', 'REYES ANTIÑANCO LADY ROMANETT', 15, 1, 3, 4, 'l.reyes.7', '$2b$10$/k375ZikNpWGJDMyqArwBe1yA9km5QkyJN6DN1lWAy3H4uhDSkIcW', 0, NULL),
(666, 14312857, '1', 'REYES CORREA NANCY LORENA DEL PILAR', 3, 3, 3, 4, 'n.reyes.1', '$2b$10$FI0i97qIDDESTwduSssso.l7eVph2OcQMi3ExdLzt0aRkHdEQWyka', 0, NULL),
(667, 14312310, '3', 'REYES PLAZA MARIA LOS ANGELES', 19, 3, 1, 4, 'm.reyes.3', '$2b$10$j62GZB.y3nrhBnha2XSe8urKIzV4LUcHl3YGdfSxMdS3k4D9t1Vam', 0, NULL),
(668, 19924025, '0', 'REYES REYES SCARLETT BELEN', 22, 2, 3, 4, 's.reyes.0', '$2b$10$Wsn.JUSi9TtVBWTxhCByKe3aOMnuPgW4LVGkCcCf1bLbuyAfevI8q', 0, NULL),
(669, 28085991, '5', 'RINCON SOLER YOSUE', 19, 2, 2, 4, 'y.rincon.5', '$2b$10$qA4D8/Wo5XiwbnPGUEKiHeW.uwNiDZCNHHH4/VoXnhQu04ririUQG', 0, NULL),
(670, 15623807, '4', 'RIQUELME FARIAS SILVANA ANDREA', 16, 2, 1, 4, 's.riquelme.4', '$2b$10$HOTDoGX3fxi4r54Sl.yiqOoV/uoOtQ1JHooKr6oObidnApgY/kTtK', 0, NULL),
(671, 14007434, '9', 'RIQUELME MARTINEZ CATALINA DEL PILAR', 29, 2, 3, 4, 'c.riquelme.9', '$2b$10$FmuSzgwki0DYDNdy536pJeZf07DVcTGB8MOMVNvnfSkBCOQej3/rS', 0, NULL),
(672, 22344568, '3', 'RIVERA BACILIO JHANPOOL MANUEL', 13, 4, 2, 4, 'j.rivera.3', '$2b$10$BlPqbVIQYbR0sjaNC5cyh.PdqyRKn5lxnjEdXtRh/AnTBADXGuD0e', 0, NULL),
(673, 12890192, '2', 'RIVERA FLORES FRANCISCA BEATRIZ', 54, 2, 5, 4, 'f.rivera.2', '$2b$10$GLxgYIOnyyFat0HSPrXsJuHroHgPXk5APyvw9NokYVhZFsfbm8v1C', 0, NULL),
(674, 27715348, '3', 'RIVERO SIERRALTA GRECIA JOSEFINA', 9, 2, 2, 4, 'g.rivero.3', '$2b$10$JlEQ.KXPnpmLSJ6QDlNUnu2cJWxt/7/wRFFwOz/PwZnJZ0VbQpAuK', 0, NULL),
(675, 16468961, '1', 'ROBLEDO VELIZ JOSEPH ANDRES', 35, 3, 1, 4, 'j.robledo.1', '$2b$10$RSznUiDBmibk9GxZ/L0PJOO0PILR9IlfEt/j1X.ORWB6pQn9cQt1y', 0, NULL),
(676, 10474179, '7', 'ROBLERO ASTORGA EDUARDO ANTONIO', 4, 2, 4, 4, 'e.roblero.7', '$2b$10$pRBg6CbB2pSkr8oOka8JIu5OHsuJefTnzvaHilmTpZlaD9hyY0CLO', 0, NULL),
(677, 9114239, '2', 'ROBLERO ASTORGA JORGE LEOPOLDO', 4, 3, 4, 4, 'j.roblero.2', '$2b$10$Xk9C3ZKeFe4eEUlTixq44uFK8i6EaivExy939eiLlu0kskmUOsUfe', 0, NULL),
(678, 18777559, '0', 'ROBLERO ROJAS JORGE LUIS', 43, 2, 5, 4, 'j.roblero.0', '$2b$10$UFCOSJ.Vyyht5xOCmPHxSuRTE1//lgofw6K/br.4N33cH1SV3XR/m', 0, NULL),
(679, 23013932, '6', 'ROBLES MERO KATIUSKA ELIZABETH', 74, 2, 2, 4, 'k.robles.6', '$2b$10$2zG8iKHHc5Qtug.9su0.sef8eljFqwwInKHvOd0cVUOdQiygOS3DS', 0, NULL),
(680, 14141428, '3', 'RODRIGUEZ ARAYA PAMELA FRANCISCA', 8, 3, 1, 4, 'p.rodriguez.3', '$2b$10$T69FbQIIGdy3B6.j7DSwZu/eLRNwhM0iqTLFsLs7JxfMbbyJiImre', 0, NULL),
(681, 25312124, '6', 'RODRIGUEZ BETANCOUR JANETH', 25, 2, 2, 4, 'j.rodriguez.6', '$2b$10$EvDD5XRAMaGmVPaUr.Nw7.eADmgJktzUSOW/URLrGq/IZoqIf5HYK', 0, NULL),
(682, 11396960, '1', 'RODRIGUEZ CORNEJO CELINDA DEL CARMEN', 33, 2, 3, 4, 'c.rodriguez.1', '$2b$10$2YL7F6CMKVhsvJCVdVDAJ.AbzF1PYFFvF82Z50DznJBLacOhkjiMS', 0, NULL),
(683, 25909723, '1', 'RODRIGUEZ GONZALEZ ALEJANDRO MIGUEL', 28, 2, 2, 4, 'a.rodriguez.1', '$2b$10$L2gV..f3XYpIbB4qOufmQewWK7rbq/SeyDL8.uS1HcGHoPNnSs3HO', 0, NULL),
(684, 11224234, '1', 'RODRIGUEZ HERNANDEZ ALBERTO DARIO', 10, 2, 3, 4, 'al.rodriguez.1', '$2b$10$PvGKcDcHfvlMAt4q/STasejGd1obrKE8eOPkUmNCMNEMmjatiN8Wq', 0, NULL),
(685, 16855936, '4', 'RODRIGUEZ HERNANDEZ XIMENA DEL CARMEN', 51, 1, 1, 4, 'x.rodriguez.4', '$2b$10$H/sUn7FD4LEYN66ZHnalF.dBQnDQyBYa18Dqb2SY1Joshz.sOSVNq', 0, NULL),
(686, 26315484, '3', 'RODRIGUEZ MAITA ENRILEIDIS DEL CARMEN', 11, 2, 2, 4, 'e.rodriguez.3', '$2b$10$AnvBBM44baCJaImS5jTAseoApXPx53qoc/qjBVosbfDSXfREcyOGi', 0, NULL),
(687, 17799223, '2', 'RODRIGUEZ SAYES AMELIA FRANCISCA', 8, 2, 1, 4, 'a.rodriguez.2', '$2b$10$mlbBR.s6fLgW.K2HtRVSNuV1QYPGNNoOLI1Hx6ki3U4yo6UYOsrda', 0, NULL),
(688, 26754087, 'K', 'RODRIGUEZ VELOZ VANESSA CAROLINA', 6, 2, 2, 4, 'v.rodriguez.k', '$2b$10$tLxcQZvXlfTMOQTz30rUw.XccZq/JQrYe/MNKZhxBXesQqsV5Y7zK', 0, NULL),
(689, 18459722, '5', 'ROGEL SCHMEISSER HECTOR FRANCISCO', 13, 4, 7, 4, 'h.rogel.5', '$2b$10$YwvbGcxYGpiOffoJU4v.F.vGtJB1J5etlnNA4v17NF.F0MekdJktm', 0, NULL),
(690, 19069325, '2', 'ROJAS CESPEDES JUBIXA ESTEFANIA', 21, 2, 3, 4, 'j.rojas.2', '$2b$10$XasJl9UIRStgs/vAlZ4o8uxRFzphrSqUgVnRV6dqfwkEMojt.U.re', 0, NULL),
(691, 11230917, '9', 'ROJAS DINAMARCA HILDA MACARENA', 8, 2, 1, 4, 'h.rojas.9', '$2b$10$l5HjlEU.zRKjFscjnz8UredPJo/g7HnDBV4zLtEpyud0zHJJ6ygjK', 0, NULL),
(692, 13448102, '1', 'ROJAS ELGUETA CAROLINA CECILIA', 77, 3, 8, 4, 'c.rojas.1', '$2b$10$n8kDSF5y2GAX2V2d2cdwX.P33DqaSKgCIVL0og5HnlntwS9tIcEsS', 0, NULL),
(693, 16067873, '9', 'ROJAS ELGUETA CRISTOBAL JORGE', 33, 2, 7, 4, 'c.rojas.9', '$2b$10$LsYSOqTuheb.p3H/.k9L3u1lCv5Cwd13rxc2fp4nQc9ybPew0WQZS', 0, NULL),
(694, 14006820, '9', 'ROJAS IBACACHE PAULA ANDREA', 27, 2, 3, 4, 'p.rojas.9', '$2b$10$Dl10hQIIx0aNj53Sx9k/ouoYdTVpzasEqKXLn3lTF07bEtzFECmzC', 0, NULL),
(695, 18212503, '2', 'ROJAS JORQUERA CATALINA DE JESUS', 21, 2, 3, 4, 'c.rojas.2', '$2b$10$iUHSvx9pKqZonMaLf28s8OOjbup4j0IIYYxBPpk93od2p4xLb/42q', 0, NULL),
(696, 15511304, '9', 'ROJAS MENESES MARICELA CARMEN', 7, 2, 3, 4, 'm.rojas.9', '$2b$10$O5L/ExUUtTw0i6C7WPv21uHup5TwBrfthkYZTviozlYwcs7eHWn46', 0, NULL),
(697, 10349927, '5', 'ROJAS OROZCO GINA CARMEN', 29, 2, 5, 4, 'g.rojas.5', '$2b$10$aFm6UopPIZcfORm99J4XP.sUksl0t2zCFtMasBJyW2nsahkS/6oi2', 0, NULL),
(698, 10833109, '7', 'ROJAS QUINTANILLA CAROLINA DEL CARMEN', 3, 3, 3, 4, 'c.rojas.7', '$2b$10$kXE12ds1ia8OrbdvKfcLWeVbaYJ2cOTniE/sQgkSqc2BlpdZBbnWS', 0, NULL),
(699, 14029333, '4', 'ROJAS VASQUEZ ANDRES ADONIS', 17, 2, 2, 4, 'a.rojas.4', '$2b$10$wF.lB.DraTCniBnijGbnWu9qHn1AErMNOMjZ/6k608WydRBG1KgIO', 0, NULL),
(700, 19749546, '4', 'ROJAS VERGARA MAXIMILIANO ANDRES', 8, 2, 3, 4, 'm.rojas.4', '$2b$10$.xgU3uXZqZY/udRfUdOJf.7ZZdqtQKd/D9QkSNKqcP4gGpvdRHgjS', 0, NULL),
(701, 9399876, '6', 'ROMAN ABARCA ERIKA PILAR', 60, 2, 3, 4, 'e.roman.6', '$2b$10$h5tkm4tWGxj2Xn4hy3KWyeYTwHN73Xv67.4WvCzpnXGY3k.ssmLmW', 0, NULL),
(702, 16576812, '4', 'ROMAN ALARCON DENISSE CECILIA', 32, 2, 3, 4, 'd.roman.4', '$2b$10$Vv7tPuMOC1kjKKrJWCWPp.yQ378s1mP3cmwkEpBiXwSSQkFungGHS', 0, NULL),
(703, 12628201, 'K', 'ROMAN PARRA REBECA IVONNE', 25, 1, 1, 4, 'r.roman.k', '$2b$10$o3MrHKjECNunreq4IWWZ..uSO8fEnnVWuvT/5w/Kbn/oso4yy0I5u', 0, NULL),
(704, 15617563, '3', 'ROMAN ZAMORANO CARLOS PATRICIO', 25, 2, 2, 4, 'c.roman.3', '$2b$10$31ypr.b7sTRdt4Mhj2mIhOC1TtcZiRhr0FSMAaRkMr5VEe6TbDiia', 0, NULL),
(705, 8914324, '1', 'ROMANINI CARRENO BERNA MIREYA', 32, 3, 2, 4, 'b.romanini.1', '$2b$10$m/AsxPb0ggYlPSYwBELP2OZ0pNLtiG9rBbZX0wvjjZlQ0/CA0dv8S', 0, NULL),
(706, 14007267, '2', 'ROMERO BAUERLE VICTOR DANIEL', 4, 1, 4, 4, 'v.romero.2', '$2b$10$gyjxuDIPDfPb/YCQ/4maz.5GEcKgDggiT68ZuD0SY/tizZLsC1api', 0, NULL),
(707, 15335283, '6', 'ROMERO CARRASCO LINDA DENISE', 7, 2, 1, 4, 'l.romero.6', '$2b$10$ZcwAkdaGJCt3emev7/SEwO48x086o/Z9/J.Uw39zvRQibz6NhL8Ue', 0, NULL),
(708, 17804560, '1', 'ROMERO HERRERA FLAVIA ANDREA', 78, 2, 1, 4, 'f.romero.1', '$2b$10$bjKoCJzZ.xnUdcnfEdxZQu4Zbf7zD1H3q.tCN8vdBCzejUXjF2h..', 0, NULL),
(709, 7949981, '1', 'ROZAS OLIVARES PATRICIA XIMENA', 35, 3, 1, 4, 'p.rozas.1', '$2b$10$tZwk8jnCOU9i86TRg2IAdO0zTj3Lh6biTl0E5akZ4GnNPRyIvXHKO', 0, NULL),
(710, 26378472, '3', 'RUIZ ALVAREZ NIVIA CAROLINA', 7, 2, 2, 4, 'n.ruiz.3', '$2b$10$BeBJRNtFMd5OTfOXHhuu.O7qGSEea10ZzR2D51dNdleGhbLs8micS', 0, NULL),
(711, 16670043, '4', 'SAAVEDRA ALVAREZ FELIPE ANDRES', 66, 2, 1, 4, 'f.saavedra.4', '$2b$10$h2AC/KVdYtOfNupOunVEUOY5Y4DPhcMmhyhg7jXeq37KMNonjNoKa', 0, NULL),
(712, 7927723, '1', 'SAAVEDRA BARRERA VICTOR HUGO', 14, 3, 1, 4, 'v.saavedra.1', '$2b$10$x9zjWWxhwkCa4En7P9fMAuBWeAxRTQI4H0kySTgJ0VRFZ6CLNlfB.', 0, NULL),
(713, 20124201, '0', 'SAAVEDRA CARRASCO MASSIEL ESTEFANIA', 1, 2, 3, 4, 'm.saavedra.0', '$2b$10$Dh0d19gQHd4j4Hm/B246u.6sQfHgPmP/HiFTJUqTl3VAXGp0t0l.K', 0, NULL),
(714, 18448495, '1', 'SAAVEDRA CONTRERAS FRANCISCO JAVIER ANDRES', 10, 2, 1, 4, 'f.saavedra.1', '$2b$10$SyBwzbQfFxlet5EXAS9pOumox1HyUaKfH3w7nom1sHi1BhtFIVpBK', 0, NULL),
(715, 17319198, '7', 'SAAVEDRA LARA CAMILA MONTSERRAT', 13, 4, 2, 4, 'c.saavedra.7', '$2b$10$R9SlkfESE4pAve1hKE4Ux.kr2ed4MvAKGwzcGhsuEQ4ftge2QBvLm', 0, NULL),
(716, 17089493, '6', 'SAAVEDRA READY JORGE CRISTIAN', 25, 2, 2, 4, 'j.saavedra.6', '$2b$10$EBLRLE8IGFjE1dGGn295AeY/SD.Dxyofv4eBCnfaSHcDufvlLt7Ea', 0, NULL),
(717, 26590877, '2', 'SAHMKOW PAEZ CHRISTIAN PAUL', 25, 2, 2, 4, 'c.sahmkow.2', '$2b$10$0HepISNdIFq6ek..4fXxPeD1kMEf7TWMmEyuH/Udx3pYuMQb0FO4m', 0, NULL),
(718, 13559874, '7', 'SALAS PEÑA NADIA CLARISA', 52, 3, 5, 4, 'n.salas.7', '$2b$10$jckt138TrPRMwC3q0bWKsOVBskpSfoGbFqz6aQtK/qQqQ/8AO4xbK', 0, NULL),
(719, 16291090, '6', 'SALAZAR ALFARO VICTORIA NATALIE', 22, 2, 3, 4, 'v.salazar.6', '$2b$10$dJJnv4tdQXKibh4tgDF76eo.cm9gD6.X26OsAjhI8.6gxkz0Qx6U2', 0, NULL),
(720, 9235803, '8', 'SALAZAR CAÑAS LUIS ALBERTO', 8, 3, 4, 4, 'l.salazar.8', '$2b$10$kkgrKbdmUK.JwwNUL4dDiOFqeDMi0dMVinL9FQX5C8MDARlQmaGq2', 0, NULL),
(721, 12412305, '4', 'SALAZAR GONZALEZ ERICA PAOLA', 4, 3, 4, 4, 'e.salazar.4', '$2b$10$/ZvG17UYBzZaUCmDwcyJlOo2k8.Jx6z.Z/Bi2cIYKj.jslejKvE02', 0, NULL),
(722, 12641814, '0', 'SALGADO BEORIZA MARIA ALEJANDRA', 11, 3, 3, 4, 'm.salgado.0', '$2b$10$v6wfgcju/Zb5WbrDfxFugu/.TFQOyOJKZxIlj4rrq8vJxcFKM.kf6', 0, NULL),
(723, 15771040, '0', 'SALINAS SALAMANCA FELIPE ANDRES', 33, 2, 7, 4, 'f.salinas.0', '$2b$10$jR40F8CZeWTjkP5gngOqsuKvakXF.vXrVvmniRgCGFAkWu/QbdJiy', 0, NULL),
(724, 17081881, '4', 'SAN MARTIN SOTO TAMARA ROCIO', 38, 1, 1, 4, 's.san.4', '$2b$10$SQ0kO5J7156mJsfD1A3Hw.o9edXibnjefJSlmQlq5qlvb1M17aExi', 0, NULL),
(725, 16728228, '8', 'SANCHEZ CERDA MABEL ANGELICA', 8, 2, 4, 4, 'm.sanchez.8', '$2b$10$i5PVSj2FnhpyP0PNUnj5WOo49SlKpV3FX52P2qk8tQEqGQqov0zEy', 0, NULL),
(726, 26711703, '9', 'SANCHEZ GRANADILLO ISKENY CAROLINA', 11, 2, 2, 4, 'i.sanchez.9', '$2b$10$cVhpHVxNA2OuZJsPEyL2FO/10re6RxMJY8in8w1Uvojnl19i/QDU.', 0, NULL),
(727, 9937691, '0', 'SANCHEZ SANTIBAÑEZ NOLBERTO EUGENIO', 71, 2, 4, 4, 'n.sanchez.0', '$2b$10$SXFUbubuH0p2iDwqqg5vKePMTuQIntjjun4o5X0A1ZKc8wFLrflxm', 0, NULL),
(728, 26887016, '4', 'SANCHEZ ZAMBRANO SILVIA PATRICIA ZURINETH', 17, 2, 2, 4, 's.sanchez.4', '$2b$10$AT9mIBgW69h7a1izrC006ODd.o1v2w.Zi.2JMc1ZX5iE4aX.qgHZK', 0, NULL),
(729, 17684292, 'K', 'SANDOVAL ARMIJO SHIRLEY DENISSE', 8, 2, 1, 4, 's.sandoval.k', '$2b$10$vD6TIqPL3joc1E1yTqXWRuPv24e57tWFEYvz53KewhEaUr2JAhgja', 0, NULL),
(730, 26391396, '5', 'SANDOVAL GUILLEN ELISSY DANIELA', 17, 2, 2, 4, 'e.sandoval.5', '$2b$10$B3FfAPxQ7/k7ynXlULlnb.1YCmLSRVdMF89fc5Szpf3p6gDaB5szW', 0, NULL),
(731, 19749802, '1', 'SANDOVAL MAECHEL CAMILA ANDREA', 38, 1, 1, 4, 'c.sandoval.1', '$2b$10$4vawNdkjsId4DWHVoRc6i.Nw5RLmiit3dUBK7MnznH6x2wjswTm7O', 0, NULL),
(732, 11608630, '1', 'SANDOVAL MUÑOZ DANIEL GONZALO', 35, 2, 3, 4, 'd.sandoval.1', '$2b$10$DlYQxumFi6DXfr3UVrgn8eRoIo4UdjoNKZsaTQS/tgEFzNmWRY/Va', 0, NULL),
(733, 16763921, '6', 'SANHUEZA MARDONES ALDO ALEXIS VALENTIN', 33, 2, 7, 4, 'a.sanhueza.6', '$2b$10$GlCNMiTO0.joRDSKtU7tHuWCSRpbHuqT5tucDaKUks63lwi8yA1Om', 0, NULL),
(734, 12382837, '2', 'SANHUEZA MUÑOZ CLAUDIO ANDRES', 4, 2, 4, 4, 'c.sanhueza.2', '$2b$10$Tn2sFuyKxvD17o2AVX2y1.38rs8rs4O.I8H5mGVW7mtfOoleCJcwC', 0, NULL),
(735, 8904017, '5', 'SANTANA RODRIGUEZ JUAN PABLO', 8, 2, 2, 4, 'j.santana.5', '$2b$10$SUPeXOgLEclWFxwqO/HGS.NsonFn9NwQpu8sTlNkKF8SjvMO4ub52', 0, NULL),
(736, 16577266, '0', 'SANTIBAÑEZ ARCUCH KAREN VALESKA', 61, 2, 1, 4, 'k.santibañez.0', '$2b$10$IldSdap8Qkn9Gcxa7f11aOrFAIZq9/WGxLyBYTjM4V3KsVSYRRm9.', 0, NULL),
(737, 18420969, '1', 'SANTIBAÑEZ CARVAJAL FELIPE ANDRES', 64, 2, 1, 4, 'f.santibañez.1', '$2b$10$Iiz1p3nZD3wRv3cAyRBIt./Kzw29XSpxbd3Q8mRRe4VgweZM2xVy2', 0, NULL),
(738, 9816028, '0', 'SANTIBAÑEZ GARATE MARIA', 15, 2, 3, 4, 'm.santibañez.0', '$2b$10$WjqYu4wveaQRnSR6sA2dVevPASyNMWYS5F9Cmx/NmoFLDEATllu1q', 0, NULL),
(739, 20878892, '2', 'SANTIS MARIN VALERIA ANETTE', 1, 1, 3, 4, 'v.santis.2', '$2b$10$jnj/uweVRZNMggKWXaLM8eCFXVbi7pBQHqlep9I66y/.V82NfjQvi', 0, NULL),
(740, 18213651, '4', 'SANTIS URBINA CAMILA PAZ', 73, 2, 1, 4, 'c.santis.4', '$2b$10$e0VH6SXkEVjBSStPOrk0kOa04HT70ydu3RkX5PdSKidINU9lJecDe', 0, NULL),
(741, 15819536, '4', 'SCHULMEYER JARA CARLOS PATRICIO', 69, 2, 1, 4, 'c.schulmeyer.4', '$2b$10$AjtW9SWn8DaWo6Ga5qb3W.n7OVcW8xfhk4t9t5DmSer.OLx6VJTty', 0, NULL),
(742, 15842137, '2', 'SCHWARZENBERG CALDERON STEPHANIE HELGA', 22, 2, 3, 4, 's.schwarzenberg.2', '$2b$10$foJ/exE2BXd0iCCr/jvBOuANrhb7Js1VapdRS7Uu5limIAQWsXZN2', 0, NULL),
(743, 16977251, '7', 'SEGOVIA VILAZA JOSE LISANDRO', 32, 3, 1, 4, 'j.segovia.7', '$2b$10$y6i4t1U2QRGhWG2Fl6ef4eleWEV892bNFH6mMCHrJyL8mIjiaG8H6', 0, NULL),
(744, 18212285, '8', 'SEPULVEDA HERNANDEZ MAIRA NICOLE', 19, 2, 1, 4, 'm.sepulveda.8', '$2b$10$aDTYl7vWhzpvU1E8jalWjuYBATiZ43v9XMraw5JN5EVuGmLSRiDWO', 0, NULL),
(745, 14312912, '8', 'SEPULVEDA SANCHEZ CARLOS PATRICIO', 18, 2, 5, 4, 'c.sepulveda.8', '$2b$10$zwefsjvsVOosZE9jlrrZR.UDgHKSHS2M7XsfqqSxRm/WcjkAueWS6', 0, NULL),
(746, 10456698, '7', 'SERRANO ADASME NELLY DEL PILAR', 8, 1, 4, 4, 'n.serrano.7', '$2b$10$MrKqmfbjYCblqiYFQMSnw.Pj5P5ayev0v22IaOgvS4cVfggP36ji6', 0, NULL),
(747, 17683043, '3', 'SERRANO GONZALEZ GERARDO ANDRES', 8, 3, 1, 4, 'g.serrano.3', '$2b$10$euCM3Yv3kU/bK59WglLjxOlM2qlbd.ukbaMwMOm5HncymVPGw6QyW', 0, NULL),
(748, 19411278, '5', 'SERRANO SILVA AGUSTIN FELIPE', 8, 2, 3, 4, 'a.serrano.5', '$2b$10$JPfkmvfi/dPp.ocPF2ZXa.Q/VfWPZKj1HJxx9CEKEJ9TXdB.huxw2', 0, NULL),
(749, 21207085, '8', 'SIERRA ARREAGA BRESILDA ELIZABETH', 40, 2, 2, 4, 'b.sierra.8', '$2b$10$z0uw68zc/TOqGZkW7ukIa.efFR0W36kp5ihnOEqrgekGbjZaCq/Ju', 0, NULL),
(750, 16576369, '6', 'SILVA AGUIRRE NATALIA ALEJANDRA', 11, 3, 1, 4, 'n.silva.6', '$2b$10$xdU8Q7LkQSZRZs1.k391Ye9j8gcTwqEevZMS9ObW.wR9prp0hJDku', 0, NULL),
(751, 8079867, '9', 'SILVA ALVAREZ SERGIO EMILIO', 8, 3, 4, 4, 's.silva.9', '$2b$10$aHjEMK3pJQN/m4wcDO2qheGDXgHWOhfAmj2ecGl9KhO/OnjkevQEO', 0, NULL),
(752, 20310562, '2', 'SILVA ARAYA BARBARA ELIANA', 7, 1, 3, 4, 'b.silva.2', '$2b$10$jDc2DJhsuYhAnWxZVXqm2O5IEF4qGkNo04MyZEOH2PU/f3/jQ9FNi', 0, NULL),
(753, 17397649, '6', 'SILVA CACERES NATALIE CAROLINA', 8, 2, 3, 4, 'na.silva.6', '$2b$10$2rguUQpTNrtF8nVNqnOs3eYOj.QuoBcQwVYjgwPzxn6Qwvngkm0pq', 0, NULL),
(754, 20603770, '9', 'SILVA CASTAÑEDA SOFIA BELEN', 7, 1, 3, 4, 'so.silva.9', '$2b$10$oRM3qCE.ECy8eL.afCGPU.HelRv3QRXZmh8VPnYEx/0v65Y2e0eSq', 0, NULL),
(755, 12182675, '5', 'SILVA GARATE MARCELO FERNANDO', 33, 3, 7, 4, 'm.silva.5', '$2b$10$RRS2sVHMCT9J4BbVXoM5PuROM8QSx/jvLEdxEjbE5GLwtJexewMQ6', 0, NULL),
(756, 17935038, '6', 'SILVA GONZALEZ MYRIAM PENELOPE', 13, 4, 2, 4, 'm.silva.6', '$2b$10$nOb3f0L1OpDKyNLXYije0eaEWB4GD8pGU1bwDIvgjIR5K2z3QEb2i', 0, NULL),
(757, 18487673, '6', 'SILVA MANZO CAMILA ALEJANDRA', 21, 2, 3, 4, 'c.silva.6', '$2b$10$6ZWLqrMFDYn/pY4tp24C2O1uF5bJKj2oAKvjrb7yjbgyVdY1CKAAe', 0, NULL),
(758, 19161913, '7', 'SILVA SEPULVEDA CARLOS IGNACIO', 39, 2, 1, 4, 'c.silva.7', '$2b$10$MEP5ISiX2Jc29kIDNblpsO8Z/.PakX0Y2OWKtL3U/kBUU6..O7Zq6', 0, NULL),
(759, 17986960, '8', 'SILVA VALDES VICTORIA CAROLINA', 7, 2, 3, 4, 'v.silva.8', '$2b$10$wtgdL33k9pS5J8OxHYIwQe.gHCzVVzA9jCilvqJVhQfIPu5YKFudi', 0, NULL),
(760, 14037535, '7', 'SOLIS CARDENAS CRISTINA VALESKA', 9, 2, 1, 4, 'c.solis.7', '$2b$10$2k9DFP7gu26V.0EdoKZHw.aNbkhMItHqW6ccxaf0mDiR8uzeRimwK', 0, NULL),
(761, 25515050, '2', 'SOMAROO LUNA INES ELENA', 25, 2, 2, 4, 'i.somaroo.2', '$2b$10$vsLwJAihO3Y54n7WQjLDcuPsFhWspJC0/wbVEy.pVQfATNlpNFd2C', 0, NULL),
(762, 13067791, '6', 'SOTO BRAVO CAROLINA VICTORIA', 48, 2, 3, 4, 'c.soto.6', '$2b$10$2Aa5ImOR3ylyBxECHdmL/u5kOLUCWa5MqwFZLujXZ68KKIC57lQHa', 0, NULL),
(763, 12799316, '5', 'SOTO MIRANDA KARINA DE LAS MERCEDES', 1, 3, 3, 4, 'k.soto.5', '$2b$10$B4CGO8I0dbvoiskRJDVQ8uZxiLT8ZkhRpXV99sdUDAifTkqNNiLDC', 0, NULL),
(764, 19411271, '8', 'SOTO PROBOSTE ARANTXA NICOLE', 13, 4, 2, 4, 'a.soto.8', '$2b$10$uI9SxvPTZQSRlmid/ouhaOhOTsMudp42nnf.TWW24Qc3XsKtZZn4O', 0, NULL),
(765, 25887702, '0', 'SUCRE TALY JOSE ANTONIO', 11, 2, 2, 4, 'j.sucre.0', '$2b$10$D5CoYcXkAwb/2u88DNcU.e1SJgQCo6pasz31zPtmL.BjN.oT0OCKC', 0, NULL),
(766, 19412980, '7', 'TAPIA GUIÑEZ GIOVANNY ANDRES', 54, 2, 1, 4, 'g.tapia.7', '$2b$10$cNpXHx/W6YkHBqhe/zAd5Opz2uOdDhlMVFZPteHLndSpLvGiI61UK', 0, NULL),
(767, 9213531, '4', 'TAPIA JORQUERA MARGARITA BEATRIZ', 22, 3, 1, 4, 'm.tapia.4', '$2b$10$HpbkjMkADqpErcFbV0aQzebba6uGZinLC8A0iqCrfKAWLhk1UO0/a', 0, NULL),
(768, 17683824, '8', 'TAPIA MUÑOZ NICOLE DIANA', 1, 1, 1, 4, 'n.tapia.8', '$2b$10$/XM.5mkU64KiiMQNTZIhIenAt4djhzHBuDr5X/UQZNNnhGHZAFWLK', 0, NULL),
(769, 17683886, '8', 'TOBAR ZUÑIGA NICOLAS LEOPOLDO', 32, 3, 3, 4, 'n.tobar.8', '$2b$10$GrnoLfrYsTcI48rbgFVgLODhyr6M1.tk9EdcwO1Tx689MxmqsIQ0m', 0, NULL),
(770, 17082041, 'K', 'TOLEDO ZUÑIGA MARIA PAZ', 25, 3, 1, 4, 'm.toledo.k', '$2b$10$Exsj6.EFsCis7SafD5bS2ubIRoAsgXzfeqabShLBfa52FNC/TRyFi', 0, NULL),
(771, 17683181, '2', 'TOLOZA MALLEA SEBASTIAN ANDRES', 11, 2, 1, 4, 's.toloza.2', '$2b$10$j2lzb8zsDnF5tgu02XZ6e.72dad1mT70kVD2Tg0FhUftuUOEq0SqK', 0, NULL),
(772, 13519940, '0', 'TORO ALVEAR HERNAN LEONARDO', 33, 2, 7, 4, 'h.toro.0', '$2b$10$uFgTFASmnYfGWDVWiav67O7qTw3G0VLc1d4q75m/LFJgFfsR3qUTe', 0, NULL),
(773, 11396192, '9', 'TORO CHAVEZ FABIOLA CARMEN', 51, 3, 3, 4, 'f.toro.9', '$2b$10$sPQZCMfdNRSvx.zbGg4mFeewHI7acB8UnDHNnYxzUaBo2YUdWEjYq', 0, NULL),
(774, 19513637, '8', 'TORO FIERRO CAMILA IGNACIA', 38, 1, 1, 4, 'c.toro.8', '$2b$10$QElbaGQV2Y/VBpR/EV64cepCxnDYUf2UJes4KFwkGV29Fwm5SQgaW', 0, NULL),
(775, 17398253, '4', 'TORO GONZALEZ PAOLA GRACIELA', 33, 2, 3, 4, 'p.toro.4', '$2b$10$4pmVft3evqTPltOKLV0NpOQgcoQ0fn7MjLvBksJtMXVXPUPif9FLK', 0, NULL),
(776, 18777068, '8', 'TORO IBARRA ARACELI DE LOURDES', 51, 2, 3, 4, 'a.toro.8', '$2b$10$Ea2iSLiWX/FYf4jlt.mxUukpLk1pxnh/sfGRzZqqiuYLCk7ui.WiW', 0, NULL),
(777, 26211941, '6', 'TORRES CORDERO ISNARDLYN EUMAR', 6, 2, 2, 4, 'i.torres.6', '$2b$10$WCOs60ZuZwoNMzgR/lZ3cemfh6tXewlxBDBaQOeXcD2wrtx9fi7j6', 0, NULL),
(778, 15087288, 'K', 'TORRES GONZALEZ RAQUEL PAULINA', 8, 3, 3, 4, 'r.torres.k', '$2b$10$IQ398FtCwCSLhiPhQWG5OO0MRFPp9SMMdW032U1nXH9iSAacq2U.W', 0, NULL),
(779, 27735128, '5', 'TORRES MORILLO ISNARD RAIMUNDO', 16, 2, 2, 4, 'i.torres.5', '$2b$10$qSutG.oxPMUWafkWeydLJOYp.GUBltKp/muAMPSgeBKoRL0cvrNWi', 0, NULL),
(780, 20389540, '2', 'TORRES QUIJADA CAMILA CONSTANZA', 11, 2, 3, 4, 'c.torres.2', '$2b$10$3RoSibWdbjXosUYpgfN8SePlADYvDKRMQxLTekOISqgRYtXqO6V5C', 0, NULL),
(781, 19292440, '5', 'TORRES RODRIGUEZ RICARDO ANDRES', 13, 4, 2, 4, 'r.torres.5', '$2b$10$9AJp2BKr1WD.0HsdVBT0UObGsjUz20eAW8fIT2JfHUtn370p3JSdC', 0, NULL),
(782, 19771000, '4', 'TRONCOSO ETCHEPARE JOSEFA ANNETTE', 13, 4, 7, 4, 'j.troncoso.4', '$2b$10$OgE1ns0HNtkNKrjl8n7Cn..2cNkOygKhqF74JR1qEBihx8giiqBLu', 0, NULL),
(783, 12411599, 'K', 'TRONCOSO HERNANDEZ MARIA ROSA ELBA', 22, 1, 4, 4, 'm.troncoso.k', '$2b$10$ospzNePFNaJHq2yz.SZm2uxh4lfj3K4XdwfJC2H8Jo1cSjdWTTBia', 0, NULL),
(784, 9133736, '3', 'TRONCOSO MALDONADO MABEL CARMEN', 7, 3, 1, 4, 'm.troncoso.3', '$2b$10$zaAfAuNJ/d1O/CmfDiUM/ea0X4u69B3o4D..5f8fY1J2x1yKuqOuK', 0, NULL),
(785, 11521413, '6', 'TRONCOSO PAREDES ROSA IGNACIA', 8, 1, 4, 4, 'r.troncoso.6', '$2b$10$Q60Z3qjRs6MTUeofgMpjTO2gnpBtWVQ68TIBXGpIDrMrwhe1oEPLa', 0, NULL),
(786, 10325844, '8', 'TRUJILLO CATALAN YOLANDA EUGENIA', 41, 2, 5, 4, 'y.trujillo.8', '$2b$10$1JFf9xp33wr5Zv1pvWe0EuWfPFtZs5PIQY3j6MmGcIONX6yq4F0Hq', 0, NULL),
(787, 11396125, '2', 'ULL GALAZ CRISTIAN MILKO', 70, 2, 2, 4, 'c.ull.2', '$2b$10$Y6An91DLjfQigMRE3ax61ex4N6etJ3fgkMwAY8.qfiAo5vU2r1Rza', 0, NULL),
(788, 18487942, '5', 'URBINA BARRERA CARLOS PATRICIO', 32, 2, 3, 4, 'c.urbina.5', '$2b$10$K2536LHRPa2RKHwgb2FVeucjzxh0pUR5shrMBa6PuT47QCXSWlY7C', 0, NULL),
(789, 20285456, '7', 'URBINA NERCELLES NICOLE ALEJANDRA', 8, 2, 3, 4, 'n.urbina.7', '$2b$10$CKnCRRs6aRatkqVyeB9rOOHW06FZBq0x4tK9z/jqdoFWdox9isALe', 0, NULL),
(790, 13559239, '0', 'URBINA SANTANDER JEANNETT MONICA', 3, 3, 3, 4, 'j.urbina.0', '$2b$10$ngrmdwzuWM2wrqOn85Crh.eDr/j2UO5aVWFM.X2IbWnStUSoiJwCa', 0, NULL),
(791, 19056148, '8', 'URCULLO PEREZ ALONSO ESTEBAN', 39, 2, 1, 4, 'a.urcullo.8', '$2b$10$820RuNgwKKCozf.B.mUZIOJjJfI8retEbJzaG7AJcaVadmAh7AMNq', 0, NULL),
(792, 8523001, '8', 'UTEAU MALDONADO MARCELA ALEJANDRA', 74, 3, 2, 4, 'm.uteau.8', '$2b$10$.g22zq9oNGyHt5mJlPwDy.b8Zmc8eiADt.ixlLuyl/jtW9fMWLJlq', 0, NULL),
(793, 18777893, 'K', 'VALDERRAMA AGURTO MACARENA ALEJANDRA', 20, 2, 3, 4, 'm.valderrama.k', '$2b$10$q/mvWd.gptrFHdbf16irOeTf/JX.XQTDIM0WUrydDzK6nTDuBNHEu', 0, NULL),
(794, 11396139, '2', 'VALDERRAMA CARRASCO LORETO EVANGELINA', 7, 3, 3, 4, 'l.valderrama.2', '$2b$10$jESfslIJ9za/8O7Qh0Gwr.Jnn.tWqojwC0H0zey3oz75Zs/nmNN8O', 0, NULL),
(795, 10143820, '1', 'VALDES BRAVO MACARENA DEL CARMEN', 7, 2, 4, 4, 'm.valdes.1', '$2b$10$KOdsOJBR3HBoQqSzXoG6p.Iub97oFu9hPxV4Rp0IlWZ2XCChzFoii', 0, NULL),
(796, 16577480, '9', 'VALDES HERNANDEZ NICOLE FRANCHESCA', 8, 2, 3, 4, 'n.valdes.9', '$2b$10$7OK30HYqhlWW5FE9ZNdGKecjfYrZc5k0MPk0wsFTyh3YABHtQqJli', 0, NULL),
(797, 18665057, '3', 'VALDES JARA CONSTANZA ALEJANDRA', 27, 2, 1, 4, 'c.valdes.3', '$2b$10$iJSs2naO.d2piH8gvBaX3uSAEEh1u18qZhHLQU6KhqDR7rmJd/1zW', 0, NULL),
(798, 8816718, 'K', 'VALDES OLMEDO MARCIA PATRICIA', 14, 2, 4, 4, 'm.valdes.k', '$2b$10$g22jG9UQE0Oyssvhm8h0kuoDswMKgiD4JEfPmwmtjy9/lkxC/mrsW', 0, NULL),
(799, 18123882, '8', 'VALDIVIA GOMEZ JOAQUIN ANTONIO', 16, 2, 1, 4, 'j.valdivia.8', '$2b$10$UY/uclApzALrhSu.8LvRYegvT9QcQUGYYI.4IyApsopKPU5BUlFei', 0, NULL),
(800, 16855615, '2', 'VALDIVIA POBLETE KATHERINNE MAGALY', 15, 2, 3, 4, 'k.valdivia.2', '$2b$10$DsSG0rYFxYYS/lMTtsCsAO6BTIq6afRnSNtOjV7uPrP1UzfkxisMq', 0, NULL),
(801, 7197297, '6', 'VALDIVIA SALGADO GERARDO EDUARDO', 6, 3, 2, 4, 'g.valdivia.6', '$2b$10$klHSJXaOKx8rQJ9lHrdgiu/nGcAhe9lVEsoZZmNnLTrko07SYGufW', 0, NULL),
(802, 25630195, '4', 'VALENCIA BUSTAMANTE BLANCA RUBY', 25, 2, 2, 4, 'b.valencia.4', '$2b$10$yHxTM6B4R/zL/ljLTp3AOOMHyY7Z3Vd1ktmA5yffqONKmxae8k60e', 0, NULL),
(803, 16576686, '5', 'VALENZUELA ARCUCH JOHANA ANDREA', 11, 2, 1, 4, 'j.valenzuela.5', '$2b$10$Hotg.hAKqS5tawhxqZGZE.3hBzpzoth9D0E1Phk1jPWCIURqgbU.i', 0, NULL),
(804, 18778378, 'K', 'VALENZUELA FARIAS NICOLE PATRICIA', 8, 2, 1, 4, 'n.valenzuela.k', '$2b$10$XjIb6LTlyAihdSChyi7lKe8/izIPZyf8coC1pYm1n20yjna.m8BA6', 0, NULL),
(805, 13559773, '2', 'VALENZUELA MONDACA CAROLINA ANDREA', 7, 3, 3, 4, 'c.valenzuela.2', '$2b$10$em6tMnE2IjMgkmFN0u76VOdIWM2AUlcJKGH.6ANkSmshCnTLjm3jG', 0, NULL),
(806, 17398300, 'K', 'VALENZUELA TAPIA FERNANDA DEL CARMEN', 27, 2, 1, 4, 'f.valenzuela.k', '$2b$10$Ly33j8XSPgn1nil5STCYQ.uNdYPFUYccTnk.EFGK1cuHZGmKz3mTG', 0, NULL),
(807, 25541938, '2', 'VALERY ALVAREZ NOEL VIZNEL', 74, 2, 2, 4, 'n.valery.2', '$2b$10$aM0eSgujWqC20abj5zBhUuun/ot7o7XEHVCdcHSsrqpo2WuK9SGfG', 0, NULL),
(808, 20603416, '5', 'VALLADARES MARAMBIO MARTIN EDUARDO', 1, 2, 3, 4, 'm.valladares.5', '$2b$10$Wk8XnwEMHEHbDkLQXPctTeYkfbt1RxHGp3hqPMgjnGvaYSnbbPoPy', 0, NULL),
(809, 17682553, '7', 'VALLADARES MOYA JUAN JOSE', 25, 3, 3, 4, 'j.valladares.7', '$2b$10$UOtaW5g.693WfgFwh2Pht.ya8yLS5E2ZLzAtrWmTUga6xHdddP1Zm', 0, NULL),
(810, 12411662, '7', 'VALLADARES ORTIZ LEYLA CAROLINA', 44, 2, 1, 4, 'l.valladares.7', '$2b$10$y84peEgA/w3D0VplkI1KqewIj4mPDfXNTfkXw5XYLD.0EFq/L4bqC', 0, NULL),
(811, 15866379, '1', 'VALLEJOS PAILAMILLA BARBARA CATHERINE', 14, 2, 3, 4, 'b.vallejos.1', '$2b$10$.UF3HAkMpmjfdKoy62421OovjXgDEPYoknLAffmFwZ3ATMKZJxwZy', 0, NULL),
(812, 16473195, '2', 'VARAS DIAZ JOCELINE PAMELA', 7, 2, 3, 4, 'j.varas.2', '$2b$10$nfZSIrl53XgPUrn1NDl7bO6Ihz9Xt5BZtQCdn98zQELkvikCp91ee', 0, NULL),
(813, 10705861, '3', 'VARGAS CHAVEZ EUGENIO ALBERTO', 21, 2, 6, 4, 'e.vargas.3', '$2b$10$LYKf9dSgvzT/5aBVuGot6.QUXUqg5ebgpErFQVueVWw5KcVADE7qK', 0, NULL),
(814, 15301554, '6', 'VARGAS CONTRERAS MITZIANNIE STEPHANIE', 46, 2, 5, 4, 'm.vargas.6', '$2b$10$/kkirtzxIwZBHPCXL4mx4uMW6d7ZKxD2ZrrZ23UF2TVZJYAZCRrBe', 0, NULL),
(815, 8578583, '4', 'VARGAS DURANTI OSCAR CALIXTO', 8, 3, 2, 4, 'o.vargas.4', '$2b$10$qyzXE36jEOuEZHILTdqfGuDvAYLwkKFY9BjD3EqWMZSN.82FyGjQq', 0, NULL),
(816, 17683152, '9', 'VARGAS ESCARATE NICOLE ALEJANDRA', 7, 2, 3, 4, 'n.vargas.9', '$2b$10$zS1/aK2fW1wdYOgOBOkIoO9P6jMADVRO911eG3CxyMgzaXU.0Bhq.', 0, NULL),
(817, 20311955, '0', 'VARGAS GOMEZ CAMILA ALEJANDRA', 8, 2, 3, 4, 'c.vargas.0', '$2b$10$bTsbQzezEnG9qYsvU.CJueuZhxuFqdB9tSYN8BpmFYVbd0LSeaFPG', 0, NULL),
(818, 18571272, '9', 'VARGAS RODRIGUEZ ELISA ANDREA', 16, 2, 1, 4, 'e.vargas.9', '$2b$10$DVPcvioQbT6qqV9hrvQNEOKOf2pdWFgCv.MdHE13vAHSc0Ckpc5rK', 0, NULL),
(819, 16670036, '1', 'VARGAS ROMERO BARBARA VALENTINA', 8, 3, 1, 4, 'b.vargas.1', '$2b$10$c9HYMEVKvmB843/zzyF/1etu5XTGYJcZrY6e6Ra1Rzq1xq.FJMD26', 0, NULL),
(820, 11608575, '5', 'VARGAS RUIZ SANDRA PAOLA', 38, 3, 3, 4, 's.vargas.5', '$2b$10$x0VlHSvPTKmDtFSclebm6e4NMQ2jRnbdvBPOZlIavrWidpqLw4OeC', 0, NULL),
(821, 17081292, '1', 'VASQUEZ VALDES KARINA OMAYRA', 32, 3, 1, 4, 'k.vasquez.1', '$2b$10$gcgKXA8Zh.FsQG5lgE2ryOgmhgS3/Tx00NJstoVzRZzORYlGPfUmS', 0, NULL),
(822, 16204762, '0', 'VEGA MUÑOZ ANDREA DEL PILAR', 31, 2, 3, 4, 'a.vega.0', '$2b$10$CMAMnHBvfLni8JEwPUHqiO4FvUShP.0jzzLIgXeCKB5BIHZt4S/3S', 0, NULL),
(823, 14596137, '8', 'VELEZ CRESPO JOEL ROMEO', 19, 3, 2, 4, 'j.velez.8', '$2b$10$NYxBVyL8X8a4gmDL8zgmK.iFkV9z5/LOEBFuyoD8YKD8.xRODiZtO', 0, NULL),
(824, 16291091, '4', 'VELIS GONZALEZ HERNAN PABLO', 32, 3, 3, 4, 'h.velis.4', '$2b$10$5RPYcHfV8Lii2QL2T383Nu/dn4n1TG87.dLhg5TXphv1EMFJwJXES', 0, NULL),
(825, 14643840, '7', 'VELIZ ROMERO JOHN SMITH', 7, 2, 2, 4, 'j.veliz.7', '$2b$10$aAyC8Od5Q8RkrqEfCtHHE.hTyMQa.GoPvXrvAJsZFnxWFxaSsPQG.', 0, NULL),
(826, 18598032, '4', 'VERA ASTORGA ANA MARIA', 21, 2, 3, 4, 'a.vera.4', '$2b$10$Mznuyvu7pB.RtxYJQck34.L4sLhizCVLEs0iFOxA/oizWYo.xttuK', 0, NULL),
(827, 16855964, 'K', 'VERA CARTAGENA PATRICIA DEL CARMEN', 21, 2, 3, 4, 'p.vera.k', '$2b$10$KnWXjloalEPsJvYubRMraOaqmIr6yjl/GkthOloSc4548da8c/tVm', 0, NULL),
(828, 14312628, '5', 'VERA MAUREIRA YENNY CAROLINA', 38, 2, 1, 4, 'y.vera.5', '$2b$10$xVB5JJ8wIjA2K53LEesNXOBIgyjRq2NXI6npdfzIYm.FwbkNx/JHG', 0, NULL),
(829, 17397889, '8', 'VERA PEREZ CHRISTOPHER ANDRES', 7, 2, 1, 4, 'c.vera.8', '$2b$10$U6fqXTahxn02Y0REn9EXe.zEonSJmp4SZ4HhrNaJ2Zt.cwKeN.7PO', 0, NULL),
(830, 18950478, '0', 'VERGARA GONZALEZ DANIELA YASMIN', 25, 2, 3, 4, 'd.vergara.0', '$2b$10$s.YKYumcEXAemy9L8.UcVO70.7JHZ2pQbVIEQ8VlDGlDbhMWT76Su', 0, NULL),
(831, 14007409, '8', 'VIDAL CERDA CAROLINA DE LOS ANGELES', 16, 2, 3, 4, 'c.vidal.8', '$2b$10$NgzXMzcJXk/Onl3ZlfOr0uVvNwUSOBijDYzCW3Wtmo5ZkmXnvzk4C', 0, NULL),
(832, 15865812, '7', 'VILCHES HERMOSILLA ANDREA CRISTINA', 22, 2, 3, 4, 'a.vilches.7', '$2b$10$Xn8FOkrpc133j/y65iOJ/ufrbi4fAhUMlT8OEmwZZVF4NQwlGktQK', 0, NULL),
(833, 13559794, '5', 'VILCHES YEVILAO ALICIA DEL CARMEN', 11, 2, 3, 4, 'a.vilches.5', '$2b$10$DYxwYg7y182/LNoBQNhNb.5pLP6B4Tsad1kAlBXIIuq11Pjn/ZTBq', 0, NULL),
(834, 7673145, '4', 'VILLARROEL RAGGI LUIS ALBERTO', 7, 3, 2, 4, 'l.villarroel.4', '$2b$10$qhjBfMuKA8bSaFrhOvKizOMGG6YFaKHE7CRanhnLkGCfVxcNZn5oC', 0, NULL),
(835, 27207677, '4', 'VILLASMIL CHIRINOS STEPHANIE CRISTAL DE LOS ANGELES', 11, 2, 2, 4, 's.villasmil.4', '$2b$10$d5MvfdpaYeCnaXG/oMEeq.Cjw8qgF2nnm9hqOV9bhYWnjz3t5Lkee', 0, NULL),
(836, 27130921, 'K', 'VILLASMIL NUÑEZ JOSE ALEJANDRO', 8, 2, 2, 4, 'j.villasmil.k', '$2b$10$vZ9PbdYRi5VU4CQ.4vIRKuRUiD37d5/hnanOKpgfdmCv0BSIUcQny', 0, NULL),
(837, 18777454, '3', 'VILLEGAS TORO JUAN PABLO RAUL', 39, 2, 1, 4, 'j.villegas.3', '$2b$10$N0EoswB6oFPzO84A3KB1xu0EM30/ORJZ76va/tSxg6ouAmS.LiUfK', 0, NULL),
(838, 11608246, '2', 'VILLEGAS VERDUGO PAOLA MARIA', 33, 3, 3, 4, 'p.villegas.2', '$2b$10$pNak1xhseqCXzTcE/PIWWeBgQJY482eo8jaoTfJyiyFIy53k2R7ka', 0, NULL),
(839, 14501548, '0', 'VILLEGAS VIGUERAS ANGELICA CLAUDINA', 39, 2, 1, 4, 'a.villegas.0', '$2b$10$OuYw9XCdzjwupS4vk4KnfuvrVJNfQLIZVNKOKR47ZCZX6njfW1Xwy', 0, NULL),
(840, 9241321, '7', 'VILLOUTA VILLARROEL ANA MARIA', 30, 3, 8, 4, 'a.villouta.7', '$2b$10$v3615Yv1C1tITzx3XF1AguxZPnhcTiP3uqULVR772Sy9VM7VS4ZtO', 0, NULL),
(841, 24794830, '9', 'VINASCO MARIN LUZ ADRIANA', 19, 2, 3, 4, 'l.vinasco.9', '$2b$10$Eh73cOD/hwJ.Az2BuApdeOL9dzZ68EoxyJXBlMV/S026CGeyv6dv6', 0, NULL),
(842, 6548478, '1', 'VITTINI MORALES MONICA ADRIANA', 74, 2, 2, 4, 'm.vittini.1', '$2b$10$U7ucuwPWCWjLKxqCvm3Hr.GkXbDEzzHtQdbDljHLbwRJXsmtWAYvO', 0, NULL),
(843, 17314117, '3', 'VIVEROS GUAJARDO HERMAN FRANCISCO', 8, 2, 2, 4, 'h.viveros.3', '$2b$10$p9d0vPWUcs9u0ZlOkGmSYOC4jbQCyGhArK8vlMMOQJCW0lXsuT5Ay', 0, NULL),
(844, 14465983, 'K', 'WALTON TAPIA MONICA', 27, 3, 1, 4, 'm.walton.k', '$2b$10$KVQASN5EmSYHF085STpEuO53OsmdBbqYQqxr5dQkBGzusa1bgLWH.', 0, NULL),
(845, 17217090, '0', 'YAKSIC CARRASCO FERNANDO JAVIER', 25, 2, 2, 4, 'f.yaksic.0', '$2b$10$otld6ksJKT9JMGSejclfeuRwwNUhc926xyhtSewgtgCaRCKx6WMH.', 0, NULL),
(846, 11689627, '3', 'YAÑEZ ERCOLI ROSSANA LORENA', 79, 2, 1, 4, 'r.yañez.3', '$2b$10$cfzQnOrjo1A3.i2lB6Yi9eNR80ESzYAXQm9eVwAFipw8UKT0j.OqK', 0, NULL),
(847, 16083751, '9', 'YAÑEZ RUBIO FRESIA DEL CARMEN', 7, 1, 3, 4, 'f.yañez.9', '$2b$10$AfDHoyh.zpZzylOD95QsSeqBBR6qNTCeLyLvuwtBGI57Y/HuNJetG', 0, NULL),
(848, 12411559, '0', 'YEVENES JEREZ ELIZABETH PALMENIA', 21, 2, 6, 4, 'e.yevenes.0', '$2b$10$UGdWgDWCKaRFU2gZPes3R.5Ko34i6AjGgjq/7DmOSNvKN0SMhtvN.', 0, NULL),
(849, 17099142, '7', 'ZAMBRANO UBILLA JOHANA FRANCISCA', 35, 1, 1, 4, 'j.zambrano.7', '$2b$10$fZpKJ7xE5EHgyIV2/6WvsOvxObPeeTsVB3j0UuK0UYz8vOZqIiylm', 0, NULL),
(850, 23309568, '0', 'ZAMORA SUAREZ ARELI MARICELA', 8, 2, 2, 4, 'a.zamora.0', '$2b$10$/lP8.rl8424gjV/e3ly3OeNIB7lPD6DpHDiqRlqBFgmZUqPBr1VEy', 0, NULL),
(851, 13233272, 'K', 'ZAPATA MONTECINOS MACKARENA ALEJANDRA', 80, 2, 1, 4, 'm.zapata.k', '$2b$10$2z81kv.9.MHusAJiBTqXd.vWyU4CEtDPqfnSf5vYjfgftGD4YnHrG', 0, NULL),
(852, 18200185, '6', 'ZARATE TORO CARLA ANDREA', 21, 2, 3, 4, 'c.zarate.6', '$2b$10$2AJwAqtOYguZCgWWlx1Qper6KNg2xnTx6RqP8qKHgLVFRRv/mdPbi', 0, NULL),
(853, 26590229, '4', 'ZECHINI IBARRA VERONICA ANDREA', 25, 2, 2, 4, 'v.zechini.4', '$2b$10$xvVgNlxYM.CiKkQk8KD6LuU7NRwjx8p2yRKLSLaiHPjJODLjNfWoy', 0, NULL),
(854, 16911259, '2', 'ZUCHEL DIAZ TIARE ALEXSANDRA', 35, 2, 1, 4, 't.zuchel.2', '$2b$10$h6IyicYq/3EERcQyUnbJVObdE7hhrQbclCBayCOHVQRLCPsHEgUbW', 0, NULL),
(855, 15866084, '9', 'ZUÑIGA ALVAREZ CAROLINA ALEJANDRA', 3, 2, 3, 4, 'c.zuñiga.9', '$2b$10$hMSZTzKK9CdWqwmcepHj8./l3QRWmNRnv/pPk92Lg4oO3OAcWoakG', 0, NULL),
(856, 18212281, '5', 'ZUÑIGA CARTAGENA ANA MARIA', 16, 2, 1, 4, 'a.zuñiga.5', '$2b$10$qnf.mHLPw8E7oq9pTChTWeSKAPlM7UDnHAsf84KdoEB2jJnoVc5UC', 0, NULL),
(857, 13560145, '4', 'ZUÑIGA FUENTES LILIANA MARISEL', 8, 2, 1, 4, 'l.zuñiga.4', '$2b$10$DnOSYJaTwynAdcV68kZBl.72HxI7dpe8bwuHgt2g2jR49woaj/RoW', 0, NULL),
(858, 1, '1', 'Usuario Administrador', 4, 2, 5, 1, 'admin', '$2b$10$Lj0LTBwyGlIm2TdC.v81COW7PKKeWULiMz/7iwI92HjdnSoRQjKLG', 0, 'nacho@mail.com'),
(859, 651956, '1', 'Juan', 1, 1, 1, 1, 'juan', '$2b$10$lloQVJPHVv3sB72tmVwO6u0qmFpy66RxWH2NQWDa6Rc1G9yczXmdK', 1, NULL),
(870, 20880026, '4', 'Juan Manuel Olivares Jiménez', 1, 2, 5, 1, 'juanma', '$2b$10$vfTSZN7WgNz9jY7NQzgKRu1i/iFIk2KgvDBsmGhvKh2tIX4NV2MIC', 0, 'juan@mail.com'),
(871, 20911046, '6', 'Catalina Lazo', 1, 2, 5, 3, 'cata', '$2b$10$i6LedRjVIL7gKxrcmFozXOOPoF6aLzzxj3YLfHbE5Lj5uZGFiOVqG', 0, 'cat.lazo@duocuc.cl'),
(872, 18479818, '2', 'Natalia Godoy ', 6, 2, 1, 2, 'Natalia', '$2b$10$wIo..FCmhG9VRbsVqr/dVOFmlyw60Nb1k7YJyze.DKu9bday0GnyC', 1, NULL),
(874, 21051924, '6', 'Ignacio Díaz', 1, 2, 5, 1, 'nacho', '$2b$10$rxohrMcpMQI84OCSMMs8weU27RYilah1FHNC0sFoklZzZOtYRXpLu', 0, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `articulo`
--
ALTER TABLE `articulo`
  ADD PRIMARY KEY (`id_articulo`),
  ADD UNIQUE KEY `unique_nombre_articulo` (`nombre_articulo`),
  ADD KEY `articulo_subgrupo_ropa` (`id_subgrupo_ropa`);

--
-- Indices de la tabla `detalle_registro`
--
ALTER TABLE `detalle_registro`
  ADD PRIMARY KEY (`id_detalle_registro`),
  ADD KEY `fk_detalle_registro_articulo_idx` (`id_articulo`) USING BTREE,
  ADD KEY `id_registro` (`id_registro`);

--
-- Indices de la tabla `error_log`
--
ALTER TABLE `error_log`
  ADD PRIMARY KEY (`id_error`),
  ADD KEY `fk_user_error` (`id_usuario`);

--
-- Indices de la tabla `estamento`
--
ALTER TABLE `estamento`
  ADD PRIMARY KEY (`id_estamento`),
  ADD UNIQUE KEY `unique_estamento` (`desc_estamento`);

--
-- Indices de la tabla `registro`
--
ALTER TABLE `registro`
  ADD PRIMARY KEY (`id_registro`),
  ADD KEY `fk_registro_usuario1_idx` (`rut_usuario_1`),
  ADD KEY `fk_registro_usuario2_idx` (`rut_usuario_2`),
  ADD KEY `id_tipo_registro` (`id_tipo_registro`),
  ADD KEY `fk_id_unidad_sigcom` (`id_unidad_sigcom`) USING BTREE;

--
-- Indices de la tabla `servicio`
--
ALTER TABLE `servicio`
  ADD PRIMARY KEY (`id_servicio`),
  ADD UNIQUE KEY `unique_descripcion` (`desc_servicio`),
  ADD KEY `servicio_id_unidad_sigcom_fkey` (`id_unidad_sigcom`);

--
-- Indices de la tabla `subgrupo_ropa`
--
ALTER TABLE `subgrupo_ropa`
  ADD PRIMARY KEY (`id_subgrupo_ropa`),
  ADD UNIQUE KEY `unique_desc_subgrupo` (`desc_subgrupo`);

--
-- Indices de la tabla `tipo_contrato`
--
ALTER TABLE `tipo_contrato`
  ADD PRIMARY KEY (`id_tipo_contrato`),
  ADD UNIQUE KEY `unique_tipo_contrato` (`tipo_contrato`);

--
-- Indices de la tabla `tipo_registro`
--
ALTER TABLE `tipo_registro`
  ADD PRIMARY KEY (`id_tipo_registro`);

--
-- Indices de la tabla `tipo_usuario`
--
ALTER TABLE `tipo_usuario`
  ADD PRIMARY KEY (`id_tipo_usuario`);

--
-- Indices de la tabla `unidad_sigcom`
--
ALTER TABLE `unidad_sigcom`
  ADD PRIMARY KEY (`id_unidad_sigcom`),
  ADD UNIQUE KEY `uniqueUnidadSigcom` (`unidad_sigcom`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `username_UNIQUE` (`username`),
  ADD UNIQUE KEY `rut_usuario_UNIQUE` (`rut_usuario`),
  ADD UNIQUE KEY `email_UNIQUE` (`email`),
  ADD KEY `usuario_estamento` (`id_estamento`),
  ADD KEY `usuario_servicio` (`id_servicio`),
  ADD KEY `usuario_tipo_contrato` (`id_tipo_contrato`),
  ADD KEY `fk_tipo_usuario` (`id_tipo_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `articulo`
--
ALTER TABLE `articulo`
  MODIFY `id_articulo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT de la tabla `detalle_registro`
--
ALTER TABLE `detalle_registro`
  MODIFY `id_detalle_registro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT de la tabla `error_log`
--
ALTER TABLE `error_log`
  MODIFY `id_error` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `estamento`
--
ALTER TABLE `estamento`
  MODIFY `id_estamento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `registro`
--
ALTER TABLE `registro`
  MODIFY `id_registro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT de la tabla `servicio`
--
ALTER TABLE `servicio`
  MODIFY `id_servicio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT de la tabla `subgrupo_ropa`
--
ALTER TABLE `subgrupo_ropa`
  MODIFY `id_subgrupo_ropa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tipo_contrato`
--
ALTER TABLE `tipo_contrato`
  MODIFY `id_tipo_contrato` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `tipo_registro`
--
ALTER TABLE `tipo_registro`
  MODIFY `id_tipo_registro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `tipo_usuario`
--
ALTER TABLE `tipo_usuario`
  MODIFY `id_tipo_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `unidad_sigcom`
--
ALTER TABLE `unidad_sigcom`
  MODIFY `id_unidad_sigcom` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=875;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `articulo`
--
ALTER TABLE `articulo`
  ADD CONSTRAINT `articulo_subgrupo_ropa` FOREIGN KEY (`id_subgrupo_ropa`) REFERENCES `subgrupo_ropa` (`id_subgrupo_ropa`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `detalle_registro`
--
ALTER TABLE `detalle_registro`
  ADD CONSTRAINT `detalle_registro_ibfk_1` FOREIGN KEY (`id_registro`) REFERENCES `registro` (`id_registro`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_detalle_registro_articulo1` FOREIGN KEY (`id_articulo`) REFERENCES `articulo` (`id_articulo`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `error_log`
--
ALTER TABLE `error_log`
  ADD CONSTRAINT `fk_user_error` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL;

--
-- Filtros para la tabla `registro`
--
ALTER TABLE `registro`
  ADD CONSTRAINT `fk_id_unidad_sigcom` FOREIGN KEY (`id_unidad_sigcom`) REFERENCES `unidad_sigcom` (`id_unidad_sigcom`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_registro_usuario1` FOREIGN KEY (`rut_usuario_1`) REFERENCES `usuarios` (`rut_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_registro_usuario2` FOREIGN KEY (`rut_usuario_2`) REFERENCES `usuarios` (`rut_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `registro_ibfk_1` FOREIGN KEY (`id_tipo_registro`) REFERENCES `tipo_registro` (`id_tipo_registro`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `servicio`
--
ALTER TABLE `servicio`
  ADD CONSTRAINT `servicio_id_unidad_sigcom_fkey` FOREIGN KEY (`id_unidad_sigcom`) REFERENCES `unidad_sigcom` (`id_unidad_sigcom`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_tipo_usuario` FOREIGN KEY (`id_tipo_usuario`) REFERENCES `tipo_usuario` (`id_tipo_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `usuario_estamento` FOREIGN KEY (`id_estamento`) REFERENCES `estamento` (`id_estamento`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `usuario_servicio` FOREIGN KEY (`id_servicio`) REFERENCES `servicio` (`id_servicio`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `usuario_tipo_contrato` FOREIGN KEY (`id_tipo_contrato`) REFERENCES `tipo_contrato` (`id_tipo_contrato`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
