document.addEventListener("DOMContentLoaded", () => {
  const botonesAgregar = document.querySelectorAll(".btn-agregar");
  const carritoBadge = document.getElementById("carritoBadge");

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (carritoBadge) carritoBadge.textContent = carrito.length;

  function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    if (carritoBadge) carritoBadge.textContent = carrito.length;
  }

  botonesAgregar.forEach(boton => {
    boton.addEventListener("click", () => {
      const producto = {
        nombre: boton.dataset.nombre,
        precio: parseFloat(boton.dataset.precio)
      };
      carrito.push(producto);
      guardarCarrito();
    });
  });

  if (document.getElementById("listaCarrito")) {
    const listaCarrito = document.getElementById("listaCarrito");
    const totalCarrito = document.getElementById("totalCarrito");
    const formulario = document.querySelector("form");
    const mensajeCompra = document.getElementById("mensajeCompra");

    let productoAEliminar = null; // referencia temporal

    function renderCarrito() {
      listaCarrito.innerHTML = "";
      let total = 0;

      if (carrito.length === 0) {
        const li = document.createElement("li");
        li.className = "list-group-item text-center text-muted";
        li.textContent = "Tu carrito está vacío 🛒";
        listaCarrito.appendChild(li);
        totalCarrito.textContent = 0;
        return;
      }

      carrito.forEach((item, index) => {
        total += item.precio;
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
          ${item.nombre} - $${item.precio}
          <button class="btn btn-sm btn-danger">Eliminar</button>
        `;
        li.querySelector("button").addEventListener("click", () => {
          productoAEliminar = index;
          document.getElementById("mensajeEliminarProducto").textContent =
            `¿Seguro que quieres eliminar "${item.nombre}" del carrito?`;
          new bootstrap.Modal(document.getElementById("modalEliminarProducto")).show();
        });
        listaCarrito.appendChild(li);
      });

      totalCarrito.textContent = total;
    }

    renderCarrito();

    // Mostrar/ocultar formulario de tarjeta según el método elegido
    const radiosPago = document.querySelectorAll('input[name="metodoPago"]');
    const formTarjeta = document.getElementById("formTarjeta");

    radiosPago.forEach(radio => {
      radio.addEventListener("change", () => {
        if (radio.value === "tarjeta") {
          formTarjeta.style.display = "block";
        } else {
          formTarjeta.style.display = "none";
        }
      });
    });

    // Confirmar compra con modal
    formulario.addEventListener("submit", (e) => {
      e.preventDefault();
      mensajeCompra.innerHTML = "";

      if (carrito.length === 0) {
        mensajeCompra.innerHTML = `
          <div class="alert alert-warning" role="alert">
            ⚠️ El carrito está vacío. Agrega productos antes de confirmar la compra.
          </div>
        `;
        return;
      }

      new bootstrap.Modal(document.getElementById("modalConfirmarCompra")).show();
    });

    // Acción al confirmar compra
    document.getElementById("btnConfirmarCompra").addEventListener("click", async () => {
      const cantidadProductos = carrito.length;
      const total = carrito.reduce((acc, item) => acc + item.precio, 0);
      const nombres = carrito.map(item => item.nombre).join(", ");
      const metodoPago = document.querySelector('input[name="metodoPago"]:checked').value;

      if (metodoPago === "mercadopago") {
        try {
          const preferenciaId = "TEST-PREF-123";

          const mp = new MercadoPago("TU_PUBLIC_KEY", { locale: "es-AR" });
          mp.checkout({
            preference: { id: preferenciaId },
            autoOpen: true
          });

          bootstrap.Modal.getInstance(document.getElementById("modalConfirmarCompra")).hide();
          return;
        } catch (err) {
          mensajeCompra.innerHTML = `
            <div class="alert alert-danger" role="alert">
              ❌ Hubo un problema al iniciar el pago con MercadoPago. Intenta nuevamente.
            </div>
          `;
          return;
        }
      }

      if (metodoPago === "tarjeta") {
        const numero = document.getElementById("numeroTarjeta").value.trim();
        const vencimiento = document.getElementById("vencimientoTarjeta").value.trim();
        const cvv = document.getElementById("cvvTarjeta").value.trim();

        if (!numero || !vencimiento || !cvv) {
          mensajeCompra.innerHTML = `
            <div class="alert alert-warning" role="alert">
              ⚠️ Completá todos los datos de la tarjeta para continuar.
            </div>
          `;
          return;
        }

        mensajeCompra.innerHTML = `
          <div class="alert alert-success" role="alert">
            ✅ ¡Compra confirmada con tarjeta!<br>
            ${cantidadProductos} producto(s) – Total: $${total}<br>
            <small>${nombres}</small>
          </div>
        `;

        carrito = [];
        guardarCarrito();
        renderCarrito();
        bootstrap.Modal.getInstance(document.getElementById("modalConfirmarCompra")).hide();
        return;
      }

      if (metodoPago === "transferencia") {
        const cbu = "1234567890123456789012";
        const alias = "viandas.tienda";
        const whatsapp = "5493791234567"; // número dinámico

        mensajeCompra.innerHTML = `
          <div class="alert alert-info" role="alert">
            📩 Para completar tu compra, realiza una transferencia bancaria:<br>
            <strong>CBU:</strong> <span id="cbuTexto">${cbu}</span>
            <button class="btn btn-sm btn-outline-primary ms-2" id="btnCopiarCBU">Copiar</button><br>
            <strong>Alias:</strong> ${alias}<br>
            <strong>Monto:</strong> $${total}<br>
            <small>${nombres}</small><br><br>
            📲 Envía el comprobante a nuestro WhatsApp: 
            <a href="https://wa.me/${whatsapp}" target="_blank">+${whatsapp}</a>
          </div>
        `;

        // Acción para copiar el CBU al portapapeles
        document.getElementById("btnCopiarCBU").addEventListener("click", () => {
          const cbuTexto = document.getElementById("cbuTexto").textContent;
          navigator.clipboard.writeText(cbuTexto).then(() => {
            alert("✅ CBU copiado al portapapeles");
          });
        });

        carrito = [];
        guardarCarrito();
        renderCarrito();
        bootstrap.Modal.getInstance(document.getElementById("modalConfirmarCompra")).hide();
        return;
      }
    });

    // Acción al confirmar eliminación
    document.getElementById("btnConfirmarEliminar").addEventListener("click", () => {
      if (productoAEliminar !== null) {
        carrito.splice(productoAEliminar, 1);
        guardarCarrito();
        renderCarrito();
        productoAEliminar = null;
      }
      bootstrap.Modal.getInstance(document.getElementById("modalEliminarProducto")).hide();
    });
  }
});
