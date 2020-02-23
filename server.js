'use strict';

const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
app.use(cors());
const client = require('./js/client');

const PORT = process.env.PORT || 3003;
const handleLocation = require('./js/location/city');
// Calling client.connect without a callback yields a promise
// client
//   .connect()
//   .then(() => console.log('connected'))
//   .catch(err => console.error('connection error', err.stack));

// Calling client.connect with a callback
// const { Client } = require('pg')
// const client = new Client()
// client
//   .connect()
//   .then(() => console.log('connected'))
//   .catch(err => console.error('connection error', err.stack))

//how are the requests and responses passed here?
app.get('/location', (request, response) => {
  handleLocation(request, response);
});

// app.get('/weather', (request, response) => {
//   try {
//     let locationObject = request.query;
//     let url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API}/${locationObject.latitude},${locationObject.longitude}`;

//     superagent.get(url)
//       .then(results => {
//         let weatherObj = results.body.daily.data;
//         let weatherMap = weatherObj.map(day => new Weather(day));
//         response.status(200).send(weatherMap);
//       });
//   } catch (error) {
//     response.status(500).send('Error 500');
//   }
// });

// app.get('/trails', (request, response) => {
//   let {latitude, longitude,} = request.query;
//   let url = `https://www.hikingproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxDistance=10&key=${process.env.HIKING_API}`;

//   superagent.get(url)
//     .then(results => {
//       let dataObj = results.body.trails.map(trail => new Trail(trail));
//       response.status(200).send(dataObj);
//     });
// });

////////////////////////////////////WEATHER////////////////////////////////

// app.get('/weather', (request, response) => {
//   let weatherArr = [];
//   try{
//     let newWeather = request.query.data;
//     let weatherData = require('./data/darksky.json');

//     for(let i = 0; i < weatherData.daily.data.length; i++){
//       let weather = new Weather(weatherData, i);
//       weatherArr.push(weather);
//     }
//     response.send(weatherArr);
//   }
//   catch(err){
//     response.status(500).send(err);
//   }
// });

// function Weather(obj){
//   this.summary = obj.summary;
//   this.time = new Date(obj.time * 1000).toDateString();
// }

// function Trail(obj){
//   this.name = obj.name;
//   this.location = obj.location;
//   this.length = obj.length;
//   this.stars = obj.stars;
//   this.star_votes = obj.starVotes;
//   this.summary = obj.summary;
//   this.trail_url = obj.url;
//   this.conditions = obj.conditionStatus;
//   this.condition_date = obj.conditionDate.slice(0,10);
//   this.condition_time = obj.conditionDate.slice(11,19);
// }

// app.get('*', (request, response) => {
//   response.status(404).send('404 error!!!!');
// });

// app.get('*', (request, response) => {
//   response.status(500).send('500 error!!!!');
// });

client.connect().then(() => {
  app.listen(PORT, () => console.log(`listening on ${PORT}`));
});

