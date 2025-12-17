// JS/productos.js
import { loadCarrito, saveCarrito } from "./storage.js";
import { actualizarBadge } from "./ui-carrito.js";

export function initProductos() {
  const botones = document.querySelectorAll(".btn-agregar");

  botones.forEach(boton => {
    boton.addEventListener("click", () => {

      // ✅ Cargar carrito ACTUAL en cada click
      let carrito = loadCarrito();

      const nombre = boton.dataset.nombre;
      const precio = parseFloat(boton.dataset.precio);

      const existente = carrito.find(p => p.nombre === nombre);

      if (existente) {
        existente.cantidad++;
      } else {
        carrito.push({
          nombre,
          precio,
          cantidad: 1
        });
      }

      saveCarrito(carrito);
      actualizarBadge();

      // 🔔 Toast feedback
      const toastEl = document.getElementById("toastCarrito");
      if (toastEl) {
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
      }
    });
  });
}
