// repo service to talk to the database, it would be ideal to create models for each collection


const mongoose = require("mongoose");
var configs = require('../config.js');

var repository = {
  insertRoute: function(source, dest, responseJson){
    mongoose.connect(configs.db.URL, { useNewUrlParser: true },function(err,db){
      if(err){
        return console.log(err);
      }
      console.log("Saving route to db");
      var collection = db.collection('routes');
      var doc = {
        origin:source,
        destination:dest,
        response:responseJson
      }
      collection.insertOne(doc);
    });
  },
  insertWeather: function(lat, lon, weatherResponse){

    mongoose.connect(configs.db.URL, { useNewUrlParser: true },function(err,db){
      if(err){
        return console.log(err);
      }
      console.log("Saving weather to db");
      try{
        var collection = db.collection('weathers');
        var doc = {
          lat:lat,
          lon:lon,
          weather:weatherResponse
        }
        collection.insertOne(doc);
      }
      catch(e){
        console.log("error during inserting weather::"+e);
      }

    });
  },
  findRoute: function(source, dest, callback){
        mongoose.connect(configs.db.URL, { useNewUrlParser: true },function(err,db){
            var collection = db.collection('routes');
            collection.findOne({origin:source,destination:dest},function(err,doc){
              callback(doc);
            });
        });
  },
  findWeather: function(latitude, longitude, callback){
        mongoose.connect(configs.db.URL, { useNewUrlParser: true },function(err,db){
            var collection = db.collection('weathers');
            collection.findOne({lat:latitude,lon:longitude},function(err,doc){
              callback(doc);
            });
        });
  }
}

module.exports = repository;
