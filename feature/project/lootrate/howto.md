## CREAR RAMA PROJECT:
    Salir a develop `git checkout develop`
    Crear rama `git checkout -b feature/project`
    [Crear issue](https://github.com/b00tc4mp/isdi-parttime-202501/issues)
## CREAR CARPETA PROJECT
    Crear carpeta para el backend (backend, api, server)
    Crear carpeta para el frontend (frontend, app, client)
    Crear carpeta common (com)  (validators, errors)

### En la carpeta backend el servidor (empezar por npm init)
1. ir instalando las librerias necesarias (express, mongoose, bcrypt, dotenv)
2. carpetas segun Separation of Concerns (routes, handlers, logics, data)

    **MINI RECOMENDACIóN:** ir trabajando por features:
            data, logic (con su spec), handler, routes, index y middlewares, test curl y ya pasar al front

### A nivel de front
1. [Crear la app de vite ](https://vite.dev/guide/)
2. [Instalar Tailwind](https://tailwindcss.com/docs/installation/using-vite)
3. [Instalar react router](https://www.npmjs.com/package/react-router)
4. Crear las carpetas necesarias por tema de SoC (logics, components, pages)


***IMPORTANTE** No subir ni pushear los node_modules a github. Aseguros de que teneis un gitignore que los ignora