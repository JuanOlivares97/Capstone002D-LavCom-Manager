const express = require('express');
const expressLayout = require('express-ejs-layouts')
const path = require('path');
const userRouter = require('./routes/user.routes');
const articulosRouter = require('./routes/articulos.routes');

const app = express();

app.use(expressLayout)
app.set('layout', '_template')

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.static(path.join(__dirname, "static")))
console.log(path.join(__dirname, "static"));

app.use('/', userRouter);
app.use('/clothes', articulosRouter);

app.get("/template", (req, res) => {
    res.render("clothes/articulos");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running http://localhost:${port}`);
});