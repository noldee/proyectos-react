import { productos } from "../data/data";
import { ProductCard } from "../components/ProductCard";

export const Home = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {productos.map((product) => (
        <ProductCard key={product.id} value={product} />
      ))}
    </div>
  );
};
