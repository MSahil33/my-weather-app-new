const apikey = '967e52f058203558e6ea5add5a4e374f';

//getting the message box to display error and pending message
const msg_box = document.querySelector('.msg-box');


//getting weather for searched location
const fetchDataByCity = async (cityName)=>{
    msg_box.innerHTML=`Getting '${cityName}' city weather`;
    msg_box.classList.add('pending','active');

    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apikey}`);
    let data = await response.json();
    // console.log(data)
    getweatherData(data);
}


//getting weather for current location
const fetchDataByCoords = async (lat,lon) =>{
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apikey}`);
    let data = await response.json();
    // console.log(data)
    getweatherData(data);

}
const current_location_weather = document.querySelector('.current-location-weather');



// Function to get the weather by city name
const getweatherData = (data)=>{

    if(data.cod === "404"){
        msg_box.innerHTML='City Not found';
        msg_box.classList.replace('pending','error');
        current_location_weather.classList.remove('weather-active');
    }
    else if(data.cod === "400"){
        msg_box.innerHTML='City Not found';
        msg_box.classList.replace('pending','error');
        current_location_weather.classList.remove('weather-active');

    }
    else{
        msg_box.classList.remove('active');
        current_location_weather.classList.add('weather-active');
        current_location_weather.focus();
        
        //creating a new date obj
        let dateObj = new Date();
        let day = dateObj.toLocaleDateString('en-us',{weekday:"long"});
        let date = dateObj.toLocaleDateString('en-us',{month:"short",year:"numeric"})
        let date_num = dateObj.getDate();
        
        const date_day = document.querySelector('.cur-day');
        date_day.innerHTML = `
            <h3 class="day">${day}</h3>
            <span class="date">${date_num} ${date}</span>
            `;

        const cur_location = document.querySelector('.cur-location');
        let city = data.name;
        let country = data.sys.country;
        cur_location.innerHTML=`
            <i class="fa-thin fa-location-dot map-icon">Ï</i>
            <span class="city-country-name">${city},${country}</span>
        `

        const other_weather_info = document.querySelector('.other-weather-info');
        let humid = data.main.humidity;
        let feelslike = data.main.feels_like;
        let wind_speed = data.wind.speed;
        other_weather_info.innerHTML = `
        <p>Humdity - ${humid}%</p>
        <p>Feels like - ${feelslike}°</p>
        <p>Wind Speed- ${wind_speed}km/h</p>
        `
        
        const cur_temp_right = document.querySelector('.cur-temp-right');
        
        let temp = Math.floor(data.main.temp);
        let clouds = data.weather[0].main;
        cur_temp_right.innerHTML = `
        <div class="weather-img">
        <img src="./Weather Icons/${clouds}.svg" alt="Weather-icon" id="weather-icon" class="cur-img">
            </div>
            <div class="cur-temp">
            <span>${temp}</span>°C
            </div>
            <span class="cur-weather-cond">${clouds}</span>
            `
    }
}


//Function after clickig search button
const searchBtn = document.querySelector('#serach-btn');
searchBtn.addEventListener('click',()=>{
    let city_name = document.getElementById('city-name');
    fetchDataByCity(city_name.value);
    city_name.value='';
});



//Function after clicking cur-weather-btn
const cur_weather = document.querySelector('#cur-weather-btn');
cur_weather.addEventListener('click',()=>{
    
    current_location_weather.classList.remove('weather-active');

    //Getting the coordinates of the user
    msg_box.innerHTML = `Getting current location weather`
    msg_box.classList.add('active','pending');
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(myPositions);
    }else{
        msg_box.innerHTML=`Your browser doesn't support this feature`;
        msg_box.classList.replace('pending','error')
    }
})

//functions to get the latitude and longitude of current location
const myPositions = (position)=>{
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    // console.log(lat)
    // console.log(lon)
    msg_box.classList.remove('active')
    fetchDataByCoords(lat,lon);
}