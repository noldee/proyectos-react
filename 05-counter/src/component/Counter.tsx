import type React from "react";
import type { CounterActions, counterState } from "../reducer/counter-reduce";
import { useState } from "react";

type CounterProps = {
  state: counterState;
  dispatch: React.Dispatch<CounterActions>;
};

export const Counter = ({ state, dispatch }: CounterProps) => {
  const [customAmount, setCustomAmount] = useState<number>(0);
  const isButtonDisabled = customAmount <= 0;

  return (
    <div className="w-full max-w-sm mx-auto bg-white/80 backdrop-blur-md p-7 rounded-3xl shadow-xl shadow-sky-900/5 border border-white/60">
      <div className="flex flex-col items-center justify-center bg-sky-50/70 rounded-2xl p-6 mb-6 border border-sky-100/80">
        <span className="text-xs font-medium text-sky-800/60 uppercase tracking-wider mb-1">
          Valor Actual
        </span>
        <span className="text-6xl font-extrabold text-sky-950 tracking-tight">
          {state.count}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2.5 mb-6">
        <button
          className="bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all shadow-sm shadow-sky-500/20"
          onClick={() => dispatch({ type: "action-sumar" })}
        >
          +1
        </button>

        <button
          className="bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all shadow-sm shadow-sky-600/20"
          onClick={() => dispatch({ type: "action-sumar-diez" })}
        >
          +10
        </button>

        <button
          className="bg-rose-100 hover:bg-rose-200 active:scale-95 text-rose-700 font-semibold py-3 rounded-xl transition-all"
          onClick={() => dispatch({ type: "action-restar" })}
        >
          -1
        </button>

        <button
          className="bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 font-semibold py-3 rounded-xl transition-all"
          onClick={() => dispatch({ type: "action-resetear" })}
        >
          Reset
        </button>
      </div>

      {/* Input de cantidad personalizada */}
      <div className="bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100 flex gap-2">
        <input
          type="number"
          min="0"
          value={customAmount === 0 ? "" : customAmount}
          placeholder="0"
          className="bg-white text-slate-800 font-bold text-center border border-slate-200 rounded-xl p-2.5 w-20 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition"
          onChange={(e) => {
            const val = Number(e.target.value);
            setCustomAmount(val < 0 ? 0 : val);
          }}
        />

        <button
          className="bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-semibold py-2.5 px-4 rounded-xl transition-all flex-1 disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100 shadow-sm shadow-sky-500/20"
          disabled={isButtonDisabled}
          onClick={() => {
            dispatch({
              type: "action-sumar-cantidad",
              payload: { cantidad: customAmount },
            });
            setCustomAmount(0);
          }}
        >
          Sumar Cantidad
        </button>
      </div>
    </div>
  );
};
