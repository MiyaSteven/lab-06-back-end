'use strict';
const express = require('express');
const app = express();
const superagent = require('superagent');
require('dotenv').config();

const cors = require('cors');
app.use(cors());

app.get('/location', (request, response) => {
  try {
    let city = request.query.city;
    let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API}&q=${city}&format=json`;

    superagent.get(url)
      .then(results => {
        let newLocation = new City(city, results.body[0]);
        response.send(newLocation);
      });
  } catch (error) {
    response.status(500).send('Error 500');
  }
});

app.get('/weather', (request, response) => {
  try {
    let locationObject = request.query;
    let url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API}/${locationObject.latitude},${locationObject.longitude}`;

    superagent.get(url)
      .then(results => {
        let weatherObj = results.body.daily.data;
        let weatherMap = weatherObj.map(day => new Weather(day));
        response.status(200).send(weatherMap);
      });
  } catch (error) {
    response.status(500).send('Error 500');
  }
});

app.get('/trails', (request, response) => {
  let {latitude, longitude,} = request.query;
  let url = `https://www.hikingproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxDistance=10&key=${process.env.HIKING_API}`;

  superagent.get(url)
    .then(results => {
      let dataObj = results.body.trails.map(trail => new Trail(trail));
      response.status(200).send(dataObj);
    });
});

function City(city, obj){
  this.search_query = city;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

function Weather(obj){
  this.summary = obj.summary;
  this.time = new Date(obj.time * 1000).toDateString();
}

function Trail(obj){
  this.name = obj.name;
  this.location = obj.location;
  this.length = obj.length;
  this.stars = obj.stars;
  this.star_votes = obj.starVotes;
  this.summary = obj.summary;
  this.trail_url = obj.url;
  this.conditions = obj.conditionStatus;
  this.condition_date = obj.conditionDate.slice(0,10);
  this.condition_time = obj.conditionDate.slice(11,19);
}




const PORT = process.env.PORT || 3001;

// app.get('*', (request, response) => {
//   response.status(404).send('404 error!!!!');
// });

// app.get('*', (request, response) => {
//   response.status(500).send('500 error!!!!');
// });

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

