importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');
if (workbox) {
  workbox.core.setCacheNameDetails({prefix:'wainex', suffix:'ultra-v2'});
  workbox.core.clientsClaim();
  workbox.core.skipWaiting();
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);
  workbox.routing.registerRoute(
    ({request}) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({cacheName: 'html'})
  );
  workbox.routing.registerRoute(
    ({url}) => url.origin === location.origin && /\.(?:png|svg|ico|webp|jpg|jpeg|css|js)$/.test(url.pathname),
    new workbox.strategies.StaleWhileRevalidate({ cacheName: 'static' })
  );
  workbox.routing.registerRoute(
    ({url}) => /(esm.sh|unpkg.com|cdn\.tailwindcss\.com|storage\.googleapis\.com|cdn\.skypack\.dev)/.test(url.hostname),
    new workbox.strategies.StaleWhileRevalidate({ cacheName: 'cdn' })
  );
}
