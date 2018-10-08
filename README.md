# Minimalistic PWA example

### Development
Use `npm start` to serve the public folder.

### Agenda
* Setup with favicon generator
* Register ServiceWorker
* install Event
    * cache.addAll() if any fails all fail
* activate Event
* fetch Event 
* Optional: fetch with dynamic data (network then cache strategy)

### Manifest
```json
{
  "name": "Minimalistic PWA example",
  "short_name": "Mini PWA",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#ffffff",
  "background_color":"#ffffff",
  "icons": [
    {
      "src": "img/logo-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }]
}
```

### Minimal Service Worker
```html
<script>
  if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
  }
</script>
```

```js
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('sw-cache').then(function(cache) {
      return cache.add('index.html');
    })
  );
});
 
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
```

### Related Documentations and Tools
* [A minimal PWA](https://mobiforge.com/design-development/pwa-minimus-a-minimal-pwa-checklist)
* [Favicon Generator](https://realfavicongenerator.net/)
* [W3C Web App Manifest](https://www.w3.org/TR/appmanifest/)
* [Tutorial: Your First Progressive Web App from Google](https://developers.google.com/web/fundamentals/codelabs/your-first-pwapp/)

### Go further
* [Further reading: Mozilla's The Service Worker Cookbook](https://serviceworke.rs)
* [Workbox](https://developers.google.com/web/tools/workbox/)
