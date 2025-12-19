import { initProductos } from "./productos.js";
import { actualizarBadge, renderCarrito } from "./ui-carrito.js";
import { loadCarrito } from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {

  /* ==========================
     INIT GENERAL
  ========================== */
  actualizarBadge();

  if (document.querySelector(".btn-agregar")) {
    initProductos();
  }

  if (document.getElementById("listaCarrito")) {
    renderCarrito();
  }

  /* ==========================
     MÉTODOS DE PAGO
  ========================== */
  const transferencia = document.getElementById("transferencia");
  const mercadopago = document.getElementById("mercadoPago");
  const tarjeta = document.getElementById("tarjetaCredito");

  const datosTransferencia = document.getElementById("datosTransferencia");
  const formTarjeta = document.getElementById("formTarjeta");

  function ocultarTodo() {
    datosTransferencia && (datosTransferencia.style.display = "none");
    formTarjeta && (formTarjeta.style.display = "none");
  }

  transferencia?.addEventListener("change", () => {
    ocultarTodo();
    datosTransferencia.style.display = "block";
  });

  mercadopago?.addEventListener("change", ocultarTodo);

  tarjeta?.addEventListener("change", () => {
    ocultarTodo();
    formTarjeta.style.display = "block";
  });

  /* ==========================
     RESUMEN DE COMPRA
  ========================== */
  const btnAbrirResumen = document.getElementById("btnAbrirResumen");

  btnAbrirResumen?.addEventListener("click", () => {
    const carrito = loadCarrito();

    if (carrito.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }

    const listaResumen = document.getElementById("resumenProductos");
    const totalResumen = document.getElementById("resumenTotal");
    const metodoResumen = document.getElementById("resumenMetodoPago");

    listaResumen.innerHTML = "";
    let total = 0;

    carrito.forEach(p => {
      const subtotal = p.precio * p.cantidad;
      total += subtotal;

      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between";

      li.innerHTML = `
        <span>${p.nombre} × ${p.cantidad}</span>
        <strong>$${subtotal}</strong>
      `;

      listaResumen.appendChild(li);
    });

    totalResumen.textContent = total;

    const metodo = document.querySelector('input[name="metodoPago"]:checked');
    metodoResumen.textContent = metodo
      ? metodo.nextElementSibling.textContent
      : "No seleccionado";

    new bootstrap.Modal(
      document.getElementById("modalResumenCompra")
    ).show();
  });

});

/* ==========================
   SOLUCIÓN VOLVER ATRÁS
========================== */
window.addEventListener("pageshow", () => {
  actualizarBadge();

  if (document.getElementById("listaCarrito")) {
    renderCarrito();
  }
});

// 🔝 BOTÓN VOLVER ARRIBA
document.addEventListener("DOMContentLoaded", () => {
  const btnScrollTop = document.getElementById("btnScrollTop");

  if (!btnScrollTop) return;

  // Mostrar / ocultar según scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      btnScrollTop.style.display = "flex";
    } else {
      btnScrollTop.style.display = "none";
    }
  });

  // Subir arriba
  btnScrollTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});





