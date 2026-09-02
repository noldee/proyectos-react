import type { StateCreator } from "zustand";
import type { FavoriteSliceType } from "./favoriteSlice";

type Notifiacion = {
  text: string;
  error: boolean;
  show: boolean;
};

export type NotificacionSliceType = {
  notification: Notifiacion;
  showNotification: (payload: Pick<Notifiacion, "text" | "error">) => void;
  hideNotification: () => void;
};
export const createNotificationSlice: StateCreator<
  NotificacionSliceType & FavoriteSliceType,
  [],
  [],
  NotificacionSliceType
> = (set, get) => ({
  notification: {
    text: "",
    error: false,
    show: false,
  },
  showNotification: (payload) => {
    set({
      notification: {
        text: payload.text,
        error: payload.error,
        show: true,
      },
    });
    setTimeout(() => {
      get().hideNotification();
    }, 2000);
  },
  hideNotification: () => {
    set({
      notification: {
        text: "",
        error: false,
        show: false,
      },
    });
  },
});
