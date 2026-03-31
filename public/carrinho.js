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

    // Calcula o total 
    let total = cart.reduce((acc, item) => {
        const price = Number(item.price);
        const quantity = Number(item.quantity);
        return acc + (price * quantity);
    }, 0);

    // 📍 NOVO: pegar localização antes do fetch
    navigator.geolocation.getCurrentPosition((pos) => {

        fetch("/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                orderItems: cart,
                user: user,
                total: total,
                lat: pos.coords.latitude,
                lng: pos.coords.longitude // 🔥 corrigido
            })
        })
        .then(async response => {

            if (!response.ok) {
                const data = await response.json();
                alert(data.erro);
                return;
            }

            return response.json();
        })
        .then(data => {

            if (!data) return;

            localStorage.removeItem("cart");
            window.location.href = data.whatsappUrl;
        })
        .catch(error => {
            console.error("Erro:", error);
            alert("Erro ao enviar pedido. Veja o console.");
        });

    }, () => {
        alert("Precisamos da sua localização para continuar 📍");
        
    });
}

document.getElementById("btnFinalizar").addEventListener("click", finalizarPedido);

document.getElementById("btnLimpar").addEventListener("click", limparCarrinho);

function limparCarrinho() {
    localStorage.removeItem("cart");
    cart = [];
    renderCart();
    updateCartCount(); 
}

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
});