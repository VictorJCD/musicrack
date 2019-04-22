'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//creamos un objeto de tipo schema para unir nuestros modelos de usuario
var ArtistSchema = Schema({
	//con json definimos cada uno de sus datos
	name: String,
	description: String,
	image: String
});


module.exports = mongoose.model('Artist', ArtistSchema);