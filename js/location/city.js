'use strict';

require('dotenv').config();
const client = require('../client');
const superagent = require('superagent');

function City(city, locationObj) {
  this.search_query = city;
  this.formatted_query = locationObj.display_name;
  this.latitude = locationObj.lat;
  this.longitude = locationObj.lon;
}

function handleLocation(request, response){
  let city = request.query.city;
  let sqlQuery = 'SELECT * FROM locations WHERE search_query=$1';
  let safeValues = [city];

  client.query(sqlQuery, safeValues)
    .then(sqlResults => {
      if(sqlResults.rowCount){
        response.send(sqlResults.rows[0]);
      } else {
        getAPIResults(city, response);
      }
    }).catch(err => console.error(err));
}

function getAPIResults(city, response){
  let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API}&q=${city}&format=json`;

  superagent.get(url)
    .then(result => {
      let geoData = result.body;
      let location = new City(city, geoData[0]);
      let insertSql = 'INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4);';
      let insertSafeValues = [location.search_query, location.formatted_query, location.latitude, location.longitude];

      client.query(insertSql, insertSafeValues);
      response.send(location);
    })
    .catch(error =>
      console.errer(error)
    );
}

module.exports = handleLocation;
