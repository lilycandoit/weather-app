import React, { useState } from 'react';
import axios from 'axios';
import './Weather.css';

type WeatherData = {
  temp: number;
  desc: string;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  iconUrl: string;
  city: string;
}

const API_KEY = '89ea79d5403d657c859158f7c7ac39cf';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const Weather: React.FC = () => {
  // store city name
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // handle button click
  const handleSearch = async () => {
    setLoading(true); // start loading when fetching API
    try {
      const response = await axios.get(API_URL, {
        params: {
          q: city.trim().toLowerCase(),
          appid: API_KEY,
          units: 'metric',
        },
      });

      console.log(response.data);
      const data = response.data;

      const iconCode = response.data.weather[0].icon;

      setWeather({
        temp: data.main.temp,
        desc: data.weather[0].description,
        feels_like: data.main.feels_like,
        humidity: data.main.humidity,
        wind_speed: data.wind.speed,
        iconUrl: `https://openweathermap.org/img/wn/${iconCode}@2x.png`,
        city: data.name
      });

      setCity(''); // to clear after inputting

    } catch (error) {
      console.error('API Error:', error);
      setWeather(null);
      alert('City not found. Please try again!');
    } finally {
        setLoading(false); // done loading
    }
  };

  return (
    <div className="weather-card">
      <h1>Weather App</h1>
      <input
        type="text"
        className='input'
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => {
            if (e.key === 'Enter'){
                handleSearch();
            }
        }}
      />
      <button className='btn' onClick={handleSearch}>Get Weather</button>

      { loading && <div className='spinner'></div>}

      {
        weather && (
          <div>
            <h2>{weather.city}</h2>
            <img src={weather.iconUrl} alt="Weather Icon" />
            <h1>{Math.round(weather.temp)}°C</h1>
            <p className="desciption">{weather.desc}</p>
            <div className="details">
              <div>Feels like: {Math.round(weather.feels_like)}°C</div>
              <div>Humidity: {weather.humidity}%</div>
              <div>Wind Speed: {weather.wind_speed} m/s</div>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default Weather;
