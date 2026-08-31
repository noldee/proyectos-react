import { WeatherDetail } from "./components/details/WeatherDetail";
import { Form } from "./components/form/Form";
import { Spinner } from "./components/Spinner/Spinner";
import { useWeather } from "./hooks/useWeather";

const App = () => {
  const { weather, loading, notFound, fetchWeather, hasWeatherData } =
    useWeather();

  return (
    <div className="min-h-screen py-10 px-4 text-white">
      <h1 className="text-center text-3xl md:text-4xl font-light tracking-widest uppercase mb-12 drop-shadow-md">
        Buscador de Clima
      </h1>

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center">
        <Form fetchWeather={fetchWeather} />

        {loading && <Spinner />}

        {notFound && (
          <div className="w-full max-w-md mx-auto p-6 bg-red-500/20 backdrop-blur-md rounded-3xl border border-red-500/30 text-red-100 text-center font-medium shadow-xl">
            No existe esta ciudad
          </div>
        )}

        {hasWeatherData && !loading && <WeatherDetail weather={weather} />}
      </div>
    </div>
  );
};

export default App;
