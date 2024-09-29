const express = require('express');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const fs = require('fs');

const app = express();

// Configuración de EJS y layouts
app.use(expressLayout);
app.set('layout', '_template');
app.set('view engine', 'ejs');
app.set('views', './src/views');

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "static")));

// Middleware de autenticación global (si es necesario)
// app.use(authMiddleware);

// Cargar rutas dinámicamente
const routeFiles = fs.readdirSync(path.join(__dirname, './routes'));
routeFiles.forEach(file => {
    const routePath = `./routes/${file}`;
    const route = require(routePath);
    const routeName = `/${file.replace('.routes.js', '')}`;
    app.use(routeName, route);
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
