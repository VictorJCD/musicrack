'use strict'

//para trabajar con ficheros:
var path = require('path');
var fs = require('fs');

//para la paginacion:
var mongoosePaginate = require('mongoose-Pagination');

//vamos a usar los diferntes modelos de la api: album, artista, song y user, lo importamos:
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

//metodo: get artist
function getArtist(req, res){
	var artistId = req.params.id; //tenemos que pasar este parametro por rutas

	Artist.findById(artistId, (err, artist) =>{
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!artist){
				res.status(404).send({message: 'El artista no existe'});
			}else{
				res.status(200).send({artist, message: 'hola'});
			}
		}
	});

	//prueba:
	//res.status(200).send({message: 'Metodo getArtist del controlador artist.js'});
}

function getArtists(req, res){
	if(req.params.page){
	//para usar la paginación, que va a recibir un parametro por la url llamado page
		var page = req.params.page;
	}else{
		var page = 1;
	}

	var itemsPerPage = 6;

	Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total){
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!artists){
				res.status(404).send({message: 'no hay artistas'});
			}else{
				return res.status(200).send({
					total_items: total,
					artists: artists
				});
			}
		}
	});
}



function saveArtist(req, res){
	var artist = new Artist();

	var params = req.body;
	artist.name = params.name;
	artist.description = params.description;
	artist.image = 'null';
	 
	artist.save((err, artistStored) => {
		if(err){
			res.status(500).send({message: 'Error al guardar el artista'});
		}else{
			if(!artistStored){
				res.status(404).send({message: 'El artista no ha sido guardado'});
			}else{
				res.status(200).send({message: artistStored});
			}
		}
	});
}


function updateArtist(req, res){
	var artistId = req.params.id;
	var update = req.body;

	Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
		if(err){
			res.status(500).send({message: 'Error al guardar el artista'});
		}else{
			if(!artistUpdated){
				res.status(404).send({message: 'El artista no ha sido actualizado'});
			}else{
				res.status(200).send({message: artistUpdated});
			}
		}
	});
}

function deleteArtist(req, res){
	var artistId = req.params.id;

	Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
		if(err){
			res.status(500).send({message: 'Error al borrar el artista'});
		}else{
			if(!artistRemoved){
				res.status(404).send({message: 'El artista no ha sido eliminado'});
			}else{
				console.log(artistRemoved);
				//aqui se borra el artista
				//res.status(200).send({message: artistRemoved});

				//aqui se borramos el album/nes de ese artista
				Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) =>{
					if(err){
						res.status(500).send({message: 'Error al eliminar el album'});
						}else{
							if(!albumRemoved){
								res.status(404).send({message: 'El album no ha sido eliminado'});
							}else{
								//res.status(200).send({message: albumRemoved});

								//aqui borramos las canciones:
								Song.find({album: albumRemoved._id}).remove((err, songRemoved) =>{
									if(err){
										res.status(500).send({message: 'Error al eliminar la cancion'});
										}else{
											if(!songRemoved){
												res.status(404).send({message: 'El cancion no ha sido eliminado'});
											}else{
												//res.status(200).send({message: songRemoved});
												res.status(200).send({artist: artistRemoved});
											}
										}
								});
							}
						}
				});

			}
		}
	});
}

function uploadImage(req, res){
	var artistId = req.params.id;
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

			Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated)=>{
				if(!artistId){
				res.status(404).send({message: 'El usuario no ha podido actualizarse'});
				}else{
					//console.log("usuario actualizado.")
					res.status(200).send({artist: artistUpdated});
				}
			});
			
		}else{
			res.status(200).send({message: 'Extension del archivo no válida'});
		}

	}else{
		res.status(200).send({message: 'No has subido ninguna imagen...'});
	}
}

function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/artists/'+imageFile;
	//comprobamos si existe el fichero en el servidor
	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});
}

module.exports = {
	getArtist,
	saveArtist,
	getArtists,
	updateArtist,
	deleteArtist,
	uploadImage,
	getImageFile
};

