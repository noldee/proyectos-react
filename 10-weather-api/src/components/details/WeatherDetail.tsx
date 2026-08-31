import type { Weather } from "../../hooks/useWeather";
import { formatTemperature } from "../helpers";

type WeatherDetailProps = {
  weather: Weather;
};

export const WeatherDetail = ({ weather }: WeatherDetailProps) => {
  return (
    <div className="w-full mt-10 md:mt-0 max-w-md mx-auto p-8 bg-black/20 backdrop-blur-md rounded-3xl border border-white/10 text-white shadow-xl flex flex-col items-center text-center gap-4">
      <h2 className="text-2xl font-medium tracking-wide text-slate-200 uppercase text-xs tracking-widest font-semibold">
        Clima actual en
      </h2>
      <p className="text-3xl font-light text-white -mt-2">{weather.name}</p>

      <div className="my-2">
        <span className="text-6xl font-bold tracking-tighter text-white">
          {formatTemperature(weather.main.temp)}
        </span>
        <span className="text-4xl font-light text-sky-300 align-top">
          &deg;C
        </span>
      </div>

      <div className="flex justify-center items-center gap-6 w-full py-2.5 px-6 bg-white/5 rounded-full border border-white/10 text-sm text-slate-300">
        <p>
          Mín:{" "}
          <span className="font-semibold text-white pl-1">
            {formatTemperature(weather.main.temp_min)}&deg;C
          </span>
        </p>
        <span className="text-white/20">|</span>
        <p>
          Máx:{" "}
          <span className="font-semibold text-white pl-1">
            {formatTemperature(weather.main.temp_max)}&deg;C
          </span>
        </p>
      </div>
    </div>
  );
};
