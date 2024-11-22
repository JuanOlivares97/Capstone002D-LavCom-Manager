const express = require('express');
const app = express();
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const http = require('http').createServer(app); // HTTP server para Socket.io
const io = require('socket.io')(http, {
    path: '/food-manager/socket.io'
});

// Configuración de EJS y layouts
app.use(expressLayout);
app.set('layout', '_template');
app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

require('dotenv').config();

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
const { loginRequired, rolesAllowed } = require('./server/authentication');

// Redireccionar a la página de dashboard
app.get('/', (req, res) => {
    res.redirect('/food-manager/dashboard/home');
});

app.use('/auth', require('./routes/auth.routes'));
app.use('/dashboard', loginRequired, rolesAllowed([1, 2, 3]), require('./routes/dashboard.routes'));
app.use('/report', loginRequired, rolesAllowed([1, 2, 3]), require('./routes/report.routes'));
app.use('/employee', loginRequired, rolesAllowed([1, 2, 5]), require('./routes/employee.routes'));
app.use('/lunch', loginRequired, rolesAllowed([2, 7]), require('./routes/lunch.routes'));
app.use('/maintainer', loginRequired, rolesAllowed([1, 2]), require('./routes/maintainer.routes'));
app.use('/patient', loginRequired, rolesAllowed([1, 2, 3, 4]), require('./routes/patient.routes'));

app.use('/help', loginRequired, require('./routes/help.routes'));
app.use('/totem', require('./routes/totem.routes'));

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).render('404', { layout: false, message: "No te preocupes, incluso los mejores exploradores se pierden a veces." });
});

// Iniciar el servidor
const port = process.env.PORT || 3000;
http.listen(port, () => { // Usar http.listen en lugar de app.listen
    console.log(`Server is running on http://localhost:8080/food-manager`);
});
