# Orders Microservice

## Introducción

Esta microservice está diseñado siguiendo el patrón de arquitectura CQRS (Command Query Responsibility Segregation), aplicando principios de código limpio SOLID, patron de eventos y con pruebas unitarias integradas.

## Diagrama de Arquitectura

Para ver el diagrama de arquitectura del microservice, haz clic en el siguiente enlace:

[Diagrama de Arquitectura](docs/img/Diagrama_arquitectura.png)

## Diagrama de flujo

Para ver el diagrama de flujo, haz clic en el siguiente enlace:

[Diagrama de flujo](docs/img/Diagrama_flujo.png)

## Configuración

### Requisitos

- Node.js versión 12.x o superior
- Base de datos PostgreSQL

## Instalación

### Dev

1. Clonar el repositorio
2. Instalar dependencias
3. Crear un archivo `.env` basado en el `env.template`
4. Ejecutar `npm run start:dev`

## Nats

Para levantar el contenedor del server de Nats:

`docker run -d --name nats-main -p 4222:4222 -p 6222:6222 -p 8222:8222 nats`
