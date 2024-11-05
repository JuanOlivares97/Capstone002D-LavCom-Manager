const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = 8080;

// Servir la página HTML estática
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Redirigir las peticiones a los servicios correspondientes
app.use('/food-manager', createProxyMiddleware({ target: 'http://localhost:3000', changeOrigin: true, ws: true }));
app.use('/laundry-manager', createProxyMiddleware({ target: 'http://localhost:4000', changeOrigin: true }));


app.listen(PORT, () => {
  console.log(`Servidor principal escuchando en el puerto ${PORT}`);
});