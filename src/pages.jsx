import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PRODUCTS, CATEGORIES, peso } from "./data.js";

const PAGE_SIZE = 6;
const find = (id) => PRODUCTS.find((p) => p.id === Number(id));
const Tile = ({ p, big }) => (
  <div className={"tile" + (big ? " big" : "")} style={{ background: p.color }} aria-hidden="true">{p.emoji}</div>
);

/* ---------- Home / listing ---------- */
export function Home({ addToCart }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [added, setAdded] = useState(null);

  const results = PRODUCTS.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      p.name.toLowerCase().includes(query.trim().toLowerCase())
  );
  const reset = (fn) => (v) => { fn(v); setVisible(PAGE_SIZE); };
  const add = (p) => { addToCart(p.id); setAdded(p.id); setTimeout(() => setAdded(null), 1200); };

  return (
    <>
      <section className="hero">
        <h1>Good things for the table you work and eat at.</h1>
        <p>Twelve everyday pieces, chosen to last.</p>
      </section>
      <div className="filters">
        <input type="search" placeholder="Search products" value={query}
          onChange={(e) => reset(setQuery)(e.target.value)} aria-label="Search products" />
        <div className="chips">
          {CATEGORIES.map((c) => (
            <button key={c} className={c === category ? "chip on" : "chip"}
              onClick={() => reset(setCategory)(c)}>{c}</button>
          ))}
        </div>
      </div>
      {results.length === 0 ? (
        <p className="empty">No products match “{query}”. Try a different word or category.</p>
      ) : (
        <div className="grid">
          {results.slice(0, visible).map((p) => (
            <article className="card" key={p.id}>
              <Link to={`/product/${p.id}`}><Tile p={p} /></Link>
              <div className="info">
                <Link to={`/product/${p.id}`} className="name">{p.name}</Link>
                <span className="muted">{p.category}</span>
                <div className="row">
                  <strong>{peso(p.price)}</strong>
                  <button className="btn small" onClick={() => add(p)}>
                    {added === p.id ? "Added" : "Add to cart"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      {visible < results.length && (
        <div className="center">
          <button className="btn ghost" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
            View more ({results.length - visible} left)
          </button>
        </div>
      )}
    </>
  );
}

/* ---------- Product details ---------- */
export function ProductPage({ addToCart }) {
  const { id } = useParams();
  const p = find(id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!p) return <p className="empty">Product not found. <Link to="/">Back to shop</Link></p>;

  const add = () => { addToCart(p.id, qty); setAdded(true); setTimeout(() => setAdded(false), 1500); };
  return (
    <section className="detail">
      <Tile p={p} big />
      <div>
        <Link to="/" className="muted">← All products</Link>
        <h1>{p.name}</h1>
        <span className="muted">{p.category}</span>
        <p className="price">{peso(p.price)}</p>
        <p className="desc">{p.desc}</p>
        <div className="row start">
          <Qty value={qty} onChange={setQty} />
          <button className="btn" onClick={add}>{added ? "Added to cart" : "Add to cart"}</button>
        </div>
        {added && <p className="ok">Added {qty} to your cart. <Link to="/cart">View cart</Link></p>}
      </div>
    </section>
  );
}

function Qty({ value, onChange }) {
  return (
    <div className="qty">
      <button onClick={() => onChange(Math.max(1, value - 1))} aria-label="Decrease quantity">−</button>
      <span>{value}</span>
      <button onClick={() => onChange(value + 1)} aria-label="Increase quantity">+</button>
    </div>
  );
}

/* ---------- Shared totals ---------- */
const SHIPPING = 99;
const FREE_OVER = 3000;
function totals(cart) {
  const lines = cart.map((i) => ({ ...find(i.id), qty: i.qty }));
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_OVER ? 0 : SHIPPING;
  return { lines, subtotal, shipping, total: subtotal + shipping };
}

/* ---------- Cart ---------- */
export function Cart({ cart, updateQty, removeItem }) {
  const { lines, subtotal, shipping, total } = totals(cart);
  if (!lines.length)
    return <p className="empty">Your cart is empty. <Link to="/">Browse products</Link></p>;
  return (
    <>
      <h1 className="title">Your cart</h1>
      <div className="cartwrap">
        <ul className="lines">
          {lines.map((l) => (
            <li key={l.id}>
              <Tile p={l} />
              <div className="grow">
                <Link to={`/product/${l.id}`} className="name">{l.name}</Link>
                <span className="muted">{peso(l.price)} each</span>
                <button className="link" onClick={() => removeItem(l.id)}>Remove</button>
              </div>
              <Qty value={l.qty} onChange={(q) => updateQty(l.id, q)} />
              <strong className="lt">{peso(l.price * l.qty)}</strong>
            </li>
          ))}
        </ul>
        <Summary subtotal={subtotal} shipping={shipping} total={total}>
          <Link to="/checkout" className="btn block">Go to checkout</Link>
        </Summary>
      </div>
    </>
  );
}

function Summary({ subtotal, shipping, total, children }) {
  return (
    <aside className="summary">
      <h2>Order summary</h2>
      <div className="row"><span>Subtotal</span><span>{peso(subtotal)}</span></div>
      <div className="row"><span>Shipping</span><span>{shipping ? peso(shipping) : "Free"}</span></div>
      {shipping > 0 && <p className="muted">Free shipping on orders over {peso(FREE_OVER)}.</p>}
      <div className="row total"><span>Total</span><span>{peso(total)}</span></div>
      {children}
    </aside>
  );
}

/* ---------- Checkout ---------- */
const EMPTY = { name: "", email: "", phone: "", address: "", payment: "" };

function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = "Enter your full name.";
  else if (v.name.trim().split(/\s+/).length < 2) e.name = "Enter your first and last name.";
  else if (!/^[\p{L}\s.'-]+$/u.test(v.name.trim())) e.name = "Use letters only in your name.";
  if (!v.email.trim()) e.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Enter a valid email, like name@example.com.";
  if (!v.phone.trim()) e.phone = "Enter your phone number.";
  else if (!/^(09|\+639)\d{9}$/.test(v.phone.replace(/[\s-]/g, ""))) e.phone = "Use a Philippine mobile number, like 0917 123 4567.";
  if (!v.address.trim()) e.address = "Enter your delivery address.";
  else if (v.address.trim().length < 10) e.address = "Add more detail: street, barangay and city.";
  if (!v.payment) e.payment = "Choose a payment method.";
  return e;
}

export function Checkout({ cart, placeOrder, orders }) {
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [done, setDone] = useState(null);
  const { lines, subtotal, shipping, total } = totals(cart);
  const errors = validate(values);
  const show = (k) => touched[k] && errors[k];

  const set = (k) => (e) => setValues({ ...values, [k]: e.target.value });
  const blur = (k) => () => setTouched({ ...touched, [k]: true });

  const submit = (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, address: true, payment: true });
    if (Object.keys(errors).length || !lines.length) return;
    const order = {
      ref: "MS-" + String(1001 + orders.length),
      customer: { ...values }, lines, subtotal, shipping, total,
    };
    placeOrder(order);
    setDone(order);
    setValues(EMPTY);
    setTouched({});
  };

  if (done)
    return (
      <section className="done">
        <h1>Order placed</h1>
        <p>Thank you, {done.customer.name.split(" ")[0]}. Your order <strong>{done.ref}</strong> is confirmed.</p>
        <p className="muted">
          {done.lines.reduce((n, l) => n + l.qty, 0)} items · {peso(done.total)} · {done.customer.payment}
          <br />A confirmation will be sent to {done.customer.email}.
        </p>
        <Link to="/" className="btn">Keep shopping</Link>
      </section>
    );

  if (!lines.length)
    return <p className="empty">Nothing to check out yet. <Link to="/">Add products to your cart</Link></p>;

  const Field = ({ k, label, type = "text", ...rest }) => (
    <label className={"field" + (show(k) ? " bad" : "")}>
      <span>{label}</span>
      <input type={type} value={values[k]} onChange={set(k)} onBlur={blur(k)}
        aria-invalid={!!show(k)} {...rest} />
      {show(k) && <small role="alert">{errors[k]}</small>}
    </label>
  );

  return (
    <>
      <h1 className="title">Checkout</h1>
      <div className="cartwrap">
        <form onSubmit={submit} noValidate className="form">
          {Field({ k: "name", label: "Full name", autoComplete: "name" })}
          {Field({ k: "email", label: "Email", type: "email", autoComplete: "email" })}
          {Field({ k: "phone", label: "Phone number", type: "tel", placeholder: "0917 123 4567", autoComplete: "tel" })}
          <label className={"field" + (show("address") ? " bad" : "")}>
            <span>Delivery address</span>
            <textarea rows="3" value={values.address} onChange={set("address")} onBlur={blur("address")}
              aria-invalid={!!show("address")} placeholder="House no., street, barangay, city, province" />
            {show("address") && <small role="alert">{errors.address}</small>}
          </label>
          <fieldset className={show("payment") ? "bad" : ""}>
            <legend>Payment method</legend>
            {["Cash on delivery", "GCash", "Credit / debit card"].map((m) => (
              <label key={m} className="radio">
                <input type="radio" name="payment" value={m} checked={values.payment === m}
                  onChange={set("payment")} onBlur={blur("payment")} /> {m}
              </label>
            ))}
            {show("payment") && <small role="alert">{errors.payment}</small>}
          </fieldset>
          <button className="btn block" type="submit">Place order · {peso(total)}</button>
        </form>
        <Summary subtotal={subtotal} shipping={shipping} total={total}>
          <ul className="mini">
            {lines.map((l) => <li key={l.id}><span>{l.qty} × {l.name}</span><span>{peso(l.price * l.qty)}</span></li>)}
          </ul>
        </Summary>
      </div>
    </>
  );
}
