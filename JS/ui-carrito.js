import { loadCarrito, saveCarrito } from "./storage.js";

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

    if (cantidadEliminar < 1) cantidadEliminar = 1;
    if (cantidadEliminar > producto.cantidad)
      cantidadEliminar = producto.cantidad;

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
   LOGICA DEL RESUMEN
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const carrito = loadCarrito();
    if (carrito.length === 0) return;

    const listaResumen = document.getElementById("resumenProductos");
    const totalSpan = document.getElementById("resumenTotal");
    const metodoSpan = document.getElementById("resumenMetodoPago");

    listaResumen.innerHTML = "";
    let total = 0;

    carrito.forEach(item => {
      total += item.precio * item.cantidad;

      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between";
      li.innerHTML = `
        <span>${item.nombre} × ${item.cantidad}</span>
        <strong>$${item.precio * item.cantidad}</strong>
      `;
      listaResumen.appendChild(li);
    });

    totalSpan.textContent = total;

    const metodo = document.querySelector(
      'input[name="metodoPago"]:checked'
    )?.nextElementSibling.textContent;

    metodoSpan.textContent = metodo || "No seleccionado";

    new bootstrap.Modal(
      document.getElementById("modalResumenCompra")
    ).show();
  });
});

/* ============================
  CONFIRMACION FINAL DE COMPRA
=============================== */

document.addEventListener("DOMContentLoaded", () => {
  const btnFinal = document.getElementById("btnConfirmarCompraFinal");
  if (!btnFinal) return;

  btnFinal.addEventListener("click", () => {
    // Limpiar carrito
    localStorage.removeItem("carrito");
    actualizarBadge();
    renderCarrito();

    // Cerrar modal resumen
    bootstrap.Modal.getInstance(
      document.getElementById("modalResumenCompra")
    ).hide();

    // Mostrar modal compra realizada
    new bootstrap.Modal(
      document.getElementById("modalCompraRealizada")
    ).show();
  });
});

  /* ========================
  LOGICA MODAL VACIAR CARRITO
============================= */

document.addEventListener("DOMContentLoaded", () => {
  const btnVaciar = document.getElementById("btnVaciarCarrito");
  const btnConfirmar = document.getElementById("btnConfirmarVaciar");

  if (!btnVaciar || !btnConfirmar) return;

  const modalVaciar = new bootstrap.Modal(
    document.getElementById("modalVaciarCarrito")
  );

  // Abrir modal
  btnVaciar.addEventListener("click", () => {
    modalVaciar.show();
  });

  // Confirmar vaciado
  btnConfirmar.addEventListener("click", () => {
    saveCarrito([]);
    renderCarrito();
    actualizarBadge();
    modalVaciar.hide();
  });
});

/* ================
  VOLVER AL INICIO
=================== */
document.addEventListener("DOMContentLoaded", () => {
  const btnVolver = document.getElementById("btnVolverHome");
  if (!btnVolver) return;

  btnVolver.addEventListener("click", () => {
    window.location.href = "Home.html";
  });
});








