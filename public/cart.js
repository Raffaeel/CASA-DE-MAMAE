//  quantidade no card (+ / -)
function alterarQuantidade(botao, valor){
    const card = botao.closest(".card2") || botao.closest(".card");
    const input = card.querySelector(".quantidade");
    let quantidade = Number(input.value);

    quantidade += valor;
    if(quantidade < 1) quantidade = 1;

    input.value = quantidade;
}

// adiciona item ao carrinho
function addToCart(botao, name, price){
    const card = botao.closest(".card2") || botao.closest(".card");
    const quantity = Number(card.querySelector(".quantidade").value);

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // procura item igual (mesmo nome E mesmo preço)
    const existingItem = cart.find(item => item.name === name && item.price === price);

    if(existingItem){
        existingItem.quantity += quantity; // soma a quantidade
    } else {
        cart.push({ name, price, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Atualiza o contador no menu
    updateCartCount();

    // Se estiver na página de carrinho, renderiza os itens
    if(document.getElementById("cart-items")){
        renderCart();
    } ;
}

// renderiza itens do carrinho na tela
function renderCart(){
    const cartContainer = document.getElementById("cart-items");
    const totalElement = document.getElementById("total");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartContainer.innerHTML = "";

    if(cart.length === 0){
        cartContainer.innerHTML = "<p>Seu carrinho está vazio.</p>";
        totalElement.innerText = "";
        updateCartCount();
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item-carrinho");
        itemDiv.innerHTML = `
            <span>${item.name} - R$ ${item.price.toFixed(2)} x ${item.quantity} = R$ ${subtotal.toFixed(2)}</span>
            <button onclick="removerItem(${index})">Remover</button>
        `;
        cartContainer.appendChild(itemDiv);
    });

    totalElement.innerText = `Total geral: R$ ${total.toFixed(2)}`;
}



// limpa todo o carrinho
function limparCarrinho(){
    localStorage.removeItem("cart");
    renderCart();
    updateCartCount();
}

// atualiza contador no menu
function updateCartCount(){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartCountElement = document.getElementById("cart-count");
    if(cartCountElement){
        cartCountElement.innerText = totalQuantity > 0 ? totalQuantity : '';
    }
}

// inicializa ao carregar qualquer página
document.addEventListener("DOMContentLoaded", () => {
   function renderCart (){

    if( updateCartCount()==0){ updateCartCount();}


   }
   
});
