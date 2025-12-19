/* =========================
   CONFIG WHATSAPP
========================= */
const WHATSAPP_NUMERO = "5493794636696"; 

/* =========================
   GENERAR MENSAJE
========================= */
export function generarMensajeWhatsApp(carrito, total, metodoPago) {
  let texto = "🛒 *Nuevo pedido*\n\n";

  carrito.forEach(p => {
    texto += `• ${p.nombre} x${p.cantidad} = $${p.precio * p.cantidad}\n`;
  });

  texto += `\n💰 Total: $${total}`;
  texto += `\n💳 Pago: ${metodoPago}`;

  return encodeURIComponent(texto);
}

/* =========================
   ABRIR WHATSAPP
========================= */
export function enviarWhatsApp(mensaje) {
  window.open(
    `https://wa.me/${WHATSAPP_NUMERO}?text=${mensaje}`,
    "_blank"
  );
}
