// JS/carrito.js
export function agregarProducto(carrito, producto) {
  const existente = carrito.find(p => p.id === producto.id);

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  return carrito;
}

export function calcularTotal(carrito) {
  return carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );
}
