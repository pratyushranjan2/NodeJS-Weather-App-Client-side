console.log('Client side js file is loaded');

const getWeather = (address='', callback) => {
    fetch('/weather?address='+address).then((response)=>{
    response.json().then((data)=>{
        if (data.error) {
            return callback(data.error);
        }
        callback(undefined,data);
    });
});
}

const weatherForm = document.querySelector('form');
const useCurrentLocationButton = document.querySelector('#use-current-location');
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

useCurrentLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Browser not supported for geolocation.');
    }
    useCurrentLocationButton.setAttribute('disabled','disabled');

    navigator.geolocation.getCurrentPosition(({coords}) => {
        fetch(`/weather?latitude=${coords.latitude}&longitude=${coords.longitude}`).then((response) => {
            response.json().then((data) => {
                if (data.error) {
                    return console.log('failed to get location');
                }
                console.log(data);
                msg1.textContent = data.address;
                msg2.textContent = data.data;
                useCurrentLocationButton.removeAttribute('disabled');
            });
        });
    });
});