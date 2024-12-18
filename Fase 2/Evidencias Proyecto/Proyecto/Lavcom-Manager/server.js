const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = 8080;

// Servir la página HTML estática
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.use(express.static(path.join(__dirname, "static")))

// Redirigir las peticiones a los servicios correspondientes
app.use('/food-manager', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  ws: true,
  onError: (err, req, res) => {
    res.status(500).send('Error en el proxy hacia food-manager');
  },
}));
app.use('/laundry-manager', createProxyMiddleware({
  target: 'http://localhost:4000',
  changeOrigin: true,
  onError: (err, req, res) => {
    res.status(500).send('Error en el proxy hacia laundry-manager');
  },
}));

app.listen(PORT, () => {
  console.log(`Servidor principal escuchando en el puerto ${PORT}`);
});