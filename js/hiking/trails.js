'use strict';

require('dotenv').config();
const superagent = require('superagent');

function Trail(trailObj){
  this.name = trailObj.name;
  this.location = trailObj.location;
  this.length = trailObj.length;
  this.stars = trailObj.stars;
  this.star_votes = trailObj.starVotes;
  this.summary = trailObj.summary;
  this.trail_url = trailObj.url;
  this.conditions = trailObj.conditionStatus;
  this.condition_date = trailObj.conditionDate.slice(0,10);
  this.condition_time = trailObj.conditionDate.slice(11,19);
}

function handleTrails(request, response){
  let lat = request.query.latitude;
  let long = request.query.longitude;
  let url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${long}&maxDistance=10&key=${process.env.HIKING_API}`;

  superagent.get(url)
    .then(result => {
      let trailsArray = result.body.trails.map(trailData => new Trail(trailData));
      response.send(trailsArray);
    }).catch(error => console.error(error));
}

module.exports = handleTrails;
