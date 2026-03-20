export function createWhatsAppMessage({ orderItems, user, total }) {

    let message = `Novo Pedido\n\n`;

    message += `Cliente: ${user.username}\n`;
    message += `Telefone: ${user.fone}\n`;
    message += `Endereço: ${user.endereco}\n\n`;

    message += `Itens do pedido:\n`;

    orderItems.forEach(item => {
        message += `- ${item.name} x${item.quantity} - R$ ${item.price}\n`;
    });

  message += `\nTotal da compra: R$ ${Number(total).toFixed(2)}\n`;

    return message;
}