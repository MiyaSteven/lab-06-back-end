'use strict';

const express = require('express');
const app = express();
const superagent = require('superagent');
require('dotenv').config();

const cors = require('cors');
app.use(cors());




app.get('/location', (request, response) => {
  let city = request.query.city;
  let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API}&q=${city}&format=json`;

    superagent.get(url)
      .then(results => {
        let geoData = results.body;
        let location = new City(city, geoData[0]);
        response.status(200).send(location);
      })
      .catch(err=>{
        console.error(err)
        response.status(500).send(err)
        });

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
  console.log('this is request  query',request.query)
  let {latitude, longitude} = request.query;
  let url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API}/${latitude},${longitude}`;
  superagent.get(url)
    .then(results =>{
      let weatherResults = results.body.daily.data;
    let weatherMap = weatherResults.map((obj) => (new Weather(obj)))
    response.send(weatherMap);

    })
  
});

function Weather(obj){
  this.forecast = obj.summary;
  this.time = new Date(obj.time * 1000).toDateString();
}
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});


////////////////////////////////////////// HIKING /////////////////////////////////


app.get('/trails',(request, response)=>{
  let {latitude, longitude} = request.query;
  let url = `https://www.hikingproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxResults=10&key=${process.env.TRAILS_API}`;
  superagent.get(url)
    .then(results =>{
      let hikingResults = results.body.trails.map((obj)=> new Hiking(obj));
      response.send(hikingResults)
      // console.log('super agent trails body',request.query);
      // let trailsResults = results.body
    })
})

function Hiking(obj){
  this.name = obj.name;
  this.location = obj.location;
  this.length = obj.length;
  this.stars = obj.stars;
  this.star_votes = obj.star_votes;
  this.summary = obj.summary;
  this.trail_url = obj.url;
  this.conditions = obj.conditionStatus;
  let splitDateTime = obj.conditionDate.split(' ')
  this.condition_date = splitDateTime[0];
  this.condition_time = splitDateTime[1];
};