console.log('Client side js file is loaded');

const getWeather = (address='', callback) => {
    fetch('http://localhost:3000/weather?address='+address).then((response)=>{
    response.json().then((data)=>{
        if (data.error) {
            return callback(data.error);
        }
        callback(undefined,data);
    });
});
}

const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const msg1 = document.querySelector('#msg-1');
const msg2 = document.querySelector('#msg-2'); // for selecting by class
                                               // use '.<classname>'

weatherForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const location = search.value;

    msg1.textContent = 'Loading . . .';
    msg2.textContent = '';
    
    getWeather(location, (error,{data,location,address}={}) => {
        if (error) {
            msg1.textContent = error;
            return console.log(error);
        }
        msg1.textContent = location;
        msg2.textContent = data;
        console.log('Data: '+data);
        console.log('Location: '+location);
        console.log('Address: '+address);
    });
});