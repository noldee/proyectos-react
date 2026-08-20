import React, { useCallback } from "react";
import type { OrderItem } from "../types";
import { formatCurrency } from "../helpers";
import type { OrderAction } from "../reducer/oder-reducer";

type OrderTotalsProps = {
  order: OrderItem[];
  tip: number;
  dispatch: React.Dispatch<OrderAction>;
};
export const OrderTotals = ({ order, tip, dispatch }: OrderTotalsProps) => {
  const subTotalAmount = useCallback(
    () => order.reduce((total, item) => total + item.quantity * item.price, 0),
    [order],
  );

  const tipAmount = useCallback(() => subTotalAmount() * tip, [tip, order]);
  const totalAmount = useCallback(
    () => subTotalAmount() + tipAmount(),
    [tip, order],
  );
  return (
    <>
      <div className="space-y-3">
        <h2 className="font-black text-2xl">Totales y Propinas: </h2>
        <p>
          Subtotal a pagar: {""}
          <span className="font-bold">{formatCurrency(subTotalAmount())}</span>
        </p>

        <p>
          Propina: {""}
          <span className="font-bold">{formatCurrency(tipAmount())}</span>
        </p>
        <p>
          Total a pagar: {""}
          <span className="font-bold">{formatCurrency(totalAmount())}</span>
        </p>
      </div>
      <button
        className="w-full bg-black p-3 uppercase text-white font-bold mt-10 disabled:opacity-10"
        disabled={totalAmount() === 0}
        onClick={() => dispatch({ type: "place-order" })}
      >
        GUARDAR ORDEN
      </button>
    </>
  );
};
