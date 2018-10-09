var appShellCacheVersion = 2;
var appShellCacheName = 'mini-pwa-app-shell-v' + appShellCacheVersion.toString();
var contentDataCacheVersion = 2;
var contentDataCacheName = 'mini-pwa-content-data-v' + contentDataCacheVersion.toString();
var appShellFilesToCache = [
    './',
    './index.html',
    './app.js',
    './apple-touch-icon.png',
    './favicon-16x16.png',
    './favicon-32x32.png',
    './favicon.ico',
    './mstile-150x150.png',
    './safari-pinned-tab.svg',
    './android-chrome-192x192.png',
    './android-chrome-512x512.png'
];

self.addEventListener('activate', function(e) {
    console.log('ServiceWorker Activate');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== appShellCacheName && key !== contentDataCacheName) {
                    console.log('ServiceWorker Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(appShellCacheName).then(function(cache) {
            console.log('ServiceWorker Caching app shell', appShellFilesToCache);
            return cache.addAll(appShellFilesToCache);
        })
    );
});
/*
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
*/

self.addEventListener('fetch', function(event) {
    console.log('ServiceWorker Install', event.request);
    var requestUrl = event.request.url;
    var contentUrl = 'content-data.json';
    if (requestUrl.includes(contentUrl)) {
        event.respondWith(
            caches.match(event.request)
                .then(function(response) {
                    // Cache hit - return response
                    if (response) {
                        return response;
                    }

                    // IMPORTANT: Clone the request. A request is a stream and
                    // can only be consumed once. Since we are consuming this
                    // once by cache and once by the browser for fetch, we need
                    // to clone the response.
                    var fetchRequest = event.request.clone();

                    return fetch(fetchRequest).then(
                        function(response) {
                            // Check if we received a valid response
                            if(!response || response.status !== 200 || response.type !== 'basic') {
                                return response;
                            }

                            // IMPORTANT: Clone the response. A response is a stream
                            // and because we want the browser to consume the response
                            // as well as the cache consuming the response, we need
                            // to clone it so we have two streams.
                            var responseToCache = response.clone();

                            caches.open(contentDataCacheName)
                                .then(function(cache) {
                                    cache.put(event.request, responseToCache);
                                });

                            return response;
                        }
                    );
                })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then(function(response) {
                return response || fetch(event.request);
            })
        );
    }
});

