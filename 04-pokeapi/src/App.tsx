import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getPokemonByNameOrId,
  getPokemons,
} from "./pokemons/actions/pokemon.actions";
import { PokemonCard } from "./pokemons/components/PokemonCard";

const App = () => {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);

  // 1. Query para la lista paginada
  const {
    data: pokemonsData,
    isLoading: isLoadingList,
    isError: isErrorList,
  } = useQuery({
    queryKey: ["pokemons", page], // 🔑 La clave de caché cambia con la página
    queryFn: () => getPokemons(page, 20),
    enabled: !searchTerm, // Solo ejecuta si no hay término de búsqueda activo
  });

  // 2. Query para la búsqueda de un Pokémon individual
  const {
    data: singlePokemon,
    isLoading: isLoadingSearch,
    isError: isErrorSearch,
  } = useQuery({
    queryKey: ["pokemon", searchTerm],
    queryFn: () => getPokemonByNameOrId(searchTerm),
    enabled: !!searchTerm, // Solo ejecuta cuando hay un término de búsqueda
    retry: false, // No reintentar si da error 404
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(query.trim());
  };

  const handleClearSearch = () => {
    setQuery("");
    setSearchTerm("");
  };

  const isLoading = isLoadingList || isLoadingSearch;
  const isError = isErrorList || isErrorSearch;
  const totalPages = pokemonsData ? Math.ceil(pokemonsData.total / 20) : 0;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Pokédex
          </h1>

          <form
            onSubmit={handleSearch}
            className="flex justify-center gap-2 max-w-md mx-auto"
          >
            <input
              type="text"
              placeholder="Buscar por nombre o ID..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all"
            >
              Buscar
            </button>
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-all"
              >
                Limpiar
              </button>
            )}
          </form>
        </header>

        {/* Carga */}
        {isLoading && (
          <div className="text-center py-12 text-lg font-medium text-slate-500">
            Cargando Pokémon con TanStack Query...
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="text-center py-12 text-red-500 font-medium">
            No se encontraron resultados para "{searchTerm}".
          </div>
        )}

        {/* Grid de Cards */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchTerm && singlePokemon ? (
              <PokemonCard pokemon={singlePokemon} />
            ) : (
              pokemonsData?.pokemons.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))
            )}
          </div>
        )}

        {/* Paginación */}
        {!searchTerm && !isLoading && (
          <div className="flex justify-between items-center mt-10 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 text-slate-700 font-semibold rounded-lg transition-all"
            >
              Anterior
            </button>

            <span className="text-sm font-medium text-slate-600">
              Página <strong className="text-slate-900">{page + 1}</strong> de{" "}
              {totalPages}
            </span>

            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all shadow-sm"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
