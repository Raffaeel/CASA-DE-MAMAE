const numeroWhatsApp =+13996792155

const mensagem="olá estava no seu site e adorei seus produtos , queria fazer um pedido !";


document.getElementById("pedidoBtn").addEventListener("click", function() {
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhatsApp, "_blank");
});



