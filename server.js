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
        let geoData = results.body;
        let newLocation = new City(city, geoData[0]);
        response.send(newLocation);
      });
  } catch (error) {
    response.status(500).send('Error 500');
  }
});

function City(city, obj){
  this.search_query = city;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

////////////////////////////////////WEATHER////////////////////////////////

// function getWeather(){
//   app.get('/weather', (request, response) => {
//     let {latitude, longitude,} = request.query;
//     let url = `https://api.darksky.net/forecast/${process.env.GEOCODE_API}/${latitude},${longitude}`;
//     superagent.get(url)
//       .then(results => {
//         let newWeather = new Weather(location, results);
//         let weatherArr = weatherArr.map(newWeather);
//         response.send(weatherArr);
//       });
//   });
// }
// getWeather();

// function Weather(obj, index){
//   this.summary = obj.daily.data[index].summary;
//   let date = new Date(obj.daily.data[index].time);
//   this.time = date.toDateString();
// }

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

