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

////////// PAGINACIÓN //////////
// Creamos una constante para el numero de páginas y otra para la cantidad de documentos por página.
const pageNumber = 2;
const pageSize = 10;
// Esto debe venir como parámetro en la ruta de la app, por ejemplo:
// api/cursos?pageNumber=2&pageSize=10

////////// FUNCIONES //////////
// Creamos una función asíncrona para poder guardar el objeto (documento) dentro de la BD con un tiempo de espera await.
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

// Creamos otra función asíncrona para poder consultar el objeto (documento) que está guardado dentro de la BD con un tiempo de espera await.
async function listarCursos(){
    // Creamos una instancia (objeto) que va a ser igual a la respuesta que tengamos del modelo Curso a través de su método find().
    const cursos = await Curso

        ////////// OPERADORES DE COMPARACIÓN //////////
        // eq (equal, igual)
        // ne (not equal, no igual)
        // gt (greater than, mayor que)
        // gte (greater than or equal to, mayor o igual que)
        // lt (less than, menor que)
        // lte (less than or equal to, menor o igual que)
        // in (indica si hay valores dentro de una consulta)
        // nin (not in, contrario a in)

        // Ejemplos:
        // .find({precio: {$gte: 10, $lte: 30}}) // Precio entre 10 y 30. '$' indica parámetro.
        // .find({precio: {$in: [10, 15, 25]}}) // Muestra precios específicos (10, 15 y 25).

        ////////// OPERADORES LÓGICOS //////////
        // and
        // or

        // Ejemplos:
        // AND
        // .find().and([{autor: 'Rocío'}, {publicado: true}]) // Primera condición -> autor: Rocío y Segunda condición -> publicado: true.
        // También se puede escribir como:
        // .find({autor: 'Rocío'}, {publicado: true})

        // OR
        // .find().or([{autor: 'Rocío'}, {publicado: true}]) // Primera condición -> autor: Rocío ó Segunda condición -> publicado: true.

        ////////// EXPRESIONES REGULARES //////////
        // Se aplican en campos que tengan valores de tipo String.

        // Ejemplos:
        // Comienza con la palabra 'desa'.
        // .find({etiquetas: /^desa/ })

        // Termina con la palabra 'ular'.
        // .find({nombre: /ular$/ })

        // Cuando un campo tiene un contenido específico 'amiá'.
        // .find({autor: /.*amiá.*/ })

        .find({publicado: true}) // Podemos filtrar por campo.
        .skip((pageNumber - 1) * pageSize) // Paginación.
        .limit(pageSize) // Podemos limitar la cantidad de documentos según el pageSize.
        .sort({autor: -1}) // Podemos orden por autor. 1 significa ordenamiento asc. -1 es desc.
        .select({nombre: 1, etiquetas: 1}); // Muestra solo campos específicos.

    // Mostramos los documentos.
    console.log(cursos);
};

// Llamamos a la función crearCurso() para que se ejecute y se cree el documento en la BD.
//crearCurso();

// Llamamos a la función listarCursos() para que se ejecute y se consulten los documentos de la BD.
listarCursos();