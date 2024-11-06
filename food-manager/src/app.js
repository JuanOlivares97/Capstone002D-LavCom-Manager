const express = require('express');
const app = express();
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const http = require('http').createServer(app); // HTTP server para Socket.io
const io = require('socket.io')(http, {
    path: '/food-manager/socket.io',
    cors: {
        origin: "http://localhost:8080",  // Ajusta esto según tu configuración
        methods: ["GET", "POST"]
    }
});

// Configuración de EJS y layouts
app.use(expressLayout);
app.set('layout', '_template');
app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Guardar la instancia de Socket.io en la aplicación
app.set('socketio', io);

// Definir el namespace '/food-manager'
const foodManagerNamespace = io.of('/food-manager');

foodManagerNamespace.on('connection', (socket) => {
    console.log('New client connected to /food-manager');

    socket.on('disconnect', () => {
        console.log('Client disconnected from /food-manager');
    });
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "static")));

// Middleware de autenticación global (si es necesario)
const { loginRequired } = require('./server/authentication');

// Redireccionar a la página de dashboard
app.get('/', (req, res) => {
    res.redirect('/food-manager/dashboard/home');
});

// Cargar rutas dinámicamente
const routeFiles = fs.readdirSync(path.join(__dirname, './routes'));
routeFiles.forEach(file => {
    const routePath = `./routes/${file}`;
    const route = require(routePath);
    const routeName = `/${file.replace('.routes.js', '')}`;
    
    // Aplicar middleware de autenticación a todas las rutas, excepto las de la carpeta 'auth' y 'totem'
    if (routeName.startsWith('/auth') || routeName.startsWith('/totem')) {
        app.use(routeName, route);
    } else {
        app.use(routeName, loginRequired, route);
    }
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).render('404', { layout: false });
});

// Iniciar el servidor
const port = process.env.PORT || 3000;
http.listen(port, () => { // Usar http.listen en lugar de app.listen
    console.log(`Server is running on http://localhost:${port}`);
});
