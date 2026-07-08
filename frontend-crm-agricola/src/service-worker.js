import { clientsClaim } from 'workbox-core';
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from 'workbox-precaching';
import { NavigationRoute, registerRoute, setCatchHandler } from 'workbox-routing';
import { NetworkOnly } from 'workbox-strategies';

const APP_SHELL_URL = '/index.html';
const ONLINE_CHECK_PARAM = 'pwa-online-check';

self.skipWaiting();
clientsClaim();

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST || []);

registerRoute(
  ({ request, url }) =>
    request.method === 'GET' &&
    url.origin === self.location.origin &&
    url.searchParams.has(ONLINE_CHECK_PARAM),
  new NetworkOnly()
);

registerRoute(
  new NavigationRoute(createHandlerBoundToURL(APP_SHELL_URL), {
    denylist: [/^\/api(?:\/|$)/, /^\/auth(?:\/|$)/],
  })
);

setCatchHandler(async ({ event }) => {
  if (event.request.mode === 'navigate') {
    const cachedShell = await caches.match(APP_SHELL_URL);

    if (cachedShell) {
      return cachedShell;
    }
  }

  return Response.error();
});
