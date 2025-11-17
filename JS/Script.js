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
    document.getElementById("btnConfirmarCompra").addEventListener("click", () => {
      const cantidadProductos = carrito.length;
      const total = carrito.reduce((acc, item) => acc + item.precio, 0);
      const nombres = carrito.map(item => item.nombre).join(", ");

      mensajeCompra.innerHTML = `
        <div class="alert alert-success" role="alert">
          ✅ ¡Compra confirmada!<br>
          ${cantidadProductos} producto(s) – Total: $${total}<br>
          <small>${nombres}</small>
        </div>
      `;

      carrito = [];
      guardarCarrito();
      renderCarrito();
      bootstrap.Modal.getInstance(document.getElementById("modalConfirmarCompra")).hide();
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
