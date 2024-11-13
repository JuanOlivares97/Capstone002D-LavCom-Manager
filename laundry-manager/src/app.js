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

const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use(expressLayout)
app.set('layout', '_template')

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.static(path.join(__dirname, "static")))

app.get('/', (req, res) => {
    res.redirect("/laundry-manager/dashboard/home");
})

app.use('/auth', authRouter);
app.use('/users',loginRequired, userRouter);
app.use('/clothes',loginRequired, articulosRouter);
app.use('/reports',loginRequired, reportesRouter);
app.use('/dashboard',loginRequired, dashboardRouter);
app.use('/help',loginRequired, helpRouter)


app.get("/template", (req, res) => {
    res.render("error",{layout:false});
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:8080/laundry-manager`);
});