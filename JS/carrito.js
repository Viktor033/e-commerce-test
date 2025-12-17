// JS/carrito.js
import { saveCarrito } from "./storage.js";

export function agregarProducto(carrito, producto) {
  const existente = carrito.find(p => p.id === producto.id);

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  saveCarrito(carrito);
}

export function calcularTotal(carrito) {
  return carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );
}
