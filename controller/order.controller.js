import { createWhatsAppMessage } from "../utils/gerarMensagen.js";
import { calcularDistancia } from "../services/distance.services.js";

// 📍 coordenada da sua loja (ajusta depois)
const loja = {
  lat: -24.239939,
  lng: -46.894231
};

export const createOrder = (req, res) => {
  try {
    // 🔥 NOVO: entrega e pagamento
    const { orderItems, user, total, lat, lng, entrega, pagamento } = req.body;

    // valida se veio localização
    if (!lat || !lng) {
      return res.status(400).json({
        erro: "Precisamos da sua localização 📍"
      });
    }

    // calcula distância
    const distancia = calcularDistancia(
      lat,
      lng,
      loja.lat,
      loja.lng
    );

    // 🔥 BLOQUEIO SOMENTE PARA ENTREGA
    if (distancia > 3 && entrega === "Entrega") {
      return res.status(403).json({
        erro: `Fora da área de entrega, atendemos no máximo (3km). Você está a ${distancia.toFixed(2)} km 🚫`
      });
    }

    // fluxo normal (agora com entrega e pagamento)
    const message = createWhatsAppMessage({
      orderItems,
      user,
      total,
      entrega,
      pagamento
    });

    const phoneNumber = "5513996792155";
    const encodedMessage = encodeURIComponent(message);

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    return res.json({
      whatsappUrl,
      distancia: distancia.toFixed(2) + " km"
    });

  } catch (err) {
    return res.status(500).json({
      erro: err.message
    });
  }
};