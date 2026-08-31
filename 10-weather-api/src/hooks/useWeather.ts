import axios from "axios";
import type { SearchType } from "../types";
import { object, string, number, type InferInput, parse } from "valibot";
import { useMemo, useState } from "react";

const WeatherSchema = object({
  name: string(),
  main: object({
    temp: number(),
    temp_max: number(),
    temp_min: number(),
  }),
});

export type Weather = InferInput<typeof WeatherSchema>;

const initialWeather: Weather = {
  name: "",
  main: {
    temp: 0,
    temp_max: 0,
    temp_min: 0,
  },
};

export const useWeather = () => {
  const [weather, setWeather] = useState<Weather>(initialWeather);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const fetchWeather = async (search: SearchType) => {
    setLoading(true);
    setWeather(initialWeather);
    setNotFound(false);

    try {
      const apiKey = import.meta.env.VITE_API_KEY;
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${apiKey}`;
      const { data } = await axios(geoUrl);

      if (!data[0]) {
        setNotFound(true);
        return;
      }

      const lat = data[0].lat;
      const lon = data[0].lon;

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      const { data: weatherResult } = await axios(weatherUrl);
      const result = parse(WeatherSchema, weatherResult);

      if (result) {
        setWeather(result);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const hasWeatherData = useMemo(() => Boolean(weather.name), [weather]);

  return {
    weather,
    loading,
    notFound,
    fetchWeather,
    hasWeatherData,
  };
};
