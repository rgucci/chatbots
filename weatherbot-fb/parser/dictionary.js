let present = [{
	codes: ["rain", "snow", "sleet", "wind", "fog", "hail"],
	prefix: "there is"
}, {
	codes: ["clear-day", "clear-night", "partly-cloudy-day", "partly-cloudy-night", "thunderstorm", "tornado"],
	prefix: "it is a"
}, {
	codes: ["cloudy"],
	prefix: "it is"
}];

let future = [{
	codes: ["rain", "snow", "sleet", "wind", "fog", "hail"],
	prefix: "there will be"
}, {
	codes: ["clear-day", "clear-night", "partly-cloudy-day", "partly-cloudy-night", "thunderstorm", "tornado"],
	prefix: "it will be a"
}, {
	codes: ["cloudy"],
	prefix: "it will be"
}];

module.exports = {
	present,
	future
}
