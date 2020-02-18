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
  this.search_querty = city;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
