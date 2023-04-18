//Variables and API Key
var searchedCities = [];
var currentWeatherContainerEl=document.querySelector("#current-weather-container");
var citySearchedInputEl = document.querySelector("#searched-city");
var forecastContainerEl = document.querySelector("#forecast-container");
var forecastTitle = document.querySelector("#forecast");
var searchHistoryEl;
var searchHistoryButtonEl = document.querySelector("#search-history-button");
var APIKey = "61575cadc8adff6b8ca0fdec73b15a2d";

//City User Search
$("#submit").click(function(event){
    event.preventDefault();
    var city = $("#searchBar").val();
    if (city){
        currentCityWeather(city);
        searchedCities.unshift({city});
        searchHistory(city);
    }
    else{
        alert("Please Enter City Name");
}
searchSave();
});

//Search Save Buttons
var searchSave = function(){
    localStorage.setItem("searchedCities",JSON.stringify(searchedCities));
};

var searchHistory = function(searchHistory){
    searchHistoryEl = document.createElement("button");
    searchHistoryEl.textContent = searchHistory;
    searchHistoryEl.classList = "d-flex w-100 justify-content-center border btn-light rounded p-2 mb-3 mt-3"
    searchHistoryEl.setAttribute("data-city", searchHistory)
    searchHistoryEl.setAttribute("type","submit");
    searchHistoryButtonEl.prepend(searchHistoryEl);
};

var searchHistoryHandler = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        currentCityWeather(city);
    }
};
searchHistoryButtonEl.addEventListener("click",searchHistoryHandler);

//Current Weather API Function
var currentCityWeather = function(city){
var queryCurrentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKey}`;
fetch(queryCurrentWeatherURL)
.then(function(response){
    response.json().then(function(data){
        displayCurrentWeather(data,city);
        });
    });
};

//Displaying Weather in Current City
var displayCurrentWeather =function(weather,searchedCity){
    currentWeatherContainerEl.textContent="";
    citySearchedInputEl.textContent=searchedCity;
    var currentDate = document.createElement("SPAN");
    currentDate.textContent=" (" + moment(weather.dt.value).format('L')+ ") ";
    citySearchedInputEl.appendChild(currentDate);
    
    //Elements for Weather, Temp, Wind, and Humidity
    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`);
    citySearchedInputEl.appendChild(weatherIcon);
    var temperatureEl = document.createElement("SPAN");
    temperatureEl.textContent = "Temp: " + weather.main.temp + " °F";
    currentWeatherContainerEl.appendChild(temperatureEl);
    var windSpeedEl = document.createElement("SPAN");
    windSpeedEl.textContent = "Wind: " + weather.wind.speed + " MPH";
    currentWeatherContainerEl.appendChild(windSpeedEl);
    var humidityEl = document.createElement("SPAN");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    currentWeatherContainerEl.appendChild(humidityEl);
    //Coordinates for API Call
    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    getLatLon(lat,lon)
};

//5-Day Outlook API Call
var getLatLon = function(lat,lon){
    var apiFiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKey}`
    fetch(apiFiveDayURL)
    .then(function(response){
        response.json().then(function(data){
            displayFiveDayForecast(data);
        })
    })
};

//Outlook Display Boxes
var displayFiveDayForecast =function(weather){
    forecastContainerEl.textContent="";
    forecastTitle.textContent= "5-Day Forecast:";
    var forecast = weather.list;

    for(var i=5; i< forecast.length; i=i+8){
        var dailyForecast = forecast[i];
        var forecastEl=document.createElement("div");
        forecastEl.classList = "card justify-content-center bg-info text-light m-2"

        var forecastTempEl=document.createElement("SPAN");
        forecastTempEl.classList = "card-body text-left h6";
        forecastTempEl.textContent = "Temp: " + dailyForecast.main.temp + " °F";
        forecastEl.appendChild(forecastTempEl);
        var forecastWindEl=document.createElement("SPAN");
        forecastWindEl.classList="card-body text-left h6";
        forecastWindEl.textContent = "Wind: "+dailyForecast.wind.speed + " mph";
        forecastEl.appendChild(forecastWindEl);
        var forecastHumidityEl=document.createElement("SPAN");
        forecastHumidityEl.classList="card-body text-left h6";
        forecastHumidityEl.textContent = "Humidity: "+dailyForecast.main.humidity + " %";
        forecastEl.appendChild(forecastHumidityEl);
        var forecastDate = document.createElement("h5")
        forecastDate.textContent= moment.unix(dailyForecast.dt).format('L');
        forecastDate.classList = "card-header m-2"
        forecastEl.appendChild(forecastDate);

        var weatherIcon = document.createElement("img")
        weatherIcon.classList = "card-body";
        weatherIcon.setAttribute("src",`https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);
        forecastEl.appendChild(weatherIcon);
        forecastContainerEl.appendChild(forecastEl);
    };
};