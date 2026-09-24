import { CORS_PROXY } from "../constants";

// Fetches a URL and returns the parsed JSON. Tries the direct request
// first (in case the feed ever adds proper CORS support, or this runs
// somewhere the browser rule doesn't apply), and if that fails, falls
// back to going through the CORS proxy instead of just giving up.
export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (directErr) {
    const proxied = await fetch(CORS_PROXY + encodeURIComponent(url));
    if (!proxied.ok) throw new Error(`Proxy request failed: HTTP ${proxied.status}`);
    return await proxied.json();
  }
}
