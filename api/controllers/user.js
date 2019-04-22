'use string'

var fs = require('fs');//ficheros
var path = require('path');//ruta ficheros

var bcrypt = require('bcrypt-nodejs');//para guardar la contraseña directamente encriptada.
var User = require('../models/user'); 

var jwt = require('../services/jwt');

function pruebas(req, res){ 
	res.status(200).send({
		message: 'Probando una accion del controlador de usuarios del api rest con Node y Mongodb'
	});
}

function saveUser(req, res){
	var user = new User();

	var params = req.body;// vamos a recoger todos los parametros que nos llegan por post.

	//hacemos una prueba por post de contraseña:
	console.log(params);

	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_USER';
	user.image = 'null';

	//ahora guardaremos estos datos en la base de datos con el metodo demongus:
	//lo primero que hacemos es encriptar la contraseña, y tenemos que comproobar que ese parametro existe
	if (params.password){
		//encriptamos y guardamos
		bcrypt.hash(params.password, null, null, function(err, hash){
			user.password = hash;
			if(user.name != null && user.surname != null && user.email != null){
				//guarda usuario
				user.save((err, userStored) => {
					if(err){
						res.status(500).send({message: 'Error al guardar el usuario'});
					}else{
						if(!userStored){
							res.status(404).send({message: 'No se ha registrado el usuario'});
						}else{
							res.status(200).send({user:userStored});
						}

					}

				});//metodo de mongoose
			}else{
				res.status(200).send({message: 'Rellena todos los campos'});
			}
		});
	}else{
		res.status(500).send({message: 'Introduce la contraseña'});
	}
}

function loginUser(req, res){//este metodo va a comprobar los si en datos que nos llegan por post el email y la contraseña existen y coinciden en la base de datos.
//- vamos a buscar por el metodo findone el email en la base de datos
//- si existe comparamos las contraseña con la base de datos, y si son correctas nos va a loguear correctamente, y si no nos manda un error.

	var params = req.body;
	var email = params.email;
	var password = params.password;

	User.findOne({email: email.toLowerCase()}, (err, user) => {
		if(err){
			res.status(500).send({message: 'Error en la aplicacion'});
		}else{
			if(!user){
				res.status(404).send({message: 'El usuario no existe'});
			}else{
				//si el usuario existe, comprobamos la contraseña:
				bcrypt.compare(password, user.password, function(err, check){
					if(check){
					//si el check es correcto devuelve los datos del usuario logueado
						if(params.gethash){//aqui devolvemos un token de jwt
							res.status(200).send({
								token: jwt.createToken(user)
							});

						}else{
							res.status(200).send({user});
						}

				}else{// si el check no es correcto, la contraseña es incorrecta, devuelve un error
					res.status(404).send({message: 'La contraseña es incorrecta, y no se ha podido loguear el usuario'});
				}
			});
			}
		}
	});// ahora creamos la ruta de este método loginUser
}

//actualizar datos de un usuario
function updateUser(req, res){
	var userId = req.params.id; //este dato lo vamos a recoger de la url
	var update = req.body; //esto son los datos para actualizar, que nos llegan po post
	
	if(userId != req.user.sub){
		return res.status(500).send({message: 'Nos tienes permiso para actualizar este usuario'});
	}

	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
		if(err){
			res.status(500).send({message: 'Error al acrtualizarse el usuario'});
		}else{
			if(!userUpdated){
				res.status(404).send({message: 'El usuario no ha podido actualizarse'});
			}else{
				console.log("usuario actualizado.")
				res.status(200).send({user: userUpdated});
			}
		}

	});
}


function uploadImage(req, res){
	var userId = req.params.id;
	var file_name = 'No subido...';

	if(req.files){
		var file_path = req.files.image.path;

		//vamos a recortar el string y conseguir el nombre de la imagen a secas.
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		//solo quiero sacar la extension de la imagen por ejemplo:
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		//console.log(file_path);
		//console.log(ext_split);
		//console.log(file_name);
		//console.log(file_ext);

		//ahora vamos a comprobar si el fichero que he subido tiene la extension conrrecta:
		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

			User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated)=>{
				if(!userUpdated){
				res.status(404).send({message: 'El usuario no ha podido actualizarse'});
				}else{
					//console.log("usuario actualizado.")
					res.status(200).send({image: file_name, user: userUpdated});
				}
			});
			
		}else{
			res.status(200).send({message: 'Extension del archivo no válida'});
		}

	}else{
		res.status(200).send({message: 'No has subido ninguna imagen...'});
	}
}


//Método que saque un fichero del servidor y lo muestre
function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/users/'+imageFile;
	//comprobamos si existe el fichero en el servidor
	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});
}


	//exportar los metodos que hagamos en este fichero ( en un bjeto json)
module.exports = {
	pruebas,
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
};

//ahora tenemos que crear una ruta en otra carpeta: (routes)