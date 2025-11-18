const express = require("express");
const cors = require("cors");
const mercadopago = require("mercadopago");

const app = express();
app.use(cors());
app.use(express.json());

// Configurar credenciales de MercadoPago
mercadopago.configure({
  access_token: "TU_ACCESS_TOKEN" // reemplazalo por tu token real
});

// Endpoint para crear preferencia
app.post("/crear-preferencia", async (req, res) => {
  try {
    const items = req.body.items;

    const preference = {
      items: items.map(item => ({
        title: item.nombre,
        unit_price: item.precio,
        quantity: 1
      })),
      back_urls: {
        success: "http://localhost:3000/success",
        failure: "http://localhost:3000/failure",
        pending: "http://localhost:3000/pending"
      },
      auto_return: "approved"
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Levantar servidor
app.listen(4000, () => {
  console.log("Servidor backend en http://localhost:4000");
});
