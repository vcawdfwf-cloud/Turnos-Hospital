-- Crear base de datos
CREATE DATABASE IF NOT EXISTS hospital_turnos;

USE hospital_turnos;

-- Tabla para turnos
CREATE TABLE IF NOT EXISTS turnos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    turno VARCHAR(10) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    area VARCHAR(100) NOT NULL,
    hora_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    hora_llamado DATETIME NULL,
    hora_fin DATETIME NULL,
    atendido_por VARCHAR(50) NULL,
    estado ENUM('pendiente', 'llamando', 'atendiendo', 'finalizado') DEFAULT 'pendiente',
    dispositivo_id VARCHAR(255) UNIQUE NOT NULL,
    fecha_operacion DATE DEFAULT CURRENT_DATE
);

-- Índice para fecha_operacion para reinicio diario
CREATE INDEX idx_fecha_operacion ON turnos(fecha_operacion);

-- Índice para estado
CREATE INDEX idx_estado ON turnos(estado);