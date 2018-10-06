const request = require("request");
const routes = require('express').Router();

var gMapService = require('../services/gmap.js');

routes.get("/", (req,res)=>{
  var queryTerm = req.query.key;
  gMapService.getMatchingCities(queryTerm, function(response){
    res.send(response);
  })
});

module.exports = routes;
