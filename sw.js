// Service worker: pre-cache core files, network-first pages, cache-first assets
const CACHE = "tifas-space-v4";
const CORE = [
  "./",
  "index.html",
  "interests.html",
  "contact.html",
  "offline.html",
  "css/style.css",
  "js/main.js",
  "data.json",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "fonts/Rubik.ttf",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) =>
        c.addAll(CORE).then(() => c.add("photo/photo.jpg").catch(() => {})),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const keep = (res) => {
    if (res && (res.ok || res.type === "opaque")) {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
    }
    return res;
  };
  if (req.mode === "navigate") {
    // Pages: try network, then cache, then the offline page for never-visited addresses
    e.respondWith(
      fetch(req)
        .then(keep)
        .catch(() =>
          caches
            .match(req, { ignoreSearch: true })
            .then((hit) => hit || caches.match("offline.html")),
        ),
    );
  } else {
    e.respondWith(
      fetch(req)
        .then(keep)
        .catch(() => caches.match(req)),
    );
  }
});
