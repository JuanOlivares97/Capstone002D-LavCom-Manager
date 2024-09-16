--nombres de columnas
SELECT GROUP_CONCAT(COLUMN_NAME)
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'tabla'
AND TABLE_SCHEMA = 'nombre_base_datos';

-- necesito un select * from que retorne todo en json
SELECT CONCAT('[', GROUP_CONCAT(JSON_OBJECT('nombre_columna', nombre_columna)), ']')
FROM tabla;