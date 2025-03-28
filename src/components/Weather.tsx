import React, { useState } from 'react';
import axios from 'axios';
import './Weather.css';

const API_KEY = '89ea79d5403d657c859158f7c7ac39cf';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const Weather: React.FC = () => {
  // store city name
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<string | null>(null);
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

      const iconCode = response.data.weather[0].icon;
      setIconUrl(`https://openweathermap.org/img/wn/${iconCode}@2x.png`);

      setWeather(
        `Temperature at ${response.data.name}: ${response.data.main.temp}°C | ${response.data.weather[0].description}`
      );
    } catch (error) {
      console.error('API Error:', error);
      setWeather('City not found. Please try again!');
      setIconUrl(null); // set icon on error
    } finally {
        setLoading(false); // done loading
    }
  };

  return (
    <div>
      <h2>Weather App</h2>
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => {
            if (e.key === 'Enter'){
                handleSearch();
            }
        }}
      />
      <button onClick={handleSearch}>Get Weather</button>
      {loading && <div className='spinner'></div>}
      {weather && <p>{weather}</p>}
      {iconUrl && (
        <img
          src={iconUrl}
          alt="weather icon"
        />
      )}
    </div>
  );
};

export default Weather;
