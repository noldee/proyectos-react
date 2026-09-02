import { create } from "zustand";
import { createRecipesSlice, type RecipesSliceType } from "./recipeSlice";
import { devtools } from "zustand/middleware";
import { createFavoriteSlice, type FavoriteSliceType } from "./favoriteSlice";
import {
  createNotificationSlice,
  type NotificacionSliceType,
} from "./notificationSlice";

export const useAppStore = create<
  RecipesSliceType & FavoriteSliceType & NotificacionSliceType
>()(
  devtools((...a) => ({
    ...createRecipesSlice(...a),
    ...createFavoriteSlice(...a),
    ...createNotificationSlice(...a),
  })),
);
