// Importaciones necesarias.
const mongoose = require('mongoose');


////////// CONEXIÓN A MONGODB //////////
// Conexión a Mongoose (no olvidar que esta conexión es una promesa.)
mongoose.connect('mongodb://localhost:27017/demo')
    .then(() => console.log('Conectado a MongoDB...'))
    .catch(err => console.log('No se pudo conectar con MongoDB', err));


////////// CONFIGURACIÓN DEL DOCUMENTO //////////
// Creamos un schema para definir la estructura del documento dentro de la colección en la BD.
const cursoSchema = new mongoose.Schema({
    nombre      : String,
    autor       : String,
    etiquetas   : [String],
    fecha       : {type: Date, default: Date.now},
    publicado   : Boolean
});

// En POO: Clase -> objeto.
// En MongoDB: schema -> Modelo -> documento (u objeto).

// Creamos el modelo, que utilizará el schema cursoSchema.
const Curso = mongoose.model('Curso', cursoSchema);


////////// PAGINACIÓN //////////
// Creamos una constante para el número de páginas y otra para la cantidad de documentos por página.
const pageNumber = 2;
const pageSize = 5;
// Esto debe venir como parámetro en la ruta de la app, por ejemplo:
// api/cursos?pageNumber=2&pageSize=10


////////// FUNCIONES CRUD //////////
// CREAR DOCUMENTO.
// Creamos una función asíncrona para poder guardar el documento (objeto) dentro de la BD.
async function crearCurso(){
    // Creamos una instancia (documento) de Curso.
    const curso = new Curso({
        nombre: 'MongoDB',
        autor: 'Ramiro',
        etiquetas: ['desarrollo web', 'data base'],
        publicado: true
    });

    // Guardamos el documento dentro de la BD (debemos indicarle una espera con await, ya que no sabemos cuánto puede tardar en ejecutarse el guardado, de esta manera la app no se cuelga.)
    // El guardado retorna un resultado que es la respuesta del servidor con el documento que se crea en ese momento en la BD.
    const resultado = await curso.save();

    // Mostramos el documento.
    console.log(resultado);
};

// LISTAR DOCUMENTOS.
// Creamos otra función asíncrona para poder consultar el documento (objeto) que está guardado dentro de la BD.
async function listarCursos(){
    // Creamos una instancia (objeto) que va a ser igual a la respuesta que tengamos del modelo Curso a través de su método find(). Nos devuelve una promesa, por lo que tenemos que manejarla con await para que quede en espera.
    const cursos = await Curso
        .find({publicado: true}) // Podemos filtrar por campo.
        .skip((pageNumber - 1) * pageSize) // Paginación.
        .limit(pageSize) // Podemos limitar la cantidad de documentos según el pageSize.
        .sort({autor: -1}) // Podemos orden por autor. 1 significa ordenamiento asc. -1 es desc.
        .select({nombre: 1, etiquetas: 1}); // Muestra solo campos específicos.

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

    // Mostramos los documentos.
    console.log(cursos);
};

// ACTUALIZAR DOCUMENTO.
// Creamos otra función asíncrona para poder actualizar el documento (objeto) que está guardado dentro de la BD. Requiere de un id para saber cuál documento debemos actualizar.
async function actualizarCurso(id) {
    // FORMA 1 PARA ACTUALIZAR UN DOCUMENTO.
    // Definimos una constante que recibe el documento que queremos actualizar utilizando el método findById().
    // Al hacer la selección del documento, nos devuelve una promesa, por lo que tenemos que manejarla con await para que quede en espera.
    // const curso = await Curso.findById(id);

    // Validamos si existe o no el documento en nuestra BD.
    // if(!curso) {
    //     console.log('El curso no existe');
    //     return;
    // }

    // Actualizamos la info del documento
    // curso.publicado = false;
    // curso.autor = 'Pablo';

    // Otra forma de actualizar la info del documento es a través del método set().
    // curso.set({
    //     publicado: false,
    //     autor: 'Pablo'
    // });

    // Guardamos el documento actualizado dentro de la BD (debemos indicarle una espera con await, ya que no sabemos cuánto puede tardar en ejecutarse el guardado, de esta manera la app no se cuelga.)
    // El guardado retorna un resultado que es la respuesta del servidor con el documento que se actualizó en ese momento en la BD.
    // const resultado = await curso.save();

    // Mostramos el documento.
    // console.log(resultado);


    // FORMA 2 PARA ACTUALIZAR UN DOCUMENTO.
    // Definimos una constante resultado como instancia de Curso que espera una actualización de un documento a través del método updateOne(), anteriormente se usaba update(), pero ahora ya no se usa más (deprecated).
    // El primer parámetro corresponde a la condición por la cuál vamos a hacer la actualización (a través del id), el segundo parámetro corresponde al/los operador/es que queremos actualizar.
    // const resultado = await Curso.updateOne({_id: id}, {
    //     $set: {
    //         autor: 'Lucía',
    //         publicado: true
    //     }
    // });

    // // Mostramos el documento.
    // console.log(resultado);

    // FORMA 3 PARA ACTUALIZAR UN DOCUMENTO.
    // Consiste en seleccionar y actualizar el documento de una sola vez con el método findByIdAndUpdate().
    const resultado = await Curso.findByIdAndUpdate(id, {
        $set: {
            autor: 'Pamela',
            publicado: true
        }
    }, {new: true}); // Para que muestre el resultado actualizado cuando se haga el console.log(resultado).

    // Mostramos el documento.
    console.log(resultado);
}

// ELIMINAR DOCUMENTO.
// Creamos otra función asíncrona para poder eliminar el documento (objeto) que está guardado dentro de la BD. Requiere de un id para saber cuál documento debemos eliminar.
async function eliminarCurso(id) {
    // Esta forma no nos muestra el documento eliminado en el console.log().
    // Definimos una constante resultado como instancia de Curso que espera una eliminación de un documento, a través del método deleteOne().
    // const result = await Curso.deleteOne({_id: id});
    // console.log(result);

    // Otra forma de eliminar un documento es mediante el método findByIdAndDelete().
    // Esta forma nos muestra el documento eliminado en el console.log().
    const resultado = await Curso.findByIdAndDelete(id);
    console.log(resultado);
}


////////// LLAMADA A LAS FUNCIONES CRUD //////////

// Llamamos a la función crearCurso() para que se ejecute y se cree el documento en la BD.
// crearCurso();

// Llamamos a la función listarCursos() para que se ejecute y se consulten los documentos de la BD.
// listarCursos();

// Llamamos a la función actualizarCurso() para que se ejecute y se actualicen los documentos de la BD.
// actualizarCurso('616ca9d03c2ce960e0a9ef41'); // El id lo obtenemos del documento guardado en Robo 3T.

// Llamamos a la función eliminarCurso() para que se ejecute y se elimine el documento de la BD.
// eliminarCurso('616ce814eb657f8b811ee749');