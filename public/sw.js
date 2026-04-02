const CACHE_NAME = "casa-mamae-v1";

const urlsToCache = [
  "/",
  "/login.html",
  "/index.html",
  "cardapio.html",
  "carrinho.html",
  "/stile.css",
  "/icons/icon-192.png"
];

// instala
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// ativa
self.addEventListener("activate", event => {
  console.log("Service Worker ativo");
});

// intercepta requisições
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});