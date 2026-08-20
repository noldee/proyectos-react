import { useReducer } from "react";
import "./App.css";
import { Counter } from "./component/Counter";
import { counterReducer, initalState } from "./reducer/counter-reduce";
const App = () => {
  const [state, dispatch] = useReducer(counterReducer, initalState);
  return (
    <div className="content">
      <h1>Counter con useReducer</h1>
      <Counter state={state} dispatch={dispatch} />
    </div>
  );
};

export default App;
