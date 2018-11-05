var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;
var usersFile = require('./users.json');
var URLbase = "/colapi/v1/";

app.listen(port, function(){
  console.log("API apicol escuchando en el puerto " + port + "...");
});

app.use(bodyParser.json());

// GET users
app.get(URLbase + 'users',
  function(request, response) {
    console.log(URLbase);
    console.log(usersFile);
    response.send(usersFile);
});

// Petición GET con parámetros (req.params)
app.get(URLbase + 'users/:id/:otro',
  function (req, res) {
    console.log("GET /colapi/v1/users/:id/:otro");
    console.log(req.params);
    console.log('req.params.id: ' + req.params.id);
    console.log('req.params.otro: ' + req.params.otro);
    var respuesta = req.params;
    //res.send(req.params);
    res.send(respuesta);
    // var pos = req.params.id;
    //console.log("pos : " + pos);
    //res.send(usersFile[pos - 1]);
});

// Petición GET con Query String (req.query)
app.get(URLbase + 'users',
  function(req, res) {
    console.log("GET con query string.");
    console.log(req.query.id);
    console.log(req.query.country);
    res.send(usersFile[pos - 1]);
    respuesta.send({"msg" : "GET con query string"});
});

// Petición POST (reg.body)
app.post(URLbase + 'users',
  function(req, res) {
    // console.log("Post correcto!");
    // console.log(req.body);
    // console.log(req.body.first_name);
    var newID = usersFile.length + 1;
    var newUser = {
      "id" : newID,
      "first_name" : req.body.first_name,
      "last_name" : req.body.last_name,
      "email" : req.body.email,
      "country" : req.body.country
    };
    usersFile.push(newUser);
    console.log(usersFile);
    res.send({"msg" : "Usuario creado correctamente: ", newUser});
    //res.sendfile('users.json'); //DEPRECATED
    //res.sendFile('users.json', {root: __dirname});
  });


// PUT
app.put(URLbase + 'users/:id',
   function(req, res){
     console.log("PUT /colapi/v1/users/:id");
     var idBuscar = req.params.id;
     var updateUser = req.body;
    //  console.log(req.body);
    //  console.log(idBuscar);
    //  console.log(usersFile.length);
     for(i = 0; i < usersFile.length; i++) {
       console.log(usersFile[i].id);
       if(usersFile[i].id == idBuscar) {
         res.send({"msg" : "Usuario actualizado correctamente.", updateUser});
       }
     }
     res.send({"msg" : "Usuario no encontrado.", updateUser});
   });

// DELETE
app.delete(URLbase + 'users/:id',
  function(req, res) {

});
