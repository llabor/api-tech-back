var express = require('express');
var bodyParser = require('body-parser');
var requestJSON = require('request-json');
const cors = require('cors');
var app = express();
var port = process.env.PORT || 3000;
var usersFile = require('./users.json');
var URLbase = "/colapi/v3/";
var newID = 0;

var baseMLabURL = 'https://api.mlab.com/api/1/databases/apitechuelb5ed/collections/';
const apikeyMLab = 'apiKey=NQCR6_EMDAdqyM6VEWg3scF_k32uwvHF';

app.use(bodyParser.json());

app.use(cors());
app.options('*', cors());

app.listen(port, function(){
  console.log("API colapi escuchando en el puerto " + port + "...");
});


// GET users consumiendo API REST de mLab
app.get(URLbase + 'users',
  function(req, res) {
    console.log("GET /colapi/v3/users");
    var httpClient = requestJSON.createClient(baseMLabURL);
    console.log("Cliente HTTP mLab creado.");
    var queryString = 'f={"_id":0}&';
    httpClient.get('user?' + queryString + apikeyMLab,
      function(err, respuestaMLab, body) {
        var response = {};
        if(err) {
            response = {
              "msg" : "Error obteniendo usuario."
            }
            res.status(500);
        } else {
          if(body.length > 0) {
            response = body;
          } else {
            response = {
              "msg" : "Ningún elemento 'user'."
            }
            res.status(404);
          }
        }
        res.send(response);
      });
});

// Petición GET id con mLab
app.get(URLbase + 'users/:id',
  function (req, res) {
    console.log("GET /colapi/v3/users/:id");
    console.log(req.params.id);
    var id = req.params.id;
    var queryString = 'q={"id":' + id + '}&';
    var queryStrField = 'f={"_id":0}&';
    var httpClient = requestJSON.createClient(baseMLabURL);
    httpClient.get('user?' + queryString + queryStrField + apikeyMLab,
      function(err, respuestaMLab, body){
        console.log("Respuesta mLab correcta.");
      //  var respuesta = body[0];
        var response = {};
        if(err) {
            response = {
              "msg" : "Error obteniendo usuario."
            }
            res.status(500);
        } else {
          if(body.length > 0) {
            response = body;
          } else {
            response = {
              "msg" : "Usuario no encontrado."
            }
            res.status(404);
          }
        }
        res.send(response);
      });
});


//Method GET with params MLab users and accounts with ID
app.get(URLbase + 'users/:id/accounts',
 function (req, res) {
  console.log("GET/colapi/v3/accounts/:id");
  console.log("request.params.id: " + req.params.id);
  var id = req.params.id;
  var queryStringID = 'q={"user_id":' + id + '}&';
  var queryString = 'f={"_id":0}&';
  var httpClient = requestJSON.createClient(baseMLabURL);
  httpClient.get('account?' + queryString + queryStringID + apikeyMLab,
    function(error, respuestaMLab, body){
      console.log('error '+ error);
      console.log('respuestaMLab ' + respuestaMLab);
      console.log('body ' + body);
      //var respuesta = body;
      var respuesta = {};
      respuesta = !error ? body : {"msg":"usuario con ese ID no encontrado"};
      res.send(respuesta);
    });
});


// POST 'users' mLab
app.post(URLbase + 'users',
  function(req, res){
    var clienteMlab = requestJSON.createClient(baseMLabURL);
    console.log(req.body);
    clienteMlab.get('user?' + apikeyMLab,
      function(error, respuestaMLab, body){
        newID = body.length + 1;
        console.log("newID:" + newID);
        var newUser = {
          "id" : newID,
          "first_name" : req.body.first_name,
          "last_name" : req.body.last_name,
          "email" : req.body.email,
          "password" : req.body.password
        };
        clienteMlab.post(baseMLabURL + "user?" + apikeyMLab, newUser,
          function(error, respuestaMLab, body){
            console.log(body);
            res.send(body);
          });
      });
  });


//PUT users con parámetro 'id'
app.put(URLbase + 'users/:id',
function(req, res) {
  var id = req.params.id;
  var queryStringID = 'q={"id":' + id + '}&';
  var clienteMlab = requestJSON.createClient(baseMLabURL);
  clienteMlab.get('user?'+ queryStringID + apikeyMLab,
    function(error, respuestaMLab, body) {
     var cambio = '{"$set":' + JSON.stringify(req.body) + '}';
     console.log(req.body);
     console.log(cambio);
     clienteMlab.put(baseMLabURL +'user?' + queryStringID + apikeyMLab, JSON.parse(cambio),
      function(error, respuestaMLab, body) {
        console.log("body:"+ body); // body.n devuelve 1 si pudo hacer el update
       //res.status(200).send(body);
       res.send(body);
      });
    });
});


// Petición PUT con id de mLab (_id.$oid)
  app.put(URLbase + 'usersmLab/:id',
    function (req, res) {
      var id = req.params.id;
      let userBody = req.body;
      var queryString = 'q={"id":' + id + '}&';
      var httpClient = requestJSON.createClient(baseMLabURL);

      httpClient.get('user?' + queryString + apikeyMLab,
        function(err, respuestaMLab, body){
          let response = body[0];
          console.log(body);

          //Actualizo campos del usuario
          let updatedUser = {
            "id" : req.body.id,
            "first_name" : req.body.first_name,
            "last_name" : req.body.last_name,
            "email" : req.body.email,
            "password" : req.body.password
          };//Otra forma simplificada (para muchas propiedades)
          // var updatedUser = {};
          // Object.keys(response).forEach(key => updatedUser[key] = response[key]);
          // Object.keys(userBody).forEach(key => updatedUser[key] = userBody[key]);

          // PUT a mLab
          httpClient.put('user/' + response._id.$oid + '?' + apikeyMLab, updatedUser,
            function(err, respuestaMLab, body){
              var response = {};
              if(err) {
                  response = {
                    "msg" : "Error actualizando usuario."
                  }
                  res.status(500);
              } else {
                if(body.length > 0) {
                  response = body;
                } else {
                  response = {
                    "msg" : "Usuario actualizado correctamente."
                  }
                  res.status(404);
                }
              }
              res.send(response);
            });
        });
  });


//DELETE user with id
app.delete(URLbase + "users/:id",
  function(req, res){
    console.log("entra al DELETE");
    console.log("request.params.id: " + req.params.id);
    var id = req.params.id;
    var queryStringID = 'q={"id":' + id + '}&';
    console.log(baseMLabURL + 'user?' + queryStringID + apikeyMLab);
    var httpClient = requestJSON.createClient(baseMLabURL);
    httpClient.get('user?' +  queryStringID + apikeyMLab,
      function(error, respuestaMLab, body){
        var respuesta = body[0];
        console.log("body delete:"+ respuesta);
        httpClient.delete(baseMLabURL + "user/" + respuesta._id.$oid +'?'+ apikeyMLab,
          function(error, respuestaMLab,body){
            res.send(body);
        });
      });
  });


//Method POST login
app.post(URLbase + "login",
  function (req, res){
    console.log("POST /colapi/v3/login");
    let email = req.body.email;
    let pass = req.body.password;
    let queryString = 'q={"email":"' + email + '","password":"' + pass + '"}&';
    let limFilter = 'l=1&';
    let clienteMlab = requestJSON.createClient(baseMLabURL);
    clienteMlab.get('user?'+ queryString + limFilter + apikeyMLab,
      function(error, respuestaMLab, body) {
        if(!error) {
          if (body.length == 1) { // Existe un usuario que cumple 'queryString'
            let login = '{"$set":{"logged":true}}';
            clienteMlab.put('user?q={"id": ' + body[0].id + '}&' + apikeyMLab, JSON.parse(login),
            //clienteMlab.put('user/' + body[0]._id.$oid + '?' + apikeyMLab, JSON.parse(login),
              function(errPut, resPut, bodyPut) {
                res.send({'msg':'Login correcto', 'user':body[0].email});
                // If bodyPut.n == 1, put de mLab correcto
              });
          }
          else {
            res.status(404).send({"msg":"Usuario no válido."});
          }
        } else {
          res.status(500).send({"msg": "Error en petición a mLab."});
        }
    });
});


//Method POST logout
app.post(URLbase + "logout",
  function(req, res) {
    console.log("POST /colapi/v3/logout");
    var email = req.body.email;
    var queryString = 'q={"email":"' + email + '","logged":true}&';
    console.log(queryString);
    var  clienteMlab = requestJSON.createClient(baseMLabURL);
    clienteMlab.get('user?'+ queryString + apikeyMLab,
      function(error, respuestaMLab, body) {
        var respuesta = body[0]; // Asegurar único usuario
        if(!error) {
          if (respuesta != undefined) { // Existe un usuario que cumple 'queryString'
            let logout = '{"$unset":{"logged":true}}';
            clienteMlab.put('user?q={"id": ' + respuesta.id + '}&' + apikeyMLab, JSON.parse(logout),
            //clienteMlab.put('user/' + respuesta._id.$oid + '?' + apikeyMLab, JSON.parse(logout),
              function(errPut, resPut, bodyPut) {
                res.send({'msg':'Logout correcto', 'user':respuesta.email});
                // If bodyPut.n == 1, put de mLab correcto
              });
            } else {
                res.status(404).send({"msg":"Logout failed!"});
            }
        } else {
          res.status(500).send({"msg": "Error en petición a mLab."});
        }
    });
});


/*


// Petición GET con Query String (req.query)
app.get(URLbase + 'users',
  function(req, res) {
    console.log("GET con query string.");
    console.log(req.query.id);
    console.log(req.query.country);
    res.send(usersFile[pos - 1]);
  //  respuesta.send({"msg" : "GET con query string"});
});

// Petición POST (reg.body)
app.post(URLbase + 'users',
  function(req, res) {
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
  });


// PUT
app.put(URLbase + 'users/:id',
   function(req, res){
     console.log("PUT /colapi/v2/users/:id");
     var idBuscar = req.params.id;
     var updateUser = req.body;
     var encontrado = false;
     for(i = 0; (i < usersFile.length) && !encontrado; i++) {
       console.log(usersFile[i].id);
       if(usersFile[i].id == idBuscar) {
         encontrado = true;
         res.send({"msg" : "Usuario actualizado correctamente.", updateUser});
       }
     }
     if(!encontrado) {
       res.send({"msg" : "Usuario no encontrado.", updateUser});
     }
   });

// DELETE
app.delete(URLbase + 'users/:id',
  function(req, res) {

    const id = req.params.id-1;
    const reg = usersFile[id];

    if(undefined != reg){
      usersFile.splice(id,1);
      res.send(204);
   } else
     res.send(404);
});

// LOGIN - users.json
app.post(URLbase + 'login',
  function(request, response) {
    console.log("POST /apicol/v2/login");
    console.log(request.body.email);
    console.log(request.body.password);
    var user = request.body.email;
    var pass = request.body.password;
    for(us of usersFile) {
      if(us.email == user) {
        if(us.password == pass) {
          us.logged = true;
          writeUserDataToFile(usersFile);
          console.log("Login correcto!");
          response.send({"msg" : "Login correcto.", "idUsuario" : us.id, "logged" : "true"});
        } else {
          console.log("Login incorrecto.");
          response.send({"msg" : "Login incorrecto."});
        }
      }
    }
});

// LOGOUT - users.json
app.post(URLbase + 'logout',
  function(request, response) {
    console.log("POST /apicol/v2/logout");
    var userId = request.body.id;
    for(us of usersFile) {
      if(us.id == userId) {
        if(us.logged) {
          delete us.logged; // borramos propiedad 'logged'
          writeUserDataToFile(usersFile);
          console.log("Logout correcto!");
          response.send({"msg" : "Logout correcto.", "idUsuario" : us.id});
        } else {
          console.log("Logout incorrecto.");
          response.send({"msg" : "Logout incorrecto."});
        }
      }  us.logged = true
    }
});

function writeUserDataToFile(data) {
  var fs = require('fs');
  var jsonUserData = JSON.stringify(data);

  fs.writeFile("./users.json", jsonUserData, "utf8",
   function(err) { //función manejadora para gestionar errores de escritura
     if(err) {
       console.log(err);
     } else {
       console.log("Datos escritos en 'users.json'.");
     }
   })
}
*/
