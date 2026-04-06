// background.js — Manifest V3 service worker
// Acts as a shared token store so the content script can access the Factify
// JWT from any page, not just the React app's own origin.

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "FACTIFY_SET_TOKEN") {
    // Store/update the access token (and optional refresh token) received
    // from the content script running on the React app's origin.
    chrome.storage.local.set(
      {
        factify_token: msg.token || null,
        factify_refresh: msg.refresh || null,
      },
      () => sendResponse({ ok: true })
    );
    return true; // keep channel open for async sendResponse
  }

  if (msg.type === "FACTIFY_GET_TOKEN") {
    // Any content script can ask for the cached token.
    chrome.storage.local.get(["factify_token"], (result) => {
      sendResponse({ token: result.factify_token || null });
    });
    return true;
  }

  if (msg.type === "FACTIFY_CLEAR_TOKEN") {
    // Called when the user logs out on the React app page.
    chrome.storage.local.remove(["factify_token", "factify_refresh"], () =>
      sendResponse({ ok: true })
    );
    return true;
  }
});
