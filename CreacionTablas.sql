

--=======TABLAS=================
-- Table: public.account_manager--
CREATE TABLE IF NOT EXISTS public.account_manager
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    nombre text COLLATE pg_catalog."default",
    CONSTRAINT account_manager_pkey PRIMARY KEY (id)
)

-- Table: public.cliente--
CREATE TABLE IF NOT EXISTS public.cliente
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    nombre text COLLATE pg_catalog."default",
    CONSTRAINT cliente_pkey PRIMARY KEY (id)
)

-- Table: public.persona--
CREATE TABLE IF NOT EXISTS public.persona
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    nombre text COLLATE pg_catalog."default",
    CONSTRAINT persona_pkey PRIMARY KEY (id)
)

-- Table: public.product_owner--
CREATE TABLE IF NOT EXISTS public.product_owner
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    nombre text COLLATE pg_catalog."default",
    CONSTRAINT product_owner_pkey PRIMARY KEY (id)
)

-- Table: public.proyecto
CREATE TABLE IF NOT EXISTS public.proyecto
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    nombre text COLLATE pg_catalog."default",
    descripcion text COLLATE pg_catalog."default",
    fecha_entrega date,
    estado integer,
    cliente integer,
    product_owner integer,
    account_manager integer,
    CONSTRAINT proyecto_pkey PRIMARY KEY (id)
)

-- Table: public.tarea--
CREATE TABLE IF NOT EXISTS public.tarea
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    proyecto integer NOT NULL,
    persona integer NOT NULL,
    fecha_ini date,
    fecha_fin date,
    tiempo_estimado integer,
    plantilla_id text COLLATE pg_catalog."default"
)

-- Table: public.usuario_alerta--
CREATE TABLE IF NOT EXISTS public.usuario_alerta
(
    email text COLLATE pg_catalog."default",
    horas_min integer,
    horas_max integer,
    name text COLLATE pg_catalog."default",
    alerta1 integer,
    alerta2 integer,
    id text COLLATE pg_catalog."default",
    alerta3 integer
)

-- Table: public.usuario_alerta_param --
CREATE TABLE IF NOT EXISTS public.usuario_alerta_param
(
    name text COLLATE pg_catalog."default",
    value1 text COLLATE pg_catalog."default",
    value2 text COLLATE pg_catalog."default"
)

-- Table: public.usuario_alerta_sup
CREATE TABLE IF NOT EXISTS public.usuario_alerta_sup
(
    name text COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default",
    id text COLLATE pg_catalog."default"
)

