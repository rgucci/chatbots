const express = require('express')
var bodyParser = require('body-parser');
const app = express()
const port = process.env.PORT || 3000;

const weather = require('./weather');
const {currentWeather, forecastWeather} = require('./parser');

app.use(bodyParser.json());

//This is the json response the dialog.io expects
let jsonResponse = (text, message) => {
  return {
    "fulfillmentText": text,
    "fulfillmentMessages": [
      {
        "text": {"text": [message]}
      }
    ],
  "source": ""
  }
}

app.get('/', (req, res) => res.send('Hello World!'))
app.post('/weather/forecast', (req, res) => {
  console.log('Incoming request:')
  // console.log(req.body)
  const queryResult = req.body.queryResult
  //console.log(queryResult)

  const parameters = queryResult.parameters
  const city = parameters['geo-city']

  if (!city) {
    res.send(jsonResponse("City not recognized", "I'm not sure. Where is that?"))
  } else {
    weather(city, 'current')
    .then(response => {
      let result = currentWeather(city, response);
      res.send(jsonResponse('Weather for ${city}', result))
    })
    .catch(error => {
      res.send(error)
    });
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
