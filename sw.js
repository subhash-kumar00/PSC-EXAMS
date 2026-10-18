const CACHE_NAME = 'sk-psc-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// 🌟 പുഷ് നോട്ടിഫിക്കേഷൻ കാണിക്കാനുള്ള ലിസണർ
self.addEventListener('push', (event) => {
  let data = { title: 'SK PSC Alert', body: 'പുതിയ അറിയിപ്പ് വന്നിട്ടുണ്ട്!' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch(e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: 'https://raw.githubusercontent.com/subhash-kumar00/PSC-EXAMS/main/logo.png',
    badge: 'https://raw.githubusercontent.com/subhash-kumar00/PSC-EXAMS/main/logo.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || 'index.html' }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// നോട്ടിഫിക്കേഷനിൽ ക്ലിക്ക് ചെയ്താൽ ആപ്പ് ഓപ്പൺ ആകാൻ
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : 'index.html';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('index.html') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
