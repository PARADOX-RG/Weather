import React, { useState } from "react";

const API_KEY = "b89198caedf780f35528f897cf7c733f";


function WeatherApp() {
    const [query, setQuery] = useState("");
    const [cities, setCities] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState("");
    const [currentBg, setCurrentBg] = useState("bg-default");

    const fetchSuggestions = async (input) => {
        if (!input) {
            setSuggestions([]);
            return;
        }
        try {
            const res = await fetch(
                `http://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${API_KEY}`
            );
            const data = await res.json();
            setSuggestions(data);
        } catch (err) {
            console.log(err);
        }
    };

    const getWeather = async (cityName) => {
        try {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=uk`
            );
            if (!res.ok) throw new Error("Місто не знайдено");
            const data = await res.json();
            setCities([...cities, data]);
            setQuery("");
            setSuggestions([]);
            setError("");
            updateBackground(data.weather[0].main);
        } catch (err) {
            setError(err.message);
        }
    };

    const updateBackground = (weatherMain) => {
        switch (weatherMain.toLowerCase()) {
            case "clear":
                setCurrentBg("bg-clear");
                break;
            case "clouds":
                setCurrentBg("bg-clouds");
                break;
            case "rain":
            case "drizzle":
            case "thunderstorm":
                setCurrentBg("bg-rain");
                break;
            case "snow":
                setCurrentBg("bg-snow");
                break;
            default:
                setCurrentBg("bg-default");
        }
    };

    const removeCity = (name) => {
        setCities(cities.filter((c) => c.name !== name));
    };

    return (
        <div className={`min-vh-100 text-white py-5 ${currentBg}`}>
            <div className="container">
                <h1 className="text-center mb-4">🌤️ Weather App</h1>

                <div className="position-relative mb-4 w-50 mx-auto">
                    <input
                        type="text"
                        className="form-control"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            fetchSuggestions(e.target.value);
                        }}
                        placeholder="Введи місто..."
                    />

                    {suggestions.length > 0 && (
                        <ul className="list-group position-absolute w-100" style={{ zIndex: 10 }}>
                            {suggestions.map((s, idx) => (
                                <li
                                    key={idx}
                                    className="list-group-item list-group-item-action"
                                    onClick={() => getWeather(s.name)}
                                >
                                    {s.name}, {s.country}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {error && <p className="text-danger text-center">{error}</p>}

                <div className="row">
                    {cities.map((weather) => (
                        <div
                            className="col-md-4 mb-4"
                            key={weather.id}
                            onClick={() => updateBackground(weather.weather[0].main)}
                        >
                            <div className="card shadow-sm cursor-pointer">
                                <div className="card-body">
                                    <button
                                        className="btn-close float-end"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeCity(weather.name);
                                        }}
                                    ></button>
                                    <h5 className="card-title">
                                        {weather.name}, {weather.sys.country}
                                    </h5>
                                    <p className="card-text text-capitalize">
                                        {weather.weather[0].description}
                                    </p>
                                    <h2 className="fw-bold">{weather.main.temp}°C</h2>
                                    <p className="text-muted">
                                        Відчувається як: {weather.main.feels_like}°C
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


export default WeatherApp;
