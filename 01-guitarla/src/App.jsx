import { Guitar } from "./components/Guitar";
import { Header } from "./components/Header";
import { useCart } from "./hooks/useCart";

const App = () => {
  const {
    data,
    cart,
    removeFrontCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    addToCart,
    isEmpty,
    cartTotal,
  } = useCart();
  return (
    <>
      <Header
        cart={cart}
        removeFrontCart={removeFrontCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        clearCart={clearCart}
        isEmpty={isEmpty}
        cartTotal={cartTotal}
      />
      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>
        <div className="row mt-5">
          {data.map((guitarItem) => (
            <Guitar
              key={guitarItem.id}
              guitarItem={guitarItem}
              addToCart={addToCart}
            />
          ))}
        </div>
      </main>

      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">
            GuitarLA - Todos los derechos Reservados
          </p>
        </div>
      </footer>
    </>
  );
};

export default App;
