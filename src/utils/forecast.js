const request = require('request');

const forecast = (latitude, longitude, callback) => {
    const url = "http://api.weatherstack.com/current?access_key=22b04243b52026e0e222cbcf62092b55&query="+latitude+','+longitude;

    request({url, json: true}, (error, {body})=> {
        if (error) {
            callback('Unable to connect to weather service');
        }
        else if (body.error) {
            callback('Unable to get the weather data');
        }
        else {
            data = body.current.weather_descriptions[0]+
            '. The temperature is '+body.current.temperature+
            '. It feels like '+body.current.feelslike+
            '. The humidity is '+body.current.humidity+'%.';
            callback(undefined,data);
        }
    });
}

module.exports = forecast;