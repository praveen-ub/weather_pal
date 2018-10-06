
const routes = require('express').Router();

var weatherService = require('../services/weather.js');
var repo = require('../services/repository.js');

routes.get("/", (req,res)=>{

    var lat = req.query.lat;
    var lon = req.query.lng;
    repo.findWeather(lat,lon,function(response){
      if(response && response!=null){
        console.log("Cache hit for weather");
        res.send(response.weather);
      }
      else{
        console.log("Weather not found, hitting openweathermap api");
        weatherService.getWeatherData(lat, lon, function(weatherData){
          repo.insertWeather(lat, lon, weatherData);
          res.send(weatherData);
        });
      }
    });
});

module.exports = routes;
