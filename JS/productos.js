// js/productos.js
import { loadCarrito, saveCarrito } from "./storage.js";
import { actualizarBadge } from "./ui-carrito.js";

export function initProductos() {

  // 🔹 Delegación de eventos (CLAVE PARA MOBILE)
  document.addEventListener("click", (e) => {
    const boton = e.target.closest(".btn-agregar");
    if (!boton) return;

    const carrito = loadCarrito();

    const producto = {
      id: boton.dataset.id,
      nombre: boton.dataset.nombre,
      precio: Number(boton.dataset.precio)
    };

    const existente = carrito.find(p => p.id === producto.id);

    if (existente) {
      existente.cantidad++;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }

    saveCarrito(carrito);
    actualizarBadge();
  });
}
