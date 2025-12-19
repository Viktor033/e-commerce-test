// js/ui_carrito.js
import { loadCarrito, saveCarrito } from "./storage.js";
import { calcularTotal } from "./carrito.js";
import { generarMensajeWhatsApp, enviarWhatsApp } from "./Whatsapp.js";

let productoSeleccionado = null;

/* =========================
   BADGE
========================= */
export function actualizarBadge() {
  const badge = document.getElementById("carritoBadge");
  if (!badge) return;

  const carrito = loadCarrito();
  const total = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  badge.textContent = total;
}

/* =========================
   RENDER CARRITO
========================= */
export function renderCarrito() {
  const lista = document.getElementById("listaCarrito");
  const totalSpan = document.getElementById("totalCarrito");
  if (!lista || !totalSpan) return;

  const carrito = loadCarrito();
  lista.innerHTML = "";

  if (carrito.length === 0) {
    lista.innerHTML = `
      <li class="list-group-item text-center text-muted">
        Tu carrito está vacío 🛒
      </li>
    `;
    totalSpan.textContent = 0;
    actualizarBadge();
    return;
  }

  let total = 0;

  carrito.forEach(item => {
    total += item.precio * item.cantidad;

    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center carrito-item";

    li.innerHTML = `
      <div>
        <strong>${item.nombre}</strong><br>
        $${item.precio} × ${item.cantidad}
      </div>
      <button class="btn btn-sm btn-danger">Eliminar</button>
    `;

    li.querySelector("button").addEventListener("click", () => {
      productoSeleccionado = item.nombre;

      document.getElementById("textoEliminarCantidad").innerHTML = `
        <strong>${item.nombre}</strong><br>
        Cantidad en carrito: ${item.cantidad}
      `;

      const input = document.getElementById("inputCantidadEliminar");
      input.value = 1;
      input.min = 1;
      input.max = item.cantidad;

      new bootstrap.Modal(
        document.getElementById("modalEliminarCantidad")
      ).show();
    });

    lista.appendChild(li);
  });

  totalSpan.textContent = total;
  actualizarBadge();
}

/* =========================
   CONFIRMAR ELIMINACIÓN
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const btnConfirmar = document.getElementById("btnConfirmarEliminar");
  if (!btnConfirmar) return;

  btnConfirmar.addEventListener("click", () => {
    if (!productoSeleccionado) return;

    let carrito = loadCarrito();
    const input = document.getElementById("inputCantidadEliminar");
    let cantidadEliminar = parseInt(input.value, 10);

    const producto = carrito.find(p => p.nombre === productoSeleccionado);
    if (!producto) return;

    cantidadEliminar = Math.min(
      Math.max(cantidadEliminar, 1),
      producto.cantidad
    );

    producto.cantidad -= cantidadEliminar;

    if (producto.cantidad <= 0) {
      carrito = carrito.filter(p => p.nombre !== productoSeleccionado);
    }

    saveCarrito(carrito);
    productoSeleccionado = null;

    renderCarrito();

    bootstrap.Modal.getInstance(
      document.getElementById("modalEliminarCantidad")
    ).hide();
  });
});

/* =========================
   RESUMEN DE COMPRA
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const carrito = loadCarrito();
    if (carrito.length === 0) return;

    const listaResumen = document.getElementById("resumenProductos");
    const totalSpan = document.getElementById("resumenTotal");
    const metodoSpan = document.getElementById("resumenMetodoPago");

    listaResumen.innerHTML = "";

    carrito.forEach(item => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between";
      li.innerHTML = `
        <span>${item.nombre} × ${item.cantidad}</span>
        <strong>$${item.precio * item.cantidad}</strong>
      `;
      listaResumen.appendChild(li);
    });

    const total = calcularTotal(carrito);
    totalSpan.textContent = total;

    const metodo =
      document.querySelector('input[name="metodoPago"]:checked')
        ?.nextElementSibling.textContent || "No seleccionado";

    metodoSpan.textContent = metodo;

    new bootstrap.Modal(
      document.getElementById("modalResumenCompra")
    ).show();
  });
});

/* =========================
   CONFIRMAR COMPRA FINAL
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const btnFinal = document.getElementById("btnConfirmarCompraFinal");
  if (!btnFinal) return;

  btnFinal.addEventListener("click", () => {
    const carrito = loadCarrito();
    if (carrito.length === 0) return;

    const total = calcularTotal(carrito);
    const metodoPago =
      document.querySelector('input[name="metodoPago"]:checked')
        ?.nextElementSibling.textContent || "No especificado";

    const mensaje = generarMensajeWhatsApp(carrito, total, metodoPago);
    enviarWhatsApp(mensaje);

    saveCarrito([]);
    actualizarBadge();
    renderCarrito();

    bootstrap.Modal.getInstance(
      document.getElementById("modalResumenCompra")
    ).hide();

    new bootstrap.Modal(
      document.getElementById("modalCompraRealizada")
    ).show();
  });
});

/* =========================
   VACIAR CARRITO
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const btnVaciar = document.getElementById("btnVaciarCarrito");
  const btnConfirmar = document.getElementById("btnConfirmarVaciar");

  if (!btnVaciar || !btnConfirmar) return;

  const modalVaciar = new bootstrap.Modal(
    document.getElementById("modalVaciarCarrito")
  );

  const toastVacio = document.getElementById("toastCarritoVacio");
  const toastVaciado = document.getElementById("toastCarritoVaciado");

  btnVaciar.addEventListener("click", () => {
    if (loadCarrito().length === 0) {
      new bootstrap.Toast(toastVacio).show();
      return;
    }
    modalVaciar.show();
  });

  btnConfirmar.addEventListener("click", () => {
    saveCarrito([]);
    renderCarrito();
    actualizarBadge();

    modalVaciar.hide();
    new bootstrap.Toast(toastVaciado).show();
  });
});

/* =========================
   VOLVER AL HOME
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const btnVolver = document.getElementById("btnVolverHome");
  if (!btnVolver) return;

  btnVolver.addEventListener("click", () => {
    window.location.href = "Home.html";
  });
});
