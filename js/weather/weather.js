'use strict';

require('dotenv').config();
const superagent = require('superagent');

function Weather(weatherObj){
  this.forecast = weatherObj.summary;
  this.time = new Date(weatherObj.time * 1000).toDateString();
}

function handleWeather(request, response){
  let lat = request.query.latitude;
  let long = request.query.longitude;
  let url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API}/${lat},${long}`;

  superagent.get(url)
    .then(result => {
      let weatherObj = result.body.daily.data;
      let forecast = weatherObj.map(day => new Weather(day));
      response.status(200).send(forecast);
    }).catch(error => console.error(error));
}

module.exports = handleWeather;
