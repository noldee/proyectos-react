import {
  createContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import {
  activityReducer,
  initalState,
  type ActivityActions,
  type ActivityState,
} from "../reducer/activity-reducer";
import type { Activity } from "../types";
import { categories } from "../data/categories";

type ActivityProviderProps = {
  children: ReactNode;
};

type ActivityContextProps = {
  state: ActivityState;
  dispatch: Dispatch<ActivityActions>;
  caloriesConsumed: number;
  caloriesBurned: number;
  netCalories: number;
  categoryName: (category: Activity["category"]) => string[];
  isEmptyActivities: boolean;
};

export const ActivityContext = createContext<ActivityContextProps>(
  {} as ActivityContextProps,
);

export const ActivityProvider = ({ children }: ActivityProviderProps) => {
  const [state, dispatch] = useReducer(activityReducer, initalState);

  // Contadores
  const caloriesConsumed = useMemo(
    () =>
      state.activities.reduce(
        (total, activiy) =>
          activiy.category === 1 ? total + activiy.calories : total,
        0,
      ),
    [state.activities],
  );
  const caloriesBurned = useMemo(
    () =>
      state.activities.reduce(
        (total, activiy) =>
          activiy.category === 2 ? total + activiy.calories : total,
        0,
      ),
    [state.activities],
  );

  const netCalories = useMemo(
    () => caloriesConsumed - caloriesBurned,
    [state.activities],
  );

  const categoryName = useMemo(
    () => (category: Activity["category"]) =>
      categories.map((cat) => (cat.id === category ? cat.name : "")),
    [state.activities],
  );
  const isEmptyActivities = useMemo(
    () => state.activities.length === 0,
    [state.activities],
  );
  return (
    <ActivityContext
      value={{
        state,
        dispatch,
        caloriesConsumed,
        caloriesBurned,
        netCalories,
        categoryName,
        isEmptyActivities,
      }}
    >
      {children}
    </ActivityContext>
  );
};
