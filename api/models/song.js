'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//creamos un objeto de tipo schema para unir nuestros modelos de usuario
var SongSchema = Schema({
	//con json definimos cada uno de sus datos
	number: String,
	name: String,
	duration: String,
	file: String,
	album: { type: Schema.ObjectId, ref: 'Album'}, 
	image: String
});

//vamos a exportar el modelo para poder utilizar este obejeto

module.exports = mongoose.model('Song', SongSchema);