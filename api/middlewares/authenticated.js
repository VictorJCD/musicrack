'use strict'

var jwt = require('jwt-simple');

//moment js --> es el objeto tiene la fecha de creacion del token y la fecha de expiracion del token.
var moment = require('moment');

var secret = 'clave_secreta_victor';


exports.ensureAuth = function(req, res, next){
	//recogemos la autoriacion
	if(!req.headers.authorization){
		return res.status(403).send({message: 'la peticion no tiene la cabecera de autenticacion'});
	}
		var token = req.headers.authorization.replace(/['"]+/g, '');
		try{
			
			var payload = jwt.decode(token, secret);
			if(payload.exp <= moment().unix()){
				return res.status(401).send({message: 'Token expirado, hay que volver a autenticarse'});
			}
		}catch(ex){
			//console.log(ex);
			return res.status(404).send({message: 'Token no valido'});
		}
	
	req.user = payload;
	next();
};