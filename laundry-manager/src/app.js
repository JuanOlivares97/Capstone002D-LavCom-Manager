const express = require('express');
const expressLayout = require('express-ejs-layouts')
const path = require('path');

const userRouter = require('./routes/user.routes');
const authRouter = require('./routes/auth.routes');
const articulosRouter = require('./routes/articulos.routes');
const reportesRouter = require('./routes/reportes.routes')
const dashboardController = require('./routes/dashboard.routes')

const app = express();

app.use(expressLayout)
app.set('layout', '_template')

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.static(path.join(__dirname, "static")))
console.log(path.join(__dirname, "static"));

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/clothes', articulosRouter);
app.use('/reports', reportesRouter);
app.use('/dashboard', dashboardController);

app.get("/template", (req, res) => {
    res.render("reports/home");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running http://localhost:${port}`);
});