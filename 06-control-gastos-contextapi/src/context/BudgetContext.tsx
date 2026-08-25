import React, { createContext, useMemo, useReducer } from "react";
import {
  budgetReducer,
  initalState,
  type BudgetActions,
  type BudgetState,
} from "../reducers/budget-reducer";

type BudgetContextProps = {
  state: BudgetState;
  dispatch: React.Dispatch<BudgetActions>;
  totalExpenses: number;
  remaingBudget: number;
};

type BudgetProviderProps = {
  children: React.ReactNode;
};

export const BudgetContext = createContext<BudgetContextProps>(
  {} as BudgetContextProps,
);

export const BudgetProvider = ({ children }: BudgetProviderProps) => {
  const [state, dispatch] = useReducer(budgetReducer, initalState);

  const totalExpenses = useMemo(
    () => state.expenses.reduce((total, expense) => expense.amount + total, 0),
    [state.expenses],
  );

  const remaingBudget = state.budget - totalExpenses;
  return (
    <BudgetContext.Provider
      value={{
        state,
        dispatch,
        totalExpenses,
        remaingBudget,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};
