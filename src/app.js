const path = require('path');
const express = require('express');
// express is a function only
const app = express();
const port = process.env.PORT || 3000; // || if in local then 3000, if on heroku then through env.PORT
const hbs = require('hbs');

const {geocode, reverseGeocode} = require('./utils/geocode');
const forecast = require('./utils/forecast');
// app.com
// app.com/help
// app.com/about

// console.log(__dirname);
// console.log(path.join(__dirname,'../public'));

// Define paths for express config
const viewsPath = path.join(__dirname,'../templates/views');
const publicDirPath = path.join(__dirname,'../public');
const partialsPath = path.join(__dirname,'../templates/partials');

// Set up handlebar engine and views location
app.set('view engine','hbs');
app.set('views',viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirPath));

app.get('', (req,res)=> {
    res.render('index',{
        title: 'WEATHER',
        name: 'Pratyush Ranjan'
    });
});

app.get('/about', (req,res)=> {
    res.render('about',{
        title: 'About me',
        name: 'Pratyush Ranjan'
    });
});

app.get('/help', (req,res)=> {
    res.render('help',{
        title: 'HELP',
        message: 'Get help here',
        name: 'Pratyush Ranjan'
    });
});
// app.get('',(req,res)=>{
//     res.send('<h1>WEATHER</h1>')
// }); no longer serves any purpose

// app.get('/help',(req,res)=> {
//     res.send({
//         name: 'Pratyush',
//         age: 21
//     })
// });

// app.get('/about',(req,res)=>{
//     res.send('<h1>ABOUT</h1>');
// });

app.get('/weather',(req,res)=>{
    if (req.query.latitude && req.query.longitude) {
        reverseGeocode(req.query.latitude, req.query.longitude, (error, address) => {
            if (error) {
                return res.send({error});
            }
            forecast(req.query.latitude, req.query.longitude, (error,data) => {
                if (error) {
                    return res.send({error});
                }
                return res.send({address, data});
                //console.log(data);
            });
        })
    }
    else {
        if (!req.query.address) {
            return res.send({
                error: 'Provide an address'
            });
        }
        const address = req.query.address;
        geocode(address, (error,{latitude,longitude,location}={})=>{
            if (error) {
                return res.send({
                    error
                });
            }
            forecast(latitude, longitude, (error,data)=>{
                if (error) {
                    return res.send({
                        error
                    });
                }
                res.send({
                    data,
                    location,
                    address
                });
            });
        });
    }
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        });
    }
    console.log(req.query);
    res.send({
        products: []
    });
});
app.get('/help/*', (req,res) => {
    res.render('error',{
        message: 'Help article not found',
        name: 'Pratyush Ranjan',
        title: 'Error'
    });
});

// match anything that didnt get a match
// * means everything is a match
app.get('*',(req,res)=> {
    res.render('error',{
        message: '404 Page Not Found',
        name: 'Pratyush Ranjan',
        title: 'Error'
    });
});
// start the server up
app.listen(port, ()=> {
    console.log('Server is up on port '+port);
});