'use strict';

require('dotenv').config();
const client = require('../client');
const superagent = require('superagent');

function City(city, location) {
  this.search_query = city;
  this.formatted_query = location.display_name;
  this.latitude = location.lat;
  this.longitude = location.lon;
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
        response.send(location);
      }
    });
}

function getAPIResults(city, response){
  let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API}&q=${city}&format=json`;

  superagent.get(url)
    .then(result => {
      let geoData = result.body;
      let location = new City(city, geoData[0]);

      insertIntoDataBase(location);

    //   response.send(location);

    })
    .catch(error => {
      response.send(error).status(500);
    });
}

function insertIntoDataBase(location, response){
  let insertSql = 'INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4);';
  let insertSafeValues = [location.search_query, location.formatted_query, location.latitude, location.longitude];

  client.query(insertSql, insertSafeValues);
//   response.send(location);
}

module.exports = handleLocation;
