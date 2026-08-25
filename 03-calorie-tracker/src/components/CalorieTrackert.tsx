import { CalorieDisplay } from "./CalorieDisplay";
import { useActivity } from "../hooks/useActivity";

export const CalorieTrackert = () => {
  // Contadores
  const { caloriesBurned, caloriesConsumed, netCalories } = useActivity();

  return (
    <>
      <h2 className="text-center text-4xl font-black text-white">
        Resumen de Calorias
      </h2>

      <div className="flex flex-col items-center md:flex-row md:justify-between gap-5 mt-10">
        <CalorieDisplay calories={caloriesConsumed} text="Consumidas" />
        <CalorieDisplay calories={caloriesBurned} text="Ejericios" />
        <CalorieDisplay calories={netCalories} text="Diferencia" />
      </div>
    </>
  );
};
