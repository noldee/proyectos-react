import { CartComponent } from "./CartComponent";

export const Header = () => {
  return (
    <header className="mb-12 border-b border-gray-100 bg-white shadow-sm p-6 rounded-b-3xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-6">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 text-center md:text-left">
          DevWear{" "}
          <span className="text-indigo-600 hover:text-indigo-700 transition-colors">
            Shop
          </span>
        </h1>

        <div className="flex items-center gap-8 justify-center md:justify-end">
          <nav className="flex gap-6 text-base font-semibold text-gray-600">
            <a
              href="#nosotros"
              className="hover:text-indigo-600 transition-colors"
            >
              Nosotros
            </a>
            <a
              href="#productos"
              className="hover:text-indigo-600 transition-colors"
            >
              Productos
            </a>
            <a
              href="#login"
              className="hover:text-indigo-600 transition-colors"
            >
              Login
            </a>
          </nav>

          <CartComponent />
        </div>
      </div>
    </header>
  );
};
