<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
  <a href="https://es.react.dev/" target="blank"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/React.svg/1280px-React.svg.png" width="120" alt="React Logo" /></a>
  <a href="https://www.postgresql.org/" target="blank"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/1280px-Postgresql_elephant.svg.png" width="120" alt="Postgres Logo" /></a>
</p>

# Aplicacion Agricola

Proyecto web agricola con dos aplicaciones:

- `backend-crm-agricola`: API con NestJS, TypeORM y PostgreSQL.
- `frontend-crm-agricola`: cliente web con React, Vite y Bootstrap.

## Requisitos

- Node.js y npm
- Docker Desktop
- Git

## Instalacion

Desde la carpeta raiz del proyecto:

```bash
npm install
```

Instala tambien las dependencias de cada aplicacion:

```bash
cd backend-crm-agricola
npm install

cd ../frontend-crm-agricola
npm install
```

## Backend

Entra a la carpeta del backend:

```bash
cd backend-crm-agricola
```

Crea el archivo `.env` a partir de `.env.template` y configura las variables:

Levanta la base de datos:

```bash
docker-compose up -d
```

Inicia el backend:

```bash
npm run start:dev
```

El backend queda disponible en:

```text
http://localhost:3000
```

## Frontend

Entra a la carpeta del frontend:

```bash
cd frontend-crm-agricola
```

Crea o revisa el archivo `.env` a partir de `.env.template` y configura las variables:

Inicia el frontend:

```bash
npm run dev
```

El frontend queda disponible en:

```text
http://localhost:5173
```

## Orden recomendado para ejecutar

1. Levantar PostgreSQL con `docker-compose up -d` dentro de `backend-crm-agricola`.
2. Levantar el backend con `npm run start:dev`.
3. Levantar el frontend con `npm run dev`.

## Comandos utiles

Backend:

```bash
npm run build
npm run lint
```

Frontend:

```bash
npm run build
npm run lint
```
