const cartContainer = document.getElementById("cart-items");
const totalElement = document.getElementById("total");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let user = JSON.parse(localStorage.getItem("user"));

// ✅ ADICIONADO (não altera nada existente)
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const totalItens = cart.reduce((acc, item) => acc + item.quantity, 0);

    const contador = document.getElementById("cart-count");

    if (contador) {
        contador.innerText = totalItens;
    }
}

// ✅ pegar opção selecionada (radio)
function pegarOpcaoSelecionada(nome) {
    const opcao = document.querySelector(`input[name="${nome}"]:checked`);
    return opcao ? opcao.value : null;
}

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

    // ✅ já estava certo (não mexi)
    const entrega = pegarOpcaoSelecionada("entrega");
    const pagamento = pegarOpcaoSelecionada("pagamento");

    if (!entrega || !pagamento) {
        alert("Escolha entrega e forma de pagamento.");
        return;
    }

    let total = cart.reduce((acc, item) => {
        const price = Number(item.price);
        const quantity = Number(item.quantity);
        return acc + (price * quantity);
    }, 0);

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
                entrega: entrega,
                pagamento: pagamento,
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
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
            alert("Erro ao enviar pedido.");
        });

    }, () => {
        alert("Precisamos da sua localização para continuar 📍");
    });
}

// botão finalizar
document.getElementById("btnFinalizar").addEventListener("click", finalizarPedido);

// limpar carrinho
function limparCarrinho() {
    localStorage.removeItem("cart");
    cart = [];
    renderCart();
    updateCartCount(); // já existia → mantido
}

// botão limpar
const btnLimpar = document.getElementById("btnLimpar");
if (btnLimpar) {
    btnLimpar.addEventListener("click", limparCarrinho);
}

// carregar contador
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount(); // já existia → mantido
});