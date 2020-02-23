'use strict';

require('dotenv').config();
const superagent = require('superagent');

function Food(foodObj){
  this.name = foodObj.name;
  this.image_url = foodObj.image_url;
  this.price = foodObj.price;
  this.rating = foodObj.rating;
  this.url = foodObj.url;
}

function handleFood(request, response){
  let location = request.query.location;
  let url = `https://api.yelp.com/v3/businesses/search?location=${location}`;

  superagent.get(url)
    .set('Authorization', `Bearer ${process.env.YELP_API}`)
    .then(result => {
      let foodArray = result.body.businesses.map(businessResults => new Food(businessResults));
      response.send(foodArray);
    }).catch(error => console.error(error));
}

module.exports = handleFood;
