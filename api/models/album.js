'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//creamos un objeto de tipo schema para unir nuestros modelos de usuario
var AlbumSchema = Schema({
	//con json definimos cada uno de sus datos
	title: String,
	description: String,
	year: Number,
	image: String,
	artist: { type: Schema.ObjectId, ref: 'Artist'} //aqui vamos a guardar una referencia a otro objeto, Resumiendo: esta propiedad artist va a guardar un ID de un doc de la db, que va a ser de tipo artist, de forma que mongodb va a reconocer que este objectID esta en la coleccion de objetos artists y dentro de ella buscara el objeto y relacionara un objto con otro
});

//vamos a exportar el modelo para poder utilizar este obejeto

module.exports = mongoose.model('Album', AlbumSchema);