'use strict';

const express = require('express');
const app = express();
const superagent = require('superagent');
const pg = require('pg')
require('dotenv').config();

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));

const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3001;
client.connect()
.then(()=>{
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
});

app.get('/add', (request, response)=>{
  let city = request.query.city;

});

//////////////////////////////////////LOCATION/////////////////////////////////////////////////

app.get('/location', (request, response) => {
  let city = request.query.city;
  let SQL = 'SELECT * FROM locations WHERE search_query=($1)';
  let safeValues = [city];
  client.query(SQL, safeValues).then(data =>{
    if(data.rowCount){
      response.send(data.rows[0]);
      console.log('city in DB');
    }else{
      let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API}&q=${city}&format=json`;

    superagent.get(url)
      .then(results => {
        let geoData = results.body;
        let location = new City(city, geoData[0]);
        let insertSql = 'INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4)';
        let insertSafeValue = [location.search_query, location.formatted_query, location.latitude, location.longitude];
        client.query(insertSql, insertSafeValue);
        response.status(200).send(location);
        console.log('city not in DB, going to API');
      })
      .catch(err=>{
        console.error(err)
        response.status(500).send(err)
        });

    }
  })

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


////////////////////////////////////////// HIKING /////////////////////////////////


app.get('/trails',(request, response)=>{
  let {latitude, longitude} = request.query;
  let url = `https://www.hikingproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxResults=10&key=${process.env.TRAILS_API}`;
  superagent.get(url)
    .then(results =>{
      let hikingResults = results.body.trails.map((obj)=> new Hiking(obj));
      response.send(hikingResults)

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