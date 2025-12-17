// JS/storage.js
export function loadCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Normalizar productos antiguos (sin cantidad)
  return carrito.map(item => ({
    ...item,
    cantidad: item.cantidad ?? 1
  }));
}

export function saveCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}
