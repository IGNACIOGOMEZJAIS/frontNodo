import { useState, useEffect } from "react";

const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=-34.61&longitude=-58.38&current_weather=true&lang=es`
        );
        const data = await response.json();

        // Asegurarse de que la respuesta tiene la propiedad current_weather
        if (data && data.current_weather) {
          setWeather(data);
        } else {
          setError("No se pudo obtener el clima");
        }
      } catch (err) {
        setError("No se pudo obtener el clima");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return { weather, loading, error };
};

export default useWeather;
