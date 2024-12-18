const express = require('express');
const expressLayout = require('express-ejs-layouts')
const path = require('path');
const userRouter = require('./routes/user.routes');
const authRouter = require('./routes/auth.routes');
const articulosRouter = require('./routes/articulos.routes');
const reportesRouter = require('./routes/reportes.routes')
const dashboardRouter = require('./routes/dashboard.routes')
const helpRouter = require('./routes/help.routes')

const loginRequired = require('./server/authentication').loginRequired;
const rolesAllowed = require('./server/authentication').rolesAllowed;

const cookieParser = require('cookie-parser');

const app = express();

require('dotenv').config();

app.use(cookieParser());
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use(expressLayout)
app.set('layout', '_template')

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.static(path.join(__dirname, "static")))

app.get('/', (req, res) => {
    res.redirect("/laundry-manager/help/home");
})

app.use('/auth', authRouter);
app.use('/users',loginRequired, rolesAllowed([1]), userRouter);
app.use('/clothes',loginRequired, articulosRouter);
app.use('/reports',loginRequired, rolesAllowed([1, 2]), reportesRouter);
app.use('/dashboard',loginRequired, rolesAllowed([1, 2]), dashboardRouter);
app.use('/help',loginRequired, helpRouter)

app.use((req, res) => {
    res.status(404).render('error', { layout: false, message: "Ruta no encontrada" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:8080/laundry-manager`);
});