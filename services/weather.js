const request = require("request");
const http = require("http");
var configs = require("../config.js");

var weatherService = {


  getWeatherData:function(lat, lng, callback){

    var url = `${configs.openweather.URL}?lat=${lat}&lon=${lng}&units=imperial&APPID=${configs.openweather.API_KEY}`;
    http.get(url, (resp) => {
      var data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });
      resp.on('end', () => {
        console.log("Data new is::"+data);
        callback(data);
      });
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  }
};

module.exports = weatherService;
