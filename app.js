const express = require('express');

var app = express();
var directions = require('./routes/directions');
var cities = require('./routes/cities');
var weather = require('./routes/weather');
var configs = require('./config.js');

app.use(express.static(__dirname + '/public'));
app.use('/directions',directions);
app.use('/cities',cities);
app.use('/weather',weather);

app.listen(configs.server.PORT, () => {
    console.log("Am all ears now!!");
});
