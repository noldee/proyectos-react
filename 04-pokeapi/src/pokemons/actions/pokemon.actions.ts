import { pokemonApi } from "../api/pokemon.api";
import type { Pokemon } from "../interface/pokemon-interface";

interface PokeListResponse {
  count: number;
  results: { name: string; url: string }[];
}

// 1. Fetch de la lista paginada
export const getPokemons = async (
  page: number = 0,
  limit: number = 20,
): Promise<{ pokemons: Pokemon[]; total: number }> => {
  const offset = page * limit;

  const { data } = await pokemonApi.get<PokeListResponse>("/pokemon", {
    params: { limit, offset },
  });

  const pokemonPromises = data.results.map(async (item) => {
    const res = await pokemonApi.get<Pokemon>(`/pokemon/${item.name}`);
    return res.data;
  });

  const pokemons = await Promise.all(pokemonPromises);

  return {
    pokemons,
    total: data.count,
  };
};

// 2. Fetch de un solo Pokémon
export const getPokemonByNameOrId = async (query: string): Promise<Pokemon> => {
  const response = await pokemonApi.get<Pokemon>(
    `/pokemon/${query.toLowerCase().trim()}`,
  );
  return response.data;
};
