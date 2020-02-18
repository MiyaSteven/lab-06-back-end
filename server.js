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

function handleErrors(){
  app.listen(PORT, () => {
  });
}


function getWeather(){
  app.get('/weather', (request, response) => {
    let weatherData = require('./data/darksky.json');
    for (let i = 0; i < weatherData.daily.data.length; i++){
      let weather = new Weather(weatherData, i);
      weatherArr.push(weather);
    }
    response.send(weatherArr);
  });
}
getWeather();

function Weather(obj, index){
  this.summary = obj.daily.data[index].summary;
  let date = new Date(obj.daily.data[index].time);
  this.time = date.toDateString();
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
