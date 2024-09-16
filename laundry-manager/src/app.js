const express = require('express');
const path = require('path');
const userRouter = require('./routes/user.routes');
const articulosRouter = require('./routes/articulos.routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.static(path.join(__dirname, "static")))
console.log(path.join(__dirname, "static"));

app.use('/', userRouter);
app.use('/', articulosRouter);

app.get("/template", (req, res) => {
    res.render("articulos");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running http://localhost:${port}`);
});