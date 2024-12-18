DELIMITER $$
--
-- Procedimientos
--
CREATE  PROCEDURE `ActualizarContrasena` (IN `p_username` VARCHAR(255), IN `p_nueva_contrasena` VARCHAR(255))   BEGIN
    UPDATE usuariosA
    SET pwd = p_nueva_contrasena
    WHERE username = p_username;
END$$

CREATE  PROCEDURE `ActualizarUsuario` (IN `p_id_usuario` INT, IN `p_rut_usuario` INT, IN `p_dv_usuario` VARCHAR(1), IN `p_nombre` VARCHAR(255), IN `p_id_servicio` INT, IN `p_id_tipo_contrato` INT, IN `p_id_unidad_sigcom` INT, IN `p_id_estamento` INT, IN `p_superuser` TINYINT(1), IN `p_username` VARCHAR(255), IN `p_pwd` VARCHAR(255))   BEGIN
    UPDATE usuarios
    SET rut_usuario = p_rut_usuario,
        dv_usuario = p_dv_usuario,
        nombre = p_nombre,
        id_servicio = p_id_servicio,
        id_tipo_contrato = p_id_tipo_contrato,
        id_unidad_sigcom = p_id_unidad_sigcom,
        id_estamento = p_id_estamento,
        id_tipo_usuario= p_superuser,
        username = p_username,
        pwd = p_pwd
    WHERE id_usuario = p_id_usuario;
END$$

CREATE  PROCEDURE `bajas_perdidas` ()   BEGIN
SELECT  
        a.id_articulo,
        a.nombre_articulo,
        COALESCE(registros.perdida_ex, 0) as perdidas_externas,
        COALESCE(registros.perdida_int, 0) as perdidas_internas,
        COALESCE(registros.perdida_ex, 0) + COALESCE(registros.perdida_int, 0) as perdidas_totales,
        COALESCE(registros.bajas_serv, 0) as bajas_servicio,
        COALESCE(registros.bajas_roperia, 0) as bajas_roperia,
        COALESCE(registros.bajas_serv, 0) + COALESCE(registros.bajas_roperia, 0) as bajas_totales
    FROM articulo a
    LEFT JOIN (
        SELECT
            dr.id_articulo,
            SUM(CASE WHEN r.id_tipo_registro = 5 THEN dr.cantidad ELSE 0 END) as perdida_ex,
            SUM(CASE WHEN r.id_tipo_registro = 6 THEN dr.cantidad ELSE 0 END) as perdida_int,
            SUM(CASE WHEN r.id_tipo_registro = 7 THEN dr.cantidad ELSE 0 END) as bajas_serv,
            SUM(CASE WHEN r.id_tipo_registro = 8 THEN dr.cantidad ELSE 0 END) as bajas_roperia
        FROM detalle_registro dr
        INNER JOIN registro r on r.id_registro = dr.id_registro
        WHERE YEAR(r.fecha) = YEAR(CURRENT_DATE()) AND MONTH(r.fecha) = MONTH(CURRENT_DATE())
        GROUP BY dr.id_articulo
    ) as registros ON a.id_articulo = registros.id_articulo 
    ORDER BY a.id_articulo;
END$$

CREATE  PROCEDURE `BorrarUsuario` (IN `p_id_usuario` INT)   BEGIN
    UPDATE usuarios
    SET borrado = TRUE
    WHERE id_usuario = p_id_usuario;
END$$

CREATE  PROCEDURE `InsertarUsuario` (IN `p_rut_usuario` INT, IN `p_dv_usuario` VARCHAR(1), IN `p_nombre` VARCHAR(255), IN `p_id_servicio` INT, IN `p_id_tipo_contrato` INT, IN `p_id_unidad_sigcom` INT, IN `p_id_estamento` INT, IN `p_superuser` TINYINT(1), IN `p_username` VARCHAR(255), IN `p_pwd` VARCHAR(255))   BEGIN
    INSERT INTO usuarios VALUES (null, p_rut_usuario, p_dv_usuario, p_nombre, p_id_servicio, p_id_tipo_contrato, p_id_unidad_sigcom, p_id_estamento, p_superuser, p_username, p_pwd, FALSE);
END$$

CREATE PROCEDURE `ropa_disponible_hospital` ()   BEGIN
SELECT  
        a.id_articulo,
        a.nombre_articulo,
        a.stock - COALESCE(registros.servicios, 0) + COALESCE(limpio_roperia, 0) + COALESCE(perdida_ex, 0) + COALESCE(perdida_int, 0) + COALESCE(bajas_serv, 0)  as roperia_limpio,
        COALESCE(registros.servicios, 0) - COALESCE(registros.sucio_roperia, 0) - COALESCE(registros.perdida_int, 0) - COALESCE(bajas_serv, 0) as ropa_servicios,
        COALESCE(registros.sucio_roperia, 0) - COALESCE(registros.lavanderia, 0) as roperia_sucio,
        COALESCE(registros.lavanderia, 0) - COALESCE(registros.limpio_roperia, 0) - COALESCE(registros.perdida_ex, 0) as en_lavanderia,
        COALESCE(perdida_ex, 0) + COALESCE(perdida_int, 0) as perdidas_totales,
        COALESCE(bajas_serv, 0) + COALESCE(bajas_roperia, 0) as bajas_totales
    FROM articulo a
    LEFT JOIN (
        SELECT
            dr.id_articulo,
            SUM(CASE WHEN r.id_tipo_registro = 4 THEN dr.cantidad ELSE 0 END) as limpio_roperia,
            SUM(CASE WHEN r.id_tipo_registro = 1 THEN dr.cantidad ELSE 0 END) as servicios,
            SUM(CASE WHEN r.id_tipo_registro = 2 THEN dr.cantidad ELSE 0 END) as sucio_roperia,
            SUM(CASE WHEN r.id_tipo_registro = 3 THEN dr.cantidad ELSE 0 END) as lavanderia,
            SUM(CASE WHEN r.id_tipo_registro = 5 THEN dr.cantidad ELSE 0 END) as perdida_ex,
            SUM(CASE WHEN r.id_tipo_registro = 6 THEN dr.cantidad ELSE 0 END) as perdida_int,
            SUM(CASE WHEN r.id_tipo_registro = 7 THEN dr.cantidad ELSE 0 END) as bajas_serv,
            SUM(CASE WHEN r.id_tipo_registro = 8 THEN dr.cantidad ELSE 0 END) as bajas_roperia
        FROM detalle_registro dr
        INNER JOIN registro r on r.id_registro = dr.id_registro
        GROUP BY dr.id_articulo
    ) as registros ON a.id_articulo = registros.id_articulo 
    ORDER BY a.id_articulo;
END$$

CREATE PROCEDURE `stock_servicios` (IN `p_id_servicio` INT)   BEGIN
SELECT  
        a.id_articulo,
        a.nombre_articulo,
        COALESCE(registros.servicios, 0) - COALESCE(registros.sucio_roperia, 0) - COALESCE(registros.perdida_int, 0) - COALESCE(bajas_serv, 0) as ropa_servicios
    FROM articulo a
    LEFT JOIN (
        SELECT
            dr.id_articulo,
            SUM(CASE WHEN r.id_tipo_registro = 1 THEN dr.cantidad ELSE 0 END) as servicios,
            SUM(CASE WHEN r.id_tipo_registro = 2 THEN dr.cantidad ELSE 0 END) as sucio_roperia,
            SUM(CASE WHEN r.id_tipo_registro = 6 THEN dr.cantidad ELSE 0 END) as perdida_int,
            SUM(CASE WHEN r.id_tipo_registro = 7 THEN dr.cantidad ELSE 0 END) as bajas_serv
        FROM detalle_registro dr
        INNER JOIN registro r on r.id_registro = dr.id_registro
        where r.id_servicio = p_id_servicio
        GROUP BY dr.id_articulo
    ) as registros ON a.id_articulo = registros.id_articulo 
    ORDER BY a.id_articulo;
END$$

CREATE PROCEDURE get_services_report()
BEGIN
    SELECT  
        a.id_articulo,
        a.nombre_articulo,
        us.unidad_sigcom,
        COALESCE(SUM(CASE WHEN r.id_tipo_registro = 1 THEN dr.cantidad ELSE 0 END), 0) - 
        COALESCE(SUM(CASE WHEN r.id_tipo_registro = 2 THEN dr.cantidad ELSE 0 END), 0) - 
        COALESCE(SUM(CASE WHEN r.id_tipo_registro = 6 THEN dr.cantidad ELSE 0 END), 0) - 
        COALESCE(SUM(CASE WHEN r.id_tipo_registro = 7 THEN dr.cantidad ELSE 0 END), 0) AS ropa_servicios
    FROM articulo a
    CROSS JOIN unidad_sigcom us
    LEFT JOIN registro r ON r.id_unidad_sigcom = us.id_unidad_sigcom 
    LEFT JOIN detalle_registro dr ON dr.id_registro = r.id_registro AND dr.id_articulo = a.id_articulo
    GROUP BY a.id_articulo, us.unidad_sigcom 
    ORDER BY a.id_articulo, us.unidad_sigcom;
END$$


CREATE PROCEDURE obtener_ropa_baja_servicios(IN mes_param INT, IN anio_param INT)
BEGIN
    SELECT
        CONCAT(MONTH(r.fecha), ' del ', YEAR(r.fecha)) AS mes_anio,
        a.id_articulo,
        a.nombre_articulo,
        u.unidad_sigcom,
        COALESCE(
            SUM(
                CASE WHEN r.id_tipo_registro = 7 THEN dr.cantidad ELSE 0
            END
        ), 0) AS ropa_baja_servicios
    FROM
        articulo a
    LEFT JOIN detalle_registro dr ON dr.id_articulo = a.id_articulo
    LEFT JOIN registro r ON r.id_registro = dr.id_registro
    LEFT JOIN unidad_sigcom u ON r.id_unidad_sigcom = u.id_unidad_sigcom
    WHERE MONTH(r.fecha) = mes_param 
      AND YEAR(r.fecha) = anio_param
    GROUP BY
        a.id_articulo,
        u.unidad_sigcom
    ORDER BY
        a.id_articulo,
        u.unidad_sigcom;
END$$

DELIMITER ;