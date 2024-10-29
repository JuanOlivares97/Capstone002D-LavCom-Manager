const express = require('express');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const { log } = require('console');

const app = express();

// Configuración de EJS y layouts
app.use(expressLayout);
app.set('layout', '_template');
app.set('view engine', 'ejs');
app.set('views', './src/views');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "static")))

// Middleware de autenticación global (si es necesario)
const { loginRequired } = require('./server/authentication');

app.use(cookieParser());

//Redireccionar a la página de dashboard
app.get('/', (req, res) => {
    res.redirect('/dashboard/home');
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


// Manejo de errores 404
app.use((req, res) => {
    res.status(404).render('404', { layout: false });
});

// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
