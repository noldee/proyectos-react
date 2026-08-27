import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import { Header } from "./components/Header";

const App = () => {
  return (
    <section className="mt-10 max-w-7xl mx-auto px-4 pb-16">
      <Header />
      <Outlet />
      <ToastContainer />
    </section>
  );
};

export default App;
