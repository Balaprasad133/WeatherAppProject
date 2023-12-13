import React, { useEffect, useState } from "react";
import "./WeatherApp.css";

function WeatherApp() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [favoriteTemps, setFavoriteTemps] = useState([]);

  const apiKey = "f0f83a216238f54f551d8b0919c1c92e";

  // Search function
  const buttonSearch = async () => {
    try {
      // Current weather data
      const currentWeatherResponse = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      if (!currentWeatherResponse.ok) {
        throw new Error("City not Found");
      }
      const currentWeatherData = await currentWeatherResponse.json();
      setWeatherData(currentWeatherData);

      // Forecast data
      const forecastResponse = await fetch(
        `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      if (!forecastResponse.ok) {
        throw new Error("Forecast not available");
      }
      const forecastData = await forecastResponse.json();

      // forecast data for the next few hours
      const dayForecast = forecastData.list.filter((item) => {
        const forecastTimestamp = new Date(item.dt_txt).getTime();
        const currentTimestamp = new Date().getTime();
        return (
          forecastTimestamp > currentTimestamp &&
          forecastTimestamp <= currentTimestamp + 1 * 24 * 60 * 60 * 1000 //we can change the time period of forecast
        );
      });
      setForecastData(dayForecast);
    } catch (error) {
      console.error("Error:", error.message);
      alert("City not Found,Please check the city name");
      setWeatherData(null);
      setForecastData(null);
    }
  };

  // Function to add items to favorites
  const addToFavorites = () => {
    if (weatherData) {
      setFavoriteTemps((prevFavorites) => [...prevFavorites, weatherData]);
      alert("Added to favorites");
    }
  };

  // Remove items
  const removeFromFavorites = (index) => {
    const newFavorites = [...favoriteTemps];
    newFavorites.splice(index, 1);
    setFavoriteTemps(newFavorites);
    alert("Deleted Successfully..!");
  };

  // Store the items in local storage
  useEffect(() => {
    // Load favorite temperatures from local storage on component mount
    const storedFavorites =
      JSON.parse(localStorage.getItem("favoriteTemps")) || [];
    setFavoriteTemps(storedFavorites);
  }, []);

  useEffect(() => {
    // Save favorite temperatures to local storage whenever the state changes
    localStorage.setItem("favoriteTemps", JSON.stringify(favoriteTemps));
  }, [favoriteTemps]);

  return (
      <div className="menu-data">
        <div className="App-Data">
        <div>
            <p>Search with the city name to get the temperature details</p> 
        </div>
          <div className="Menu">                        
            <input
              type="text"
              placeholder="Enter the city name"
              value={city}
              onChange={(event) => setCity(event.target.value)}
            />
            &nbsp; &nbsp;
            <button
              onClick={buttonSearch}
              className="btn btn-success"
              style={{ borderRadius: "14px" }}
            >
              Search
            </button>

          </div>
          {weatherData && (
            <div>
              <h2>{weatherData.name} ,{weatherData.sys.country}</h2>  
              {/* to get the city and country */}
              <p>
                Temperature: <b>{weatherData.main.temp}</b> Celsius
              </p>
              <p>Weather: {weatherData.weather[0].description}</p>
              <p>Humidity: {weatherData.main.humidity}</p>
              <p>Wind Speed: {weatherData.wind.speed} km/h</p>

              <button
                onClick={addToFavorites}
                className="btn btn-success"
              >
                Add to Favourites
              </button>
            </div>
          )}

          {/* Display temperature forecast for the whole day */}
          {forecastData && (
            <div>

              <h2 className="fore">-:-Forecast Data of the day-:-</h2>
              {/* <ul>
                                {forecastData.map((forecast, index) => (
                                    <li key={index} >
                                        <b style={{color:'red'}}><p>Date: {forecast.dt_txt}</p></b>
                                        <p>Temperature: <b>{forecast.main.temp}</b> Celsius</p>
                                        <p>Weather: {forecast.weather[0].description}</p>
                                        <hr></hr>
                                    </li>
                                ))}
                            </ul> */}

              <table >
                <thead >
                  <tr>
                    <th>Date</th>
                    <th>Temperature (Celsius)</th>
                    <th>Weather</th>
                  </tr>
                </thead>
                <tbody>
                  {forecastData.map((forecast, index) => (
                    <tr key={index}>
                      <td>{forecast.dt_txt}</td>
                      <td>{forecast.main.temp} °C</td>
                      <td>{forecast.weather[0].description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Add temperature to favorite  */}

          {favoriteTemps.length > 0 && (
            <div>
              <h2><b><u>Favorites</u></b> </h2>
              <ul>
                {favoriteTemps.map((item, index) => (
                  <li key={index}>
                    <h2>{item.name},{weatherData.sys.country}</h2>
                    <p>
                      Temperature: <b>{item.main.temp}</b> Celsius
                    </p>
                    <p>Weather: {item.weather[0].description}</p>
                    <p>Humidity: {item.main.humidity}</p>
                    <p>Wind Speed: {item.wind.speed} km/h</p>
                    <button
                      onClick={() => removeFromFavorites(index)}
                      className="btn btn-danger"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          
        </div>
      </div>
  );
}

export default WeatherApp;
