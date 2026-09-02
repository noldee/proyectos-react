import { useAppStore } from "../stores/useAppStore";
import type { Drink } from "../types";

type DrinkCardProps = {
  drink: Drink;
};

export const DrinkCard = ({ drink }: DrinkCardProps) => {
  const selectRecipe = useAppStore((state) => state.selectRecipe);
  return (
    <div className="border border-gray-200 shadow-lg bg-white rounded-lg overflow-hidden flex flex-col justify-between">
      <div className="overflow-hidden aspect-square">
        <img
          src={drink.strDrinkThumb}
          alt={`Imagen de ${drink.strDrink}`}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>

      <div className="p-5 flex flex-col justify-between flex-1">
        <h2 className="text-2xl truncate font-black text-slate-800">
          {drink.strDrink}
        </h2>

        <button
          type="button"
          className="bg-orange-400 hover:bg-orange-500 mt-5 w-full p-3 font-bold text-white text-lg rounded-lg transition-colors cursor-pointer"
          onClick={() => selectRecipe(drink.idDrink)}
        >
          Ver Receta
        </button>
      </div>
    </div>
  );
};
