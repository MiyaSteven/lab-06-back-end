'use strict';

const express = require('express');
const app = express();

require('dotenv').config();

const cors = require('cors');
app.use(cors());

app.get('/location', (request, response) => {
  let city = request.query.city;
  let geoData = require('./data/geo.json');

  let location = new City(city, geoData[0]);
  response.send(location);
});

function City(city, obj){
  this.search_query = city;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

////////////////////////////////////WEATHER////////////////////////////////
let weatherArr = [];
app.get('/weather', (request, response) => {
  try{
  let newWeather = request.query.data;
  let weatherData = require('./data/darksky.json');
  let weatherMap = weatherData.daily.data.map((obj) => (new Weather(weatherData, i)))

  response.send(weatherMap);
  }
  catch(err){
    response.status(500).send(err)
  }
});
  console.log(weatherArr)
function Weather(obj, index){
  let date = new Date(obj.daily.data[index].time)
  this.forecast = obj.daily.data[index].summary;
  this.time = date.toDateString();
}
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
