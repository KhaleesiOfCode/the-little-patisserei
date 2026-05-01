"use client";

import { useCart } from "./CartContext";

export default function ProductCard({ product }: any) {
  const { cart, addToCart, updateQty } = useCart();

  const itemInCart = cart.find((item: any) => item.id === product.id);

  return (
    <article className="rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-[#F4CFC8] transition hover:-translate-y-1 hover:shadow-lg">
      
      {/* IMAGE */}
      <div className="aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[#FDB978]">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>
    
      {/* CONTENT */}
      <div className="pt-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-[#3A2A2A]">
            {product.name}
          </h3>
        </div>

        <p className="text-sm leading-6 text-[#7A6262]">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <p className="font-bold text-[#F08C9B]">
            ₹{product.price}
          </p>

          {/* BUTTON / STEPPER */}
          {!itemInCart ? (
            <button
              onClick={() => addToCart(product)}
              className="rounded-full bg-[#F08C9B] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#E77E8D]"
            >
              Add
            </button>
          ) : (
            <div className="flex items-center rounded-full border border-[#F08C9B]">
              <button
                onClick={() =>
                  updateQty(product.id, itemInCart.qty - 1)
                }
                className="px-3 text-[#F08C9B]"
              >
                −
              </button>

              <span className="px-3 text-sm font-semibold text-[#3A2A2A]">
                {itemInCart.qty}
              </span>

              <button
                onClick={() =>
                  updateQty(product.id, itemInCart.qty + 1)
                }
                className="px-3 text-[#F08C9B]"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}