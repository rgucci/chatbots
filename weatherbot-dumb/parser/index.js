'use strict';

const colors = require('colors');
const dictionary = require('./dictionary');

let getFeel = temp => {
	if(temp < 5) {
		return "shivering cold";
	} else if(temp >= 5 && temp < 15) {
		return "pretty cold";
	} else if(temp >= 15 && temp < 25) {
		return "moderately cold";
	} else if(temp >= 25 && temp < 32) {
		return "quite warm";
	} else if(temp >= 32 && temp < 40) {
		return "very hot";
	} else {
		return "super hot";
	}
}

let getPrefix = (conditionCode, tense = 'present') => {
	let findPrefix = dictionary[tense].find(item => {
		if(item.codes.indexOf(conditionCode) > -1) {
			return true;
		}
	});

	return findPrefix.prefix || "";
}

let currentWeather = (location, response) => {
	if (response.icon) {
			let {icon, temperature} = response;
			return `Right now, ${getPrefix(icon)} ${icon.replace("-", " ").replace("-", " ").toLowerCase().red} in ${location.toUpperCase().green}. It is ${getFeel(Number(temperature))} at ${temperature.toString().red.bold} degrees.`;
	} else {
		return `Sorry, I can't get the weather for ${location.toUpperCase().red.bold}.`;
	}
}


let forecastWeather = (response, data) => {
	if(response.icon) {
		let regEx = new RegExp(data.weather, "i");
		let testConditions = regEx.test(response.icon); // true or false
		// return `${testConditions ? 'Yes' : 'No'}, ${getPrefix(getForecast.code, 'future')} ${getForecast.text.bold} ${data.time} in ${location}`;
		return `${testConditions ? 'Yes' : 'No'}, ${getPrefix(response.icon, 'future')} ${response.icon.toLowerCase().replace("-", " ").replace("-", " ").red.bold} in ${data.city.toUpperCase().trim().green} ${data.time}`;
	} else {
		return "I don't seem to know anything about this place...Sorry :(";
	}
}

module.exports = {
	currentWeather,
	forecastWeather
}
