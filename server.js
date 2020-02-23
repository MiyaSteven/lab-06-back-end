'use strict';

const express = require('express');
const app = express();

require('dotenv').config();

const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3003;

const client = require('./js/client');
const handleYelp = require('./js/food/yelp');
const handleTrails = require('./js/hiking/trails');
const handleLocation = require('./js/location/city');
// const handleMovies = require('./js/recreation/movies');
const handleWeather = require('./js/weather/weather');

app.get('/yelp', (request, response) => {
  handleYelp(request, response);
});

app.get('/trails', (request, response) => {
  handleTrails(request, response);
});

app.get('/city', (request, response) => {
  handleLocation(request, response);
});

// app.get('/movies', (request, response) => {
//   handleMovies(request, response);
// });

app.get('/weather', (request, response) => {
  handleWeather(request, response);
});

// app.get('*', (request, response) => {
//   response.status(404).send('404 error!!!!');
// });

// app.get('*', (request, response) => {
//   response.status(500).send('500 error!!!!');
// });

client.connect().then(() => {
  app.listen(PORT, () => console.log(`listening on ${PORT}`));
});

