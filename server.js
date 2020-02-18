'use strict';

const express = require('express');
const app = express();

require('dotenv').config();

const cors = require('cors');
app.use(cors());

app.get('/', (request, response) => {

}) 

// app.get('/location', (req, res) => {
//   let city = req.query.city;
//   let location = new City;

// });

// function City(){

// }

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
