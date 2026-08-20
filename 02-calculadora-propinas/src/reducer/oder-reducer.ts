import type { MenuItems, OrderItem } from "../types";

export type OrderAction =
  | { type: "add-item"; payload: { item: MenuItems } }
  | { type: "remove-item"; payload: { id: MenuItems["id"] } }
  | { type: "place-order" }
  | { type: "add-tip"; payload: { value: number } };

export type OrderState = {
  order: OrderItem[];
  tip: number;
};

export const initialState: OrderState = {
  order: [],
  tip: 0,
};

export const orderReducer = (
  state: OrderState = initialState,
  action: OrderAction,
) => {
  switch (action.type) {
    case "add-item": {
      const itemExist = state.order.find(
        (orderItem) => orderItem.id === action.payload.item.id,
      );
      let updatedOrder: OrderItem[] = [];
      if (itemExist) {
        updatedOrder = state.order.map((orderItem) =>
          orderItem.id === action.payload.item.id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem,
        );
      } else {
        const newItem = { ...action.payload.item, quantity: 1 };
        updatedOrder = [...state.order, newItem];
      }
      return {
        ...state,
        order: updatedOrder,
      };
    }
    case "remove-item": {
      const orderItem = state.order.filter(
        (item) => item.id !== action.payload.id,
      );
      return {
        ...state,
        order: orderItem,
      };
    }
    case "place-order": {
      return {
        ...state,
        order: [],
        tip: 0,
      };
    }
    case "add-tip": {
      const tip = action.payload.value;
      return {
        ...state,
        tip,
      };
    }

    default:
      return state;
  }
};
