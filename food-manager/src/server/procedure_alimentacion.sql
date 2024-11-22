DELIMITER //

CREATE PROCEDURE GenerarReporte (
    IN p_mes INT,
    IN p_anio INT
)
BEGIN
    -- Verificar si ya existen registros para el mes y año dados
    IF EXISTS (SELECT 1 FROM Reportes WHERE Mes = p_mes AND Anio = p_anio) THEN
        -- Eliminar los registros existentes para el mes y año
        DELETE FROM Reportes WHERE Mes = p_mes AND Anio = p_anio;
    END IF;

    -- Insertar los nuevos registros en la tabla Reportes
    INSERT INTO Reportes (Mes, Anio, IdTipoUnidad, RacionesFuncionarios, RacionesHospitalizados)
    SELECT
        p_mes,
        p_anio,
        TU.IdTipoUnidad,
        COALESCE(SUM(CASE WHEN C.Estado = 1 THEN 1 ELSE 0 END), 0) AS racionesFuncionarios,
        COALESCE(SUM(CASE WHEN H.IdTipoRegimen IS NOT NULL THEN 1 ELSE 0 END), 0) AS racionesHospitalizado
    FROM
        TipoUnidad TU
    LEFT JOIN `Colacion` C ON
        C.IdTipoUnidad = TU.IdTipoUnidad 
        AND MONTH(C.FechaSolicitud) = p_mes
        AND YEAR(C.FechaSolicitud) = p_anio
        AND C.Estado = 1
    LEFT JOIN Hospitalizado H ON
        H.IdTipoUnidad = TU.IdTipoUnidad 
        AND MONTH(H.FechaIngreso) <= p_mes
        AND (H.FechaAlta IS NULL OR MONTH(H.FechaAlta) >= p_mes)
        AND YEAR(H.FechaIngreso) <= p_anio
        AND (H.FechaAlta IS NULL OR YEAR(H.FechaAlta) >= p_anio)
    GROUP BY
        TU.DescTipoUnidad;

END //

DELIMITER ;