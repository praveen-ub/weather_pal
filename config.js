
var config = {
    gmap : {
      API_KEY: 'AIzaSyAQ4fdgmwd5tNsjI50ZqTIO0LURkXccxzc',
      PLACES_URL:'https://maps.googleapis.com/maps/api/place/autocomplete/json'
    },
    openweather:{
      URL:'http://api.openweathermap.org/data/2.5/weather',
      API_KEY:'1743eaa915e6c20c320d6cdb18e942b5'
    },
    server:{
      PORT: 5000
    },
    db:{
      URL:'mongodb://localhost:27017/weatherpal'
    }
}

module.exports = config;
