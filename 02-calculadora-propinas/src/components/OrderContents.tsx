import type React from "react";
import { formatCurrency } from "../helpers";
import type { MenuItems, OrderItem } from "../types";
import type { OrderAction } from "../reducer/oder-reducer";

type OrderContentsProps = {
  order: OrderItem[];
  dispatch: React.Dispatch<OrderAction>;
};

export const OrderContents = ({ order, dispatch }: OrderContentsProps) => {
  return (
    <div>
      <h1 className="text-4xl font-black">Consumo</h1>

      <div className="space-y-3 mt-5">
        {order.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center  border-t border-gray-300 py-5 last-of-type:border-b"
          >
            <div>
              <p className="text-lg">
                {item.name} -{formatCurrency(item.price)}
              </p>
              <p className="font-black">
                Cantidad: {item.quantity} -{" "}
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
            <button
              className="bg-red-600 h-8 w-8 rounded-full text-white font-black"
              onClick={() =>
                dispatch({ type: "remove-item", payload: { id: item.id } })
              }
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
