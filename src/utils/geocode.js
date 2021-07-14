const request = require('request');

const geocode = (address,callback) => {
    const url = "https://api.mapbox.com/geocoding/v5/mapbox.places/"+encodeURIComponent(address)+".json?access_token=pk.eyJ1IjoicHJhdHl1c2gwMiIsImEiOiJja3BpZ3A0amkwMjByMm5xcjVmNjJoZWIxIn0.q5_sBqlqCznAdrBpN_ol-Q&limit=1";
    request({url, json: true}, (error, {body}) => {
        if (error) {
            callback('Could not connect to location services', undefined);
        }
        else if (body.features && body.features.length == 0) {
            callback('No matching results for the location');
        }
        else if (body.message) {
            callback(body.message);
        }
        else {
            callback(undefined,
                {latitude: body.features[0].center[1], 
                longitude: body.features[0].center[0],
                location: body.features[0].place_name});
        }
    });
}

const reverseGeocode = (latitude, longitude, callback) => {
    const uri = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=pk.eyJ1IjoicHJhdHl1c2gwMiIsImEiOiJja3BpZ3A0amkwMjByMm5xcjVmNjJoZWIxIn0.q5_sBqlqCznAdrBpN_ol-Q`;
    request({uri, json:true}, (error, {body}) => {
        if (error) {
            callback('Could not determine address');
        }
        else if (body.features && body.features.length == 0) {
            callback('No address found');
        }
        else if (body.message) {
            callback('Coordinates invalid');
        }
        else {
            callback(undefined, body.features[0].place_name);
        }
    })
}

module.exports = {geocode, reverseGeocode};