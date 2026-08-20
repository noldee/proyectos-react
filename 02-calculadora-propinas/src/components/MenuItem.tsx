import type React from "react";
import type { MenuItems } from "../types";
import type { OrderAction } from "../reducer/oder-reducer";

type MenuItemProps = {
  item: MenuItems;
  dispatch: React.Dispatch<OrderAction>;
};

export const MenuItem = ({ item, dispatch }: MenuItemProps) => {
  return (
    <button
      className="border-2 border-teal-400 hover:bg-teal-200 w-full flex  p-3 justify-between"
      onClick={() => dispatch({ type: "add-item", payload: { item } })}
    >
      <p>{item.name}</p>
      <p className="font-black">${item.price}</p>
    </button>
  );
};
