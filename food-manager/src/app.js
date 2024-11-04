const express = require('express');
const app = express();

const expressLayout = require('express-ejs-layouts');
const path = require('path');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const lunchController = require('./controllers/lunch.controller');



// Configuración de EJS y layouts
app.use(expressLayout);
app.set('layout', '_template');
app.set('view engine', 'ejs');
app.set('views', './src/views');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('socketio', io);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "static")))

// Middleware de autenticación global (si es necesario)
const { loginRequired } = require('./server/authentication');

app.use(cookieParser());

//Redireccionar a la página de dashboard
app.get('/', (req, res) => {
    res.redirect('/food-manager/dashboard/home');
});

// Cargar rutas dinámicamente
const routeFiles = fs.readdirSync(path.join(__dirname, './routes'));
routeFiles.forEach(file => {
    const routePath = `./routes/${file}`;
    const route = require(routePath);
    const routeName = `/${file.replace('.routes.js', '')}`;
    
    // Aplicar middleware de autenticación a todas las rutas, excepto las de la carpeta 'auth'
    if (routeName.startsWith('/auth')) {
        app.use(routeName, route);
    } else {
        app.use(routeName, loginRequired, route);
    }
});

// Rutas del tótem
app.get('/totem', lunchController.renderTotem);

app.post('/totem/check-in', lunchController.checkInLunch);

// Ruta para registrar colación desde el tótem
app.post('/totem/register-lunch', lunchController.registerLunchAtTotem);

// Ruta para el listado de colaciones
app.get('/lunch/list', lunchController.renderLunchList);

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).render('404', { layout: false });
});

// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
