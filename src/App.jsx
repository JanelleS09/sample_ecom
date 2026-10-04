import { useState } from "react";
import { Routes, Route, NavLink, Link } from "react-router-dom";
import { Home, ProductPage, Cart, Checkout } from "./pages.jsx";

export default function App() {
  const [cart, setCart] = useState([]); // [{ id, qty }]
  const [orders, setOrders] = useState([]); // placed orders

  const addToCart = (id, qty = 1) =>
    setCart((c) =>
      c.some((i) => i.id === id)
        ? c.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i))
        : [...c, { id, qty }]
    );
  const updateQty = (id, qty) =>
    setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  const removeItem = (id) => setCart((c) => c.filter((i) => i.id !== id));
  const placeOrder = (order) => {
    setOrders((o) => [...o, order]);
    setCart([]);
  };

  const count = cart.reduce((n, i) => n + i.qty, 0);
  const link = ({ isActive }) => (isActive ? "active" : "");

  return (
    <>
      <header className="bar">
        <Link to="/" className="logo">mesa</Link>
        <nav>
          <NavLink to="/" end className={link}>Home</NavLink>
          <NavLink to="/cart" className={link}>
            Cart <span className="badge" aria-label={`${count} items in cart`}>{count}</span>
          </NavLink>
          <NavLink to="/checkout" className={link}>Checkout</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/product/:id" element={<ProductPage addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} updateQty={updateQty} removeItem={removeItem} />} />
          <Route path="/checkout" element={<Checkout cart={cart} placeOrder={placeOrder} orders={orders} />} />
          <Route path="*" element={<p className="empty">Page not found. <Link to="/">Back to shop</Link></p>} />
        </Routes>
      </main>
      <footer className="foot">Mesa · Desk &amp; home goods · Demo store, no real payments</footer>
    </>
  );
}
