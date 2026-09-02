import { useMemo } from "react";
import { DrinkCard } from "../components/DrinkCard";
import { useAppStore } from "../stores/useAppStore";

export default function FavortiesPage() {
  const favorites = useAppStore((state) => state.favorites);
  const hasFavorites = useMemo(() => favorites.length, [favorites]);
  return (
    <>
      <h1 className="text-6xl font-extrabold">Favoritos</h1>
      {hasFavorites ? (
        <div className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 my-10 gap-10">
          {favorites.map((recipe) => (
            <DrinkCard key={recipe.idDrink} drink={recipe} />
          ))}
        </div>
      ) : (
        <p className="text-center text-2xl">Los favoritos se mostrarán aquí</p>
      )}
    </>
  );
}
