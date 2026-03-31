export function createWhatsAppMessage({ orderItems, user, total, entrega, pagamento }) {

    let message = `🛒 Novo Pedido\n\n`;

    message += `👤 Cliente: ${user.username}\n`;
    message += `📞 Telefone: ${user.fone}\n`;
    message += `📍 Endereço: ${user.endereco}\n\n`;

    message += `📦 Itens do pedido:\n`;

    orderItems.forEach(item => {
        const subtotal = item.price * item.quantity;

        message += `- ${item.name} x${item.quantity} - R$ ${subtotal.toFixed(2)}\n`;
    });

    message += `\n💰 Total: R$ ${Number(total).toFixed(2)}\n`;

    // 🔥 NOVO (ESSENCIAL)
    message += `\n🚚 Entrega: ${entrega}`;
    message += `\n💳 Pagamento: ${pagamento}`;

    return message;
}