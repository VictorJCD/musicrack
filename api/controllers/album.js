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
function getAlbum(req, res){
	var albumId = req.params.id;

	//asi sacamos todos los datos del artista de ese album.
	Album.findById(albumId).populate({path: 'artist'}).exec((err, album) =>{
		if(err){
			res.status(500).send({message: 'error en la peticion'});
		}else{
			if(!album){
				res.status(404).send({message: 'El album no existe'});
			}else{
				res.status(200).send({album});
			}
		}
	});

	//res.status(200).send({message: 'Accion getAlbum'});
}

//queremos recoger todos los albums que hay en un artista
function getAlbums(req, res){
	var artistId = req.params.artist;
	if(!artistId){
		//sacar todos los albums de la base de datos
		var find = Album.find({}).sort('title');
	}else{
		//sacar los albums de un artista en concreto de la BD
		var find = Album.find({artist: artistId}).sort('year');
	}

	find.populate({path: 'artist'}).exec((err, albums) =>{
		if(err){
			res.status(500).send({message: 'error en la peticion'});
		}else{
			if(!albums){
				res.status(404).send({message: 'No hay albums'});
			}else{
				res.status(200).send({albums});
			}
		}
	});
}



function saveAlbum(req, res){
	var album = new Album();

	var params = req.body;
	album.title = params.title;
	album.description = params.description;
	album.year = params.year;
	album.image = 'null';
	album.artist = params.artist;

	album.save((err, albumStored) => {
		if(err){
			res.status(500).send({message: 'error en el servidor'});
		}else{
			if(!albumStored){
				res.status(404).send({message: 'No se ha guardado el album'});
			}else{
				res.status(200).send({album: albumStored});
			}
		}
	});

}

//actualizar un album
function updateAlbum(req, res){
	var albumId = req.params.id;
	var update = req.body;

	Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
		if(err){
			res.status(500).send({message: 'error en el servidor'});
		}else{
			if(!albumUpdated){
				res.status(404).send({message: 'No se ha actualizado el album'});
			}else{
				res.status(200).send({album: albumUpdated});
			}
		}
	});
}

function deleteAlbum(req, res){
	var albumId = req.params.id;


	Album.findByIdAndRemove(albumId, (err, albumRemoved) =>{
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
									res.status(200).send({album: albumRemoved});
								}
							}
					});
				}
			}
	});

}


function uploadImage(req, res){
	var albumId = req.params.id;
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

			Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated)=>{
				if(!albumUpdated){
				res.status(404).send({message: 'El usuario no ha podido actualizarse'});
				}else{
					//console.log("usuario actualizado.")
					res.status(200).send({album: albumUpdated});
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
	var path_file = './uploads/albums/'+imageFile;
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
	getAlbum,
	saveAlbum,
	getAlbums,
	updateAlbum,
	deleteAlbum,
	uploadImage,
	getImageFile
};