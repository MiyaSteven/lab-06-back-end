'use strict';

const express = require('express');
const app = express();
const superagent = require('superagent');
require('dotenv').config();

const pg = require('pg');
const cors = require('cors');
app.use(cors());
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));
<<<<<<< Updated upstream

app.get('/location', (request, response) => {
  let city = request.query.city;
  let SQL = 'SELECT * FROM locations WHERE search_query=$1;';
  let safeValues = [city];

  client.query(SQL, safeValues)
    .then(results => {
      if(results.rows.length > 0) {
        response.send(results.rows[0]);
      } else {
        let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API}&q=${city}&format=json`;

        superagent.get(url)
          .then(results => {
            let geoData = results.body;
            let location = new City(city, geoData[0]);
            let sql = 'INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4)';
            let safeValues = [location.search_query, location.formatted_query, location.latitude, location.longitude];

            client.query(sql, safeValues);
            response.status(200).send(location);
          });
      }
    });
});

// app.get('/display', (request, response) => {
//   let SQL = 'SELECT * FROM locations';
//   client.query(SQL)
//     .then(results => {
//       response.json(results.rows);
//     });
// });
=======

app.get('/add', (request, response) => {
  let first = request.query.first;
  let last = request.query.last;

  let SQL = 'INSERT INTO people (first_name, last_name) VALUES ($1, $2)';
  let safeValues = [first, last];

  client.query(SQL, safeValues);
});

app.get('/display', (request, response) => {
  let SQL = 'SELECT * FROM locations';

  client.query(SQL)
    .then(results => {
      response.json(results.rows);
    });
});

app.get('/location', (request, response) => {
  let city = request.query.city;
  let cityData = request.city.display_name;
  let latitude = request.city.latitude;
  let longitude = request.city.longitde;

  let SQL = 'INSERT INTO locations (city, city_data, latitude, longitude) VALUES ($1, $2, $3, $4)';
  let safeValues = [city, cityData, latitude, longitude];

  client.query(SQL, safeValues);
});
app.get('/display', (request, response) => {
  let SQL = 'SELECT * FROM locations';
  client.query(SQL)
    .then(results => {
      response.json(results.rows);
    });
});
>>>>>>> Stashed changes
// // .then(results => {
// let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API}&q=${city}&format=json`;
//   response.json(results.rows);
//   }).catch();
//   superagent.get(url)
//     .then(results => {
//       let newLocation = new City(city, results.body[0]);
//       response.send(newLocation);
//     });
// });

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

app.get('*', (request, response) => {
  response.status(404).send('Page not found');
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

client.connect()
  .then(
    app.listen(PORT, () =>
      console.log(`listening on ${PORT}`))
  );
