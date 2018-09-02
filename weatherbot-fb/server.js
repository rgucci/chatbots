'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const FBeamer = require('./fbeamer');
// Vanilla
const matcher = require('./matcher');
const weather = require('./weather');
const {currentWeather, forecastWeather} = require('./parser');

const server = express();
const PORT = process.env.PORT || 3000;
const f = new FBeamer(config.fb);

server.get('/', (req, res) => f.registerHook(req, res));
server.post('/', bodyParser.json({
  verify: f.verifySignature
}));
server.post('/', (req, res, next) => {
  // Messages will be received here if the signature goes through
  // we will pass the messages to FBeamer for parsing
  return f.incoming(req, res, data => {
    try {
      if(data.type === 'text') {
        matcher(data.content, async resp => {
          switch(resp.intent) {
            case 'Hello':
              await f.txt(data.sender, `${resp.entities.greeting} to you too!`);
              break;
            case 'CurrentWeather':
              await f.txt(data.sender, 'Looking out the window...');
              weather(resp.entities.city, 'current')
      					.then(response => {
      						let parseResult = currentWeather(resp.entities.city, response);
                  f.txt(data.sender, parseResult);
      					})
      					.catch(error => {
      						f.txt(data.sender, `Sorry, I can't get the weather for ${location.toUpperCase()}.`);
      					});
              break;
            case 'WeatherForecast':
              await f.txt(data.sender, 'Looking into my crystal ball...');
              weather(resp.entities.city, 'forecast', resp.entities.time)
      					.then(response => {
      						let parseResult = forecastWeather(response.daily.data[0], resp.entities);
                  f.txt(data.sender, parseResult);
      					})
      					.catch(error => {
      						f.txt(data.sender, "Sorry, not clear the future is.");
      						rl.prompt();
      					});
              break;
            case 'Exit':
              await f.txt(data.sender, "Have a nice day! :D");
              break;
            default: {
              await f.txt(data.sender, "I don't know what you mean :(");
            }
          }
        });
      }
    } catch(e) {
      console.log(e);
    }
  });
});
server.listen(PORT, () => console.log(`FBeamer Bot Service running on Port ${PORT}`));
