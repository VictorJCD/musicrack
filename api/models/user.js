'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//creamos un objeto de tipo schema para unir nuestros modelos de usuario
var UserSchema = Schema({
	//con json definimos cada uno de sus datos
	name: String,
	surname: String,
	email: String,
	password: String,
	role: String,
	image: String
});

//vamos a exportar el modelo para poder utilizar este obejeto
//User va autilizar esa entidad y userSchema es el esquema creado.
//Lo va a guardar dentro de una coleccion llamada Users (lo pluraliza) y guarda una instancia de cada uno de los usuarios que vallamos usando)
module.exports = mongoose.model('User', UserSchema);

