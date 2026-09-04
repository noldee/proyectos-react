import { create } from "zustand";
import { createRecipesSlice, type RecipesSliceType } from "./recipeSlice";
import { devtools } from "zustand/middleware";
import { createFavoriteSlice, type FavoriteSliceType } from "./favoriteSlice";
import {
  createNotificationSlice,
  type NotificacionSliceType,
} from "./notificationSlice";
import { createAISlice, type AISlice } from "./aiSlice";

export const useAppStore = create<
  RecipesSliceType & FavoriteSliceType & NotificacionSliceType & AISlice
>()(
  devtools((...a) => ({
    ...createRecipesSlice(...a),
    ...createFavoriteSlice(...a),
    ...createNotificationSlice(...a),
    ...createAISlice(...a),
  })),
);
