import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { countries } from "../../data/countries";
import type { SearchType } from "../../types";
import { AlertMessage } from "../alert/AlertMessage";

type FormProps = {
  fetchWeather: (search: SearchType) => Promise<void>;
};

export const Form = ({ fetchWeather }: FormProps) => {
  const [search, setSearch] = useState<SearchType>({
    city: "",
    country: "",
  });
  const [alert, setAlert] = useState("");
  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
  ) => {
    setSearch({
      ...search,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Object.values(search).includes("")) {
      setAlert("Todos los campos son obligatorios");
      return;
    }
    setAlert("");
    fetchWeather(search);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 w-full max-w-md mx-auto p-8 bg-black/20 backdrop-blur-md rounded-3xl border border-white/10 text-white shadow-xl"
    >
      {alert && <AlertMessage>{alert}</AlertMessage>}

      <div className="flex flex-col gap-2">
        <label
          htmlFor="city"
          className="text-xs font-semibold tracking-widest text-slate-300 uppercase pl-1"
        >
          Ciudad
        </label>
        <input
          type="text"
          id="city"
          name="city"
          placeholder="Ej. Lima, Madrid, Tokio..."
          className="w-full px-4 py-3 bg-white/5 border-b border-white/30 focus:border-sky-300 text-white text-base placeholder-slate-400/60 transition-all outline-none rounded-t-lg focus:bg-white/10"
          value={search.city}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="country"
          className="text-xs font-semibold tracking-widest text-slate-300 uppercase pl-1"
        >
          País
        </label>
        <select
          id="country"
          name="country"
          className="w-full px-4 py-3 bg-white/5 border-b border-white/30 focus:border-sky-300 text-white text-base transition-all outline-none cursor-pointer rounded-t-lg focus:bg-white/10"
          value={search.country}
          onChange={handleChange}
        >
          <option value="" disabled className="bg-slate-900 text-slate-400">
            -- Seleccione un País --
          </option>
          {countries.map((country) => (
            <option
              key={country.code}
              value={country.code}
              className="bg-slate-900 text-white"
            >
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="mt-4 w-full py-3.5 px-6 bg-white/15 hover:bg-white/25 active:scale-[0.98] border border-white/30 text-white font-medium text-sm rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer shadow-md"
      >
        Buscar clima
      </button>
    </form>
  );
};
