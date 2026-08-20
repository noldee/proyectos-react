import { useMemo } from "react";
import type { Activity } from "../types";
import { CalorieDisplay } from "./CalorieDisplay";

type CalorieTrackertProps = {
  activities: Activity[];
};
export const CalorieTrackert = ({ activities }: CalorieTrackertProps) => {
  // Contadores
  const caloriesConsumed = useMemo(
    () =>
      activities.reduce(
        (total, activiy) =>
          activiy.category === 1 ? total + activiy.calories : total,
        0,
      ),
    [activities],
  );
  const caloriesBurned = useMemo(
    () =>
      activities.reduce(
        (total, activiy) =>
          activiy.category === 2 ? total + activiy.calories : total,
        0,
      ),
    [activities],
  );

  const netCalories = useMemo(
    () => caloriesConsumed - caloriesBurned,
    [activities],
  );

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
