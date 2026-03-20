
const cartContainer = document.getElementById("cart-items");
const totalElement = document.getElementById("total");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let user = JSON.parse(localStorage.getItem("user"));

function renderCart() {

    cartContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Seu carrinho está vazio.</p>";
        totalElement.innerText = "";
        return;
    }

    cart.forEach(item => {

        const subtotal = item.price * item.quantity;
        total += subtotal;

        cartContainer.innerHTML += `
            <p>
                ${item.name} - 
                Quantidade: ${item.quantity} - 
                Total: R$ ${subtotal.toFixed(2)}
            </p>
        `;
    });

    totalElement.innerText = "Total geral: R$ " + total.toFixed(2);
}

renderCart();

function finalizarPedido() {

    if (cart.length === 0) {
        alert("Seu carrinho está vazio.");
        return;
    }

    if (!user) {
        alert("Você precisa estar logado para finalizar o pedido.");
        return;
    }

    //  Calcula o total 
    let total = cart.reduce((acc, item) => {
        const price = Number(item.price);
        const quantity = Number(item.quantity);
        return acc + (price * quantity);
    }, 0);

    fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            orderItems: cart,
            user: user,
            total: total
        })
    })
    .then(async response => {

        if (!response.ok) {
            const text = await response.text();
            console.log("Erro do servidor:", text);
            throw new Error("Erro no servidor");
        }

        return response.json();
    })
    .then(data => {

        localStorage.removeItem("cart");
        window.location.href = data.whatsappUrl;
    })
    .catch(error => {
        console.error("Erro:", error);
        alert("Erro ao enviar pedido. Veja o console.");
    });
}document.getElementById("btnFinalizar") .addEventListener("click", finalizarPedido);



document.getElementById("btnLimpar").addEventListener("click", limparCarrinho);


function limparCarrinho() {
    localStorage.removeItem("cart");  // remove todo o carrinho
    cart = [];                        // limpa a variável local
    renderCart();                      // atualiza a tela
     updateCartCount(); 
}
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
});