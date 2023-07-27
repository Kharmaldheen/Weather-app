import { useEffect, useState } from "react";
import Weather from "./Components/Weather";

export default function App() {
  const [location, setLocation] = useState(function () {
    const savedLocation = localStorage.getItem("location");
    return savedLocation ? savedLocation : "";
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [weather, setWeather] = useState({});
  const [displayLocation, setDisplayLocation] = useState("");

  console.log(weather);

  useEffect(
    function () {
      const fetchWeather = async () => {
        // if (this.state.location.length < 3) return this.setState({ weather: {} });
        try {
          setIsLoading(true);
          // 1) Getting location (geocoding)
          const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${location}`
          );
          const geoData = await geoRes.json();

          if (!geoData.results) throw new Error("Location not found");

          console.log(geoData.results);

          const { latitude, longitude, timezone, name, country_code } =
            geoData.results.at(0);

          setDisplayLocation(`${name} ${convertToFlag(country_code)}`);

          // 2) Getting actual weather
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
          );

          if (!weatherRes.ok)
            throw new Error("Unable to get weather data, try again later");
          const weatherData = await weatherRes.json();

          setWeather(weatherData.daily);
        } catch (err) {
          setIsError(err.message);
          console.error(err);
        } finally {
          setIsLoading(false);
          setIsError("");
        }
      };

      if (location.length < 3) return;
      fetchWeather();
      localStorage.setItem("location", location);
    },
    [location]
  );

  return (
    <div className="app">
      <h1>Classy Weather</h1>
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        type="text"
        placeholder="search for location..."
      />

      {isLoading && <p className="loader">Loading...</p>}

      {isError && <p>{isError}</p>}

      {weather.weathercode ? (
        <Weather displayLocation={displayLocation} weather={weather} />
      ) : null}
    </div>
  );
}

function convertToFlag(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}
