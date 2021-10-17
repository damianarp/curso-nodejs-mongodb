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

// Creamos una función asíncrona para poder guardar el objeto dentro de la BD con un tiempo de espera await.
async function crearCurso(){
    // Creamos una instancia (objeto) de Curso.
    const curso = new Curso({
        nombre: 'Angular',
        autor: 'Rocío',
        etiquetas: ['desarrollo web', 'front end'],
        publicado: true
    });

    // Guardamos el objeto dentro de la BD (debemos indicarle una espera con await, ya que no sabemos cuánto puede tardar en ejecutarse el guardado, de esta manera la app no se cuelga.)
    // El guardado retorna un resultado que es la respuesta del servidor con el documento que se crea en ese moemtno en la BD.
    const resultado = await curso.save();

    // Mostramos el documento.
    console.log(resultado);
};

// Llamamos a la función crearCurso() para que se ejecute y se cree el documento en la BD.
crearCurso();