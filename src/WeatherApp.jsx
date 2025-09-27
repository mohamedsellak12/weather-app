import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import { FaMapMarkerAlt } from "react-icons/fa";
import { WiStrongWind, WiSunrise, WiSunset, WiWindBeaufort10, WiWindDeg } from "react-icons/wi";


function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  // const [result,setResult]=useState({})
  const [city, setCity] = useState(""); // ville recherchée
  const [latLon, setLatLon] = useState(null);
  const [dateTime, setDateTime] = useState({
    date: "",
    time: "",
  });
  function getLocalTime(timezone) {
      const now = new Date();
  // UTC time in ms + timezone offset (seconds → ms)
  const local = new Date(now.getTime()-3600000 + timezone * 1000);
  return local.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}


const key="68c45ef28ee5669dd67433fe721b07f7"
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const date = now.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const time = now.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
     
      });
      setDateTime({ date, time });
    };

    updateDateTime(); // initialise tout de suite
    const interval = setInterval(updateDateTime, 1000); // met à jour chaque seconde

    return () => clearInterval(interval); // nettoyage
  }, []);



  // Geolocation par défaut
  useEffect(() => {
    if (city) return; // si une ville est recherchée, pas besoin de géoloc

    if (!navigator.geolocation) {
      setError("🌍 Géolocalisation non supportée");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatLon({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (err) => {
        setError("⚠️ Permission géolocalisation refusée");
        setLoading(false);
      }
    );
  }, [city]);

  // Fetch météo
  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      let url = "";
      if (city) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric&lang=fr`;
      } else if (latLon) {
        url=`https://api.openweathermap.org/data/2.5/weather?lat=${latLon.lat}&lon=${latLon.lon}&appid=${key}&units=metric&lang=fr`
       
      } else {
        return;
      }

      try {
        const res = await fetch(url);
        const data = await res.json();
        const result={
            city: data.name,
                temp: data.main.temp,
             temp_min: data.main.temp_min,
               temp_max: data.main.temp_max,
       humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      wind_deg: data.wind.deg,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      timezone: data.timezone,
        }
        if (data.error) {
       setCity("")
      return; // on ne change pas `weather`
    }
        setWeather(result);
        setError("");
      } catch (err) {
        setError("⚠️ Erreur serveur");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city, latLon]);

  if (loading) return <p className="text-center mt-8">Chargement météo…</p>;
  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-6 transition-colors duration-500">
  
  {/* <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-gray-200">Weather App</h1> */}

  {/* Barre de recherche */}
  <SearchBar onSearch={setCity} />

  {/* Carte météo */}
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-sm w-full text-center transition-colors duration-500">
    <h2 className="text-3xl font-semibold text-gray-700 dark:text-gray-100 mb-4 flex items-center justify-center gap-2">
        {!city && <FaMapMarkerAlt className="text-red-500" />}
        {weather.city}
    </h2>

    <p className="text-gray-600 dark:text-gray-400">{dateTime.date}</p>
    <p className="text-gray-600 dark:text-gray-400 mb-4">
      {city ? getLocalTime(weather.timezone) : dateTime.time}
    </p>

    <div className="flex justify-center mb-4">
      <img
        src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
        alt={weather.description}
        className="w-32 h-32"
      />
    </div>

    <p className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-2">{weather.temp}°C</p>
    <p className="text-xl text-gray-500 dark:text-gray-300 capitalize mb-6">{weather.description}</p>

    {/* Infos supplémentaires */}
    <div className="grid grid-cols-2 gap-4 bg-blue-50 dark:bg-gray-700 rounded-xl p-4 transition-colors duration-500">

     


      {/* Lever du soleil */}
      <div className="flex flex-col items-center">
        <WiSunrise size={40} color="orange" />
        <span className="text-gray-600 dark:text-gray-300 text-sm">Sunriser</span>
        <span className="font-semibold text-gray-800 dark:text-gray-100">
          {new Date(weather.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {/* Coucher du soleil */}
      <div className="flex flex-col items-center">
        <WiSunset size={40} color="red" />
        <span className="text-gray-600 dark:text-gray-300 text-sm">Sunset</span>
        <span className="font-semibold text-gray-800 dark:text-gray-100">
          {new Date(weather.sunset * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

       {/* Humidité */}
      <div className="flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.485-8.485h1M3.515 12.515h1M16.95 7.05l.707-.707M6.343 17.657l.707-.707M16.95 16.95l.707.707M6.343 6.343l.707.707" />
        </svg>
        <span className="text-gray-600 dark:text-gray-300 text-sm">Humidité</span>
        <span className="font-semibold text-gray-800 dark:text-gray-100">{weather.humidity}%</span>
      </div>

      {/* Vent */}
      <div className="flex flex-col items-center">
       <WiStrongWind size={40} color="blue" />
        <span className="text-gray-600 dark:text-gray-300 text-sm">Vent</span>
        <span className="font-semibold text-gray-800 dark:text-gray-100">{weather.wind_speed} m/s</span>
        
      </div>
    </div>
  </div>
</div>

  );
}

export default WeatherApp;
