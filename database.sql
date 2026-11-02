-- =============================================================================
-- TRAVELMATE - SCRIPT DE BASE DE DATOS RELACIONAL (MYSQL / WORKBENCH)
-- Proyecto: TravelMate (Plataforma Turística y de Planificación de Viajes)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS travelmate_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE travelmate_db;

-- Desactivar temporalmente revisión de claves foráneas para creación limpia
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. TABLA: roles
-- Catálogo de roles de seguridad y niveles de acceso a la plataforma.
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS roles;
CREATE TABLE roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(30) NOT NULL UNIQUE,
    descripcion VARCHAR(150) NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 2. TABLA: usuarios
-- Información legal, credenciales y contacto de clientes y administradores.
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    id_rol INT NOT NULL DEFAULT 4,
    tipo_documento ENUM('CC', 'CE', 'PASAPORTE', 'DNI') NOT NULL DEFAULT 'CC',
    numero_documento VARCHAR(25) NOT NULL UNIQUE,
    nombres VARCHAR(60) NOT NULL,
    apellidos VARCHAR(60) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    telefono_principal VARCHAR(20) NOT NULL,
    telefono_emergencia VARCHAR(20) NOT NULL,
    nombre_contacto_emergencia VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NULL,
    genero ENUM('Masculino', 'Femenino', 'Otro') NULL,
    pais_residencia VARCHAR(50) NOT NULL DEFAULT 'Colombia',
    ciudad_residencia VARCHAR(50) NOT NULL DEFAULT 'Medellín',
    direccion_residencia VARCHAR(120) NULL,
    estilo_viaje_preferido VARCHAR(50) NULL,
    estado_cuenta ENUM('Activo', 'Inactivo', 'Suspendido') NOT NULL DEFAULT 'Activo',
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) 
        REFERENCES roles(id_rol) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 3. TABLA: categorias
-- Intereses o tipos de experiencia turística (Playa, Cultura, Aventura, etc.).
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS categorias;
CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(40) NOT NULL UNIQUE,
    slug VARCHAR(40) NOT NULL UNIQUE,
    descripcion TEXT NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 4. TABLA: destinos
-- Catálogo de los 28 destinos turísticos mundiales ofertados.
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS destinos;
CREATE TABLE destinos (
    id_destino INT AUTO_INCREMENT PRIMARY KEY,
    codigo_iata_ciudad VARCHAR(3) NOT NULL UNIQUE,
    nombre_destino VARCHAR(80) NOT NULL UNIQUE,
    pais VARCHAR(50) NOT NULL,
    continente ENUM('América del Sur', 'América del Norte', 'Europa', 'Asia', 'África', 'Oceanía') NOT NULL,
    descripcion TEXT NOT NULL,
    precio_base_cop DECIMAL(12, 2) NOT NULL,
    compatibilidad_base INT NOT NULL DEFAULT 90,
    duracion_dias_promedio INT NOT NULL DEFAULT 5,
    mejor_epoca_viaje VARCHAR(80) NULL,
    idioma_oficial VARCHAR(40) NULL,
    moneda_local VARCHAR(10) NULL,
    tag_promocional VARCHAR(30) NULL,
    imagen_principal_url VARCHAR(255) NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT 1,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 5. TABLA: destino_categorias
-- Relación Muchos a Muchos (M:N) entre Destinos y Categorías de experiencia.
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS destino_categorias;
CREATE TABLE destino_categorias (
    id_destino INT NOT NULL,
    id_categoria INT NOT NULL,
    PRIMARY KEY (id_destino, id_categoria),
    CONSTRAINT fk_dc_destino FOREIGN KEY (id_destino) 
        REFERENCES destinos(id_destino) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    CONSTRAINT fk_dc_categoria FOREIGN KEY (id_categoria) 
        REFERENCES categorias(id_categoria) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 6. TABLA: favoritos
-- Lista de deseos / destinos guardados por cada usuario (M:N).
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS favoritos;
CREATE TABLE favoritos (
    id_favorito INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_destino INT NOT NULL,
    fecha_agregado DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_usuario_destino_favorito UNIQUE (id_usuario, id_destino),
    CONSTRAINT fk_fav_usuario FOREIGN KEY (id_usuario) 
        REFERENCES usuarios(id_usuario) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    CONSTRAINT fk_fav_destino FOREIGN KEY (id_destino) 
        REFERENCES destinos(id_destino) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 7. TABLA: reservas
-- Contrato y registro principal del viaje reservado por el titular.
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS reservas;
CREATE TABLE reservas (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    codigo_reserva VARCHAR(15) NOT NULL UNIQUE,
    id_usuario INT NOT NULL,
    id_destino INT NOT NULL,
    fecha_salida DATE NOT NULL,
    fecha_regreso DATE NOT NULL,
    duracion_dias INT NOT NULL,
    cantidad_pasajeros INT NOT NULL DEFAULT 1,
    tipo_alojamiento ENUM('Estándar', 'Confort Superior', 'Lujo & Exclusivo') NOT NULL DEFAULT 'Confort Superior',
    precio_unitario_cop DECIMAL(12, 2) NOT NULL,
    impuestos_cop DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    precio_total_cop DECIMAL(12, 2) NOT NULL,
    estado_reserva ENUM('Pendiente', 'Confirmada', 'Cancelada', 'Finalizada') NOT NULL DEFAULT 'Confirmada',
    observaciones_especiales TEXT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reserva_usuario FOREIGN KEY (id_usuario) 
        REFERENCES usuarios(id_usuario) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    CONSTRAINT fk_reserva_destino FOREIGN KEY (id_destino) 
        REFERENCES destinos(id_destino) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 8. TABLA: pasajeros_reserva
-- Personas que viajarán en la reserva (Titular y Acompañantes con documento).
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS pasajeros_reserva;
CREATE TABLE pasajeros_reserva (
    id_pasajero INT AUTO_INCREMENT PRIMARY KEY,
    id_reserva INT NOT NULL,
    tipo_documento ENUM('CC', 'CE', 'PASAPORTE', 'DNI') NOT NULL DEFAULT 'CC',
    numero_documento VARCHAR(25) NOT NULL,
    nombres VARCHAR(60) NOT NULL,
    apellidos VARCHAR(60) NOT NULL,
    fecha_nacimiento DATE NULL,
    es_titular BOOLEAN NOT NULL DEFAULT 0,
    es_menor_edad BOOLEAN NOT NULL DEFAULT 0,
    equipaje_adicional BOOLEAN NOT NULL DEFAULT 0,
    CONSTRAINT fk_pasajero_reserva FOREIGN KEY (id_reserva) 
        REFERENCES reservas(id_reserva) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 9. TABLA: pagos
-- Registro transaccional del pago de cada reserva.
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS pagos;
CREATE TABLE pagos (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_reserva INT NOT NULL,
    metodo_pago ENUM('PSE', 'Tarjeta Crédito', 'Tarjeta Débito', 'Transferencia') NOT NULL,
    referencia_transaccion VARCHAR(60) NOT NULL UNIQUE,
    monto_pagado_cop DECIMAL(12, 2) NOT NULL,
    estado_pago ENUM('Aprobado', 'Rechazado', 'Pendiente') NOT NULL DEFAULT 'Aprobado',
    fecha_pago DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pago_reserva FOREIGN KEY (id_reserva) 
        REFERENCES reservas(id_reserva) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Reactivar validaciones de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;


-- =============================================================================
-- INSERCIÓN DE DATOS INICIALES (SEMILLERO / SEED DATA)
-- =============================================================================

-- 1. Roles iniciales
INSERT INTO roles (id_rol, nombre_rol, descripcion) VALUES
(1, 'Super Admin', 'Control total y maestro del sistema'),
(2, 'Administrador', 'Gestión comercial, operativa y de usuarios'),
(3, 'Trabajador', 'Gestión de reservas y atención a clientes'),
(4, 'Cliente', 'Usuario final que explora y reserva viajes');

-- 2. Usuario Administrador por defecto
INSERT INTO usuarios (
    id_usuario, id_rol, tipo_documento, numero_documento,
    nombres, apellidos, email, password_hash,
    telefono_principal, telefono_emergencia, nombre_contacto_emergencia,
    fecha_nacimiento, genero, pais_residencia, ciudad_residencia,
    estilo_viaje_preferido, estado_cuenta
) VALUES
(1, 1, 'CC', '1000000001', 'Super', 'Admin', 'superadmin@travelmate.com', 'Admin123*', '+57 300 000 0000', '+57 300 111 2222', 'Soporte Corporativo', '1990-01-01', 'Otro', 'Colombia', 'Medellín', 'Lujo & Exclusivo', 'Activo'),
(2, 4, 'CC', '1020304050', 'Juan Fernando', 'Gómez', 'juan.gomez@email.com', 'Viajero2026*', '+57 300 234 5678', '+57 311 987 6543', 'María Gómez (Hermana)', '1998-05-14', 'Masculino', 'Colombia', 'Medellín', 'Cultura & Museos', 'Activo');

-- 3. Categorías iniciales de experiencias
INSERT INTO categorias (id_categoria, nombre_categoria, slug, descripcion) VALUES
(1, 'Playa', 'playa', 'Destinos costeros, mar turquesa y descanso junto al océano'),
(2, 'Cultura', 'cultura', 'Museos, arquitectura histórica, templos y patrimonio'),
(3, 'Aventura', 'aventura', 'Senderismo, ecoturismo, deportes extremos y naturaleza'),
(4, 'Gastronomía', 'gastronomia', 'Rutas culinarias, alta cocina y sabores autóctonos'),
(5, 'Romance', 'romance', 'Escapadas en pareja, viñedos, atardeceres y lujo relajado'),
(6, 'Fiesta', 'fiesta', 'Vida nocturna animada, festivales y clubes');

-- 4. Destinos representativos del catálogo TravelMate
INSERT INTO destinos (
    id_destino, codigo_iata_ciudad, nombre_destino, pais, continente,
    descripcion, precio_base_cop, compatibilidad_base, duracion_dias_promedio,
    mejor_epoca_viaje, idioma_oficial, moneda_local, tag_promocional, imagen_principal_url
) VALUES
(1, 'CTG', 'Cartagena de Indias', 'Colombia', 'América del Sur', 'Calles coloniales llenas de color, atardeceres sobre la muralla y playas en las Islas del Rosario.', 2450000.00, 95, 4, 'Diciembre a Abril', 'Español', 'COP', '#Caribe', '../assets/img/cartagena.jpg'),
(2, 'PAR', 'París', 'Francia', 'Europa', 'La ciudad luz: paseos por el río Sena, la Torre Eiffel iluminada, museos icónicos y alta cocina francesa.', 6200000.00, 89, 8, 'Mayo a Septiembre', 'Francés', 'EUR', '#Romance', '../assets/img/paris.jpg'),
(3, 'TYO', 'Tokio & Kioto', 'Japón', 'Asia', 'Rascacielos futuristas, santuarios milenarios, gastronomía Michelin y jardines zen de ensueño.', 8600000.00, 94, 12, 'Marzo a Mayo / Sep a Nov', 'Japonés', 'JPY', '#Futuro & Tradición', '../assets/img/tokio.jpg'),
(4, 'SMR', 'Santa Marta & Tayrona', 'Colombia', 'América del Sur', 'Senderismo en la selva tropical, playas vírgenes en el Parque Tayrona y la magia de la Sierra Nevada.', 1850000.00, 94, 5, 'Diciembre a Abril', 'Español', 'COP', '#Naturaleza', '../assets/img/santamarta.jpg');

-- 5. Asociación Destinos con Categorías (M:N)
INSERT INTO destino_categorias (id_destino, id_categoria) VALUES
(1, 1), (1, 2), (1, 4), (1, 5), -- Cartagena: Playa, Cultura, Gastronomía, Romance
(2, 2), (2, 4), (2, 5),         -- París: Cultura, Gastronomía, Romance
(3, 2), (3, 3), (3, 4),         -- Tokio: Cultura, Aventura, Gastronomía
(4, 1), (4, 3);                 -- Santa Marta: Playa, Aventura

-- 6. Reserva de demostración
INSERT INTO reservas (
    id_reserva, codigo_reserva, id_usuario, id_destino,
    fecha_salida, fecha_regreso, duracion_dias, cantidad_pasajeros,
    tipo_alojamiento, precio_unitario_cop, impuestos_cop, precio_total_cop,
    estado_reserva, observaciones_especiales
) VALUES
(1, 'TM-55441', 2, 1, '2026-11-20', '2026-11-25', 5, 2, 'Confort Superior', 2450000.00, 0.00, 4900000.00, 'Confirmada', 'Habitación piso alto con vista');

-- 7. Pasajeros de la reserva (Titular + Acompañante)
INSERT INTO pasajeros_reserva (
    id_reserva, tipo_documento, numero_documento, nombres, apellidos, es_titular, es_menor_edad
) VALUES
(1, 'CC', '1020304050', 'Juan Fernando', 'Gómez', 1, 0),
(1, 'CC', '1030405060', 'Laura Marcela', 'Ríos', 0, 0);

-- 8. Pago de la reserva
INSERT INTO pagos (
    id_reserva, metodo_pago, referencia_transaccion, monto_pagado_cop, estado_pago
) VALUES
(1, 'PSE', 'PAY-TM-55441-202611', 4900000.00, 'Aprobado');
