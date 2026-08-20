export type CounterActions =
  | { type: "action-sumar" }
  | { type: "action-restar" }
  | { type: "action-resetear" }
  | { type: "action-sumar-diez" }
  | { type: "action-sumar-cantidad"; payload: { cantidad: number } };

export type counterState = {
  count: number;
};

export const initalState: counterState = {
  count: 0,
};

export const counterReducer = (
  state: counterState,
  action: CounterActions,
): counterState => {
  switch (action.type) {
    case "action-sumar":
      return { ...state, count: state.count + 1 };

    case "action-restar":
      return { ...state, count: state.count < 1 ? 0 : state.count - 1 };

    case "action-resetear":
      return { ...state, count: 0 };

    case "action-sumar-diez":
      return { ...state, count: state.count + 10 };

    case "action-sumar-cantidad":
      return {
        ...state,
        count: state.count + action.payload.cantidad,
      };

    default:
      return state;
  }
};
