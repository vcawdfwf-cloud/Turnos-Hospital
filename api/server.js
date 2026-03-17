const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos manualmente para Vercel
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/admission.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'admission.html'));
});

app.get('/public-screen.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'public-screen.html'));
});

app.get('/css/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'css', 'styles.css'));
});

app.get('/js/registro.js', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'js', 'registro.js'));
});

app.get('/js/admission.js', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'js', 'admission.js'));
});

app.get('/js/public.js', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'js', 'public.js'));
});

// Exportar para Vercel
module.exports = app;