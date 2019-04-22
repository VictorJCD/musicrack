'use strict'

var jwt = require('jwt-simple');

//moment js --> es el objeto tiene la fecha de creacion del token y la fecha de expiracion del token.
var moment = require('moment');

var secret = 'clave_secreta_victor';


exports.createToken = function(user){
	var payload = { //estos son los datos que se van a codificar (en json)

		//la propiedad sub se usa para guardar el ID del registro en la BD
		sub:  user._id,
		name: user.name,
		surname: user.email,
		email: user.email,
		role: user.role,
		image: user.image,
		iat: moment().unix(), //esta es la fecha de creacion del token, nos saca la fecha en unix en formato tem stam actual
		exp: moment().add(30, 'days').unix //fecha de expiracion


	};

	return jwt.encode(payload, secret); //le pasamos una clave secreta para poder crear un hash que el pueda descifrar.

};
