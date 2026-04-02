if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js")
    .then(() => console.log("PWA funcionando 🚀"))
    .catch(err => console.log("Erro:", err));
}