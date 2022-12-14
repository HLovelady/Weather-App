var cities = [];
//creating variables for ID elements from the dom (html)
var cityFormEl=document.querySelector("#city-search-form");
var cityInputEl=document.querySelector("#city");
var weatherContainerEl=document.querySelector("#current-weather-container");
var citySearchInputEl = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var forecastContainerEl = document.querySelector("#fiveday-container");
var pastSearchButtonEl = document.querySelector("#past-search-buttons");

//creating variable = to a function
var formSubmitHandler = function(event){
    //if event is not handled this will prevent default
    //https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault 
    event.preventDefault();
    //setting variable city and giving value of what is entered in search field
    var city = cityInputEl.value.trim();
    //if a city has a value (is true)
    if(city){
        //(city is local variable)
        getCityWeather(city);
        get5Day(city);
        cities.unshift({city});
        //Emptying value once search is complete  
        cityInputEl.value = "";
    } else{
        alert("Please enter a City");
    }
    saveSearch();
    pastSearch(city);
}

var saveSearch = function(){
    //taking array of cities and turning into JSON Value
    //Gets value by taking the key and giving the appropriate value
    //JSON used when sending data from server to client
    localStorage.setItem("cities", JSON.stringify(cities));
};

//Query
var getCityWeather = function(city){

    var apiKey = "ca96d6bcdba4620051bc4a7c8dae219e"
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    //Fetch = requesting data from API
    fetch(apiURL)
    //Response (promise)
    .then(function(response){
        response.json().then(function(data){
            //run displayWeather with data and city
            displayWeather(data, city);
        });
    });
};

var displayWeather = function(weather, searchCity){
   //clear old content
   weatherContainerEl.textContent= "";  
   citySearchInputEl.textContent=searchCity;

   //console.log(weather);

   //create date element
   var currentDate = document.createElement("span")
   currentDate.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
   citySearchInputEl.appendChild(currentDate);

   //create an image element
   var weatherIcon = document.createElement("img")
   weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
   citySearchInputEl.appendChild(weatherIcon);

   //create a span element to hold temperature data
   var temperatureEl = document.createElement("span");
   temperatureEl.textContent = "Temperature: " + weather.main.temp + " ??F";
   temperatureEl.classList = "list-group-item"
  
   //create a span element to hold Humidity data
   var humidityEl = document.createElement("span");
   humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
   humidityEl.classList = "list-group-item"

   //create a span element to hold Wind data
   var windSpeedEl = document.createElement("span");
   windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
   windSpeedEl.classList = "list-group-item"

   //append to container
   weatherContainerEl.appendChild(temperatureEl);

   //append to container
   weatherContainerEl.appendChild(humidityEl);

   //append to container
   weatherContainerEl.appendChild(windSpeedEl);

}


var get5Day = function(city){
    var apiKey = "ca96d6bcdba4620051bc4a7c8dae219e"
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           display5Day(data);
        });
    });
};

var display5Day = function(weather){
    forecastContainerEl.textContent = ""
    forecastTitle.textContent = "5-Day Forecast:";

    var forecast = weather.list;
        for(var i=5; i < forecast.length; i=i+8){
       var dailyForecast = forecast[i];
        
       
       var forecastEl=document.createElement("div");
       forecastEl.classList = "card bg-primary text-light m-2";

       //console.log(dailyForecast)

       //create date element
       var forecastDate = document.createElement("h5")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
       forecastDate.classList = "card-header text-center"
       forecastEl.appendChild(forecastDate);

       
       //create an image element
       var weatherIcon = document.createElement("img")
       weatherIcon.classList = "card-body text-center";
       weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  
        forecastEl.appendChild(weatherIcon);
       
       //create temperature span
       var forecastTempEl=document.createElement("span");
       forecastTempEl.classList = "card-body text-center";
       forecastTempEl.textContent = dailyForecast.main.temp + " ??F";
        forecastEl.appendChild(forecastTempEl);

       var forecastHumEl=document.createElement("span");
       forecastHumEl.classList = "card-body text-center";
       forecastHumEl.textContent = dailyForecast.main.humidity + "  %";
       forecastEl.appendChild(forecastHumEl);
        forecastContainerEl.appendChild(forecastEl);

        var futureWindEl=document.createElement("span");
        futureWindEl.classList = "card-body";
        futureWindEl.textContent = "Wind Speed: " + dailyForecast.wind.speed + " MPH";
        forecastEl.appendChild(futureWindEl);
    }

}

var pastSearch = function(pastSearch){
 
    // console.log(pastSearch)

    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
    pastSearchEl.setAttribute("data-city",pastSearch)
    pastSearchEl.setAttribute("type", "submit");

    pastSearchButtonEl.prepend(pastSearchEl);
}


var pastSearchHandler = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        getCityWeather(city);
        get5Day(city);
    }
}

// pastSearch();
//Run formSubmitHandler function upon submitting, the event call back
cityFormEl.addEventListener("submit", formSubmitHandler);
pastSearchButtonEl.addEventListener("click", pastSearchHandler);