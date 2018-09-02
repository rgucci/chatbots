'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const FBeamer = require('./fbeamer');
// Vanilla
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
      // console.log(data);
      if(data.type === 'text') {
        switch(data.content.intent) {
          case 'greeting':
            f.txt(data.sender, `Hello to you too!`);
            break;
          case 'weather':
            f.txt(data.sender, 'I am smart and looking out the window...');
            weather(data.content.location, 'current')
              .then(response => {
                let parseResult = currentWeather(data.content.location, response);
                f.txt(data.sender, parseResult);
              })
              .catch(error => {
                f.txt(data.sender, `Sorry, I can't get the weather for ${data.content.location.toUpperCase()}.`);
              });
            break;
          default: {
            f.txt(data.sender, "I don't know what you mean :(");
          }
        }
      }
    } catch(e) {
      console.log(e);
    }
  });
});
server.listen(PORT, () => console.log(`FBeamer Bot Service running on Port ${PORT}`));
