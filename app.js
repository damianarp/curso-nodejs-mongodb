// Impoprtaciones necesarias
const mongoose = require('mongoose');

// Conexión a Mongoose (no olvidar que esta conexión es una promesa.)
mongoose.connect('mongodb://localhost:27017/demo')
    .then(() => console.log('Conectado a MongoDB...'))
    .catch(err => console.log('No se pudo conectar con MongoDB', err));
