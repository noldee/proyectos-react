import type { Pokemon } from "../pokemons/interface/pokemon-interface";

interface Props {
  pokemon: Pokemon;
}

export const PokemonCard = ({ pokemon }: Props) => {
  const image =
    pokemon.sprites.other?.["official-artwork"].front_default ||
    pokemon.sprites.front_default;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 flex flex-col items-center border border-slate-100 hover:-translate-y-1">
      <span className="self-end text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
        #{pokemon.id.toString().padStart(3, "0")}
      </span>

      <img
        src={image}
        alt={pokemon.name}
        loading="lazy"
        className="w-28 h-28 object-contain my-2 drop-shadow-md"
      />

      <h3 className="capitalize font-bold text-lg text-slate-800 mb-2">
        {pokemon.name}
      </h3>

      <div className="flex gap-2 mb-3">
        {pokemon.types.map(({ type }) => (
          <span
            key={type.name}
            className="text-xs px-2.5 py-0.5 rounded-full capitalize font-medium bg-slate-100 text-slate-600 border border-slate-200"
          >
            {type.name}
          </span>
        ))}
      </div>

      <div className="w-full grid grid-cols-2 gap-2 text-center text-xs bg-slate-50 p-2 rounded-xl text-slate-500 font-medium mt-auto">
        <div>
          <span className="block text-slate-400">Altura</span>
          {pokemon.height / 10} m
        </div>
        <div>
          <span className="block text-slate-400">Peso</span>
          {pokemon.weight / 10} kg
        </div>
      </div>
    </div>
  );
};
