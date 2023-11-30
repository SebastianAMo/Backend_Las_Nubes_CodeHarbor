# Backend para la Clínica Las Nubes

Este proyecto provee la implementación del backend para la gestión de una clínica. Incluye funcionalidades para manejar pacientes, citas médicas, medicamentos, entre otros.

## Tecnologías Utilizadas

- Node.js
- Express
- PostgreSQL
- Docker

## Requisitos Previos

- Node.js (v14.0 o superior)
- Docker y Docker Compose
- npm

## Instrucciones para la Instalación

### 1. Clonar el Repositorio

```sh
git clone https://github.com/SebastianAMo/Backend_Las_Nubes_CodeHarbor.git

cd clinica-backend
```

### 2. Instalar Dependencias

```sh
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo .env en la raíz del proyecto y configura las variables de entorno necesarias. Puedes usar el archivo .env.example como referencia.

### 4. Levantar la Base de Datos con Docker

El proyecto incluye un archivo docker-compose.yml para la base de datos PostgreSQL.

```sh
docker-compose up -d
```

### 5. Obtener IP de la Base de Datos

Usa docker ps para obtener el Id del contenedor de postgres

```sh
docker ps
```

Con este id usa el siguiente comando para obtener la dirección IP

```sh
docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' [container_id]
```

### 6. Inicializar la Base de Datos

Conectandose a pgadmin que esta conectado <http://localhost:8080> le das a la opción de agregar un nuevo servidor y en el campo de host ingresas la ip obtenida en el paso anterior e ingresar los datos de usuario y contraseña establecidos en el docker compose para postgres

### 7. Iniciar el Servidor

Finalmente, puedes iniciar el servidor utilizando el siguiente comando:

```sh
npm start
```

Inicialmente te debe aparecer en consola estos mensaje:

```sh
> backend_las_nubes_codeharbor@1.0.0 start
> npx nodemon app.js

[nodemon] 3.0.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node app.js`
Server on port 4000
Database connection successful
```

El servidor debería estar corriendo en <http://localhost:3000>

## Explicacion

### Routes

Los archivos de las rutas hacen referencia a cada modulo y los endpoints que tiene estan relacionados a ese modulo.

- Módulo para la administración del personal -> admin.router.js

- Módulo para registro de cada paciente -> pacientes.router.js

- Módulo para la gestión de medicamentos -> medicamentos.router.js

- Módulo para citas médicas -> citas.router.js

- Módulo de colaboradores -> colaboradores.router.js

- Módulo extra -> chatbot.router.js
