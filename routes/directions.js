
const routes = require('express').Router();

var gMapService = require('../services/gmap.js');
var repo = require('../services/repository.js');

//Handler for routes, this is only a controller file, all business logic
//to be delegated to route service

routes.get("/", (req,res)=>{

    var source = req.query.source;
    var dest = req.query.destination;
    console.log("Have to get directions for::"+source+"::"+dest);
    repo.findRoute(source,dest,function(route){
        if(route && route!=null){
          console.log("Cache hit for routes");
          res.send(route.response);
        }
        else{
          console.log("Route not found, hitting directions api");
          gMapService.getDirections(source, dest, function(response){
              var responseJson = response;
              repo.insertRoute(source, dest, responseJson);
              res.send(responseJson);
          });
        }
    });
});

module.exports = routes;
