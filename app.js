// Impoprtaciones necesarias
const mongoose = require('mongoose');

// Conexión a Mongoose (no olvidar que esta conexión es una promesa.)
mongoose.connect('mongodb://localhost:27017/demo')
    .then(() => console.log('Conectado a MongoDB...'))
    .catch(err => console.log('No se pudo conectar con MongoDB', err));

// Creamos un schema para definir la estructura del documento dentro de la colección en la BD.
const cursoSchema = new mongoose.Schema({
    nombre      : String,
    autor       : String,
    etiquetas   : [String],
    fecha       : {type: Date, default: Date.now},
    publicado   : Boolean
});

// En POO: Clase -> Objeto.
// En MongoDB: Schema -> Modelo.

// Creamos el modelo, que utilizará el schema cursoSchema.
const Curso = mongoose.model('Curso', cursoSchema);

// Creamos una instancia (objeto) de Curso.
const curso = new Curso({
    nombre: 'JavaScript',
    autor: 'Damián',
    etiquetas: ['desarrollo web', 'front end'],
    publicado: true

});