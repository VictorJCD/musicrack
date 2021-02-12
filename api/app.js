'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas:
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');



//configurar bodyparser:
app.use(bodyParser.urlencoded({extended:false})); //es necesario para que bodyparse funciones
app.use(bodyParser.json());//convierte a objeto json los datos que nos llegan por las peticiones http

//configurar cabeceras: //esto es necesario para evitar errores (para que la api a nivel de ajax funcione)
app.use((req, res, next) =>{
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Method');
	res.header('Access-Control-Allow-Methods', 'Get, POST, OPTION, PUT, DELETE');
	res.header('Allow', 'Get, POST, OPTION, PUT, DELETE');

	next();
});


//rutas base
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);


//esta ruta la vaos a eliminar por que ya heos creado los controladores y rutas
//app.get('/pruebas', function(req, res){
//	res.status(200).send({message: 'Bienvenido al la aplicacion node de Victor'});
//});

//exportamos el modulo; podemos utilizar express en otros ficheros que invluyan app.json
module.exports = app;

