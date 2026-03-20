import { createWhatsAppMessage } from "../utils/gerarMensagen.js";

export const createOrder = (req, res) => {

    const { orderItems, user, total } = req.body;

    const message = createWhatsAppMessage({
        orderItems,
        user,
        total
    });

    const phoneNumber = "5513996792155";

    const encodedMessage = encodeURIComponent(message);

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    res.json({ whatsappUrl });
};