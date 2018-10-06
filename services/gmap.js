//service to interact with google api services

const request = require('request');
var configs = require('../config.js');
const googleMapsClient = require('@google/maps').createClient({
  key: configs.gmap.API_KEY
});

var gMapService = {

    getMatchingCities:function(query, callback){
      var url = `${configs.gmap.PLACES_URL}?input=${query}&types=(cities)&key=${configs.gmap.API_KEY}`;
      request(url, function (error, response, body) {
        callback(response);
      });
    },
    getDirections: function(source, destination, callback){
      googleMapsClient.directions(
        {
          origin: source,
          destination:destination,
          mode:'driving'
        },
        function(err, response) {
            if (!err) {
              callback(response.json);
            }
            else{
              console.log("Error is::"+error);
            }
        }
      );
    }
}

module.exports = gMapService;
