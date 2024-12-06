"use client";

import { Cart } from "../types/types";

interface CartViewProps {
  cart: Cart;
}

export default function CartView({ cart }: CartViewProps) {
  return (
    <>
      <h1>Cart view</h1>
      <div>
        <h2>Total Price: {cart.total_price}</h2>
        <ul>
          {cart.cart.map((item) => (
            <li key={item.id}>
              <h3>{item.product.name}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>Subtotal: {item.subtotal_price}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
