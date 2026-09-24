export const STATION_INFO_URL =
  "https://tor.publicbikesystem.net/ube/gbfs/v1/en/station_information";
export const STATION_STATUS_URL =
  "https://tor.publicbikesystem.net/ube/gbfs/v1/en/station_status";

// tor.publicbikesystem.net doesn't send back the CORS header
// (Access-Control-Allow-Origin) that browsers require for cross-origin
// fetches. It's not a bug on our end - the feed just isn't set up to be
// called directly from client-side JS. The fix without standing up our
// own backend: route the request through a public CORS proxy, which
// fetches the data server-side and hands it back WITH the CORS header
// attached. allorigins.win is a common, free one used for exactly this.
export const CORS_PROXY = "https://api.allorigins.win/raw?url=";

export const REFRESH_INTERVAL_MS = 30000; // 30 seconds, matches how often the feed itself actually updates
export const PAGE_SIZE = 24; // how many station cards to show at a time
export const MAX_RETRY_DELAY_MS = 30000; // don't let the retry backoff grow forever if the feed is really down

// These tags show up in every station's "groups" list but they're not
// actual neighbourhood names (they're compass quadrants / program tags),
// so we skip them when figuring out which neighbourhood to show.
export const IGNORED_GROUP_TAGS = [
  "north",
  "south",
  "east",
  "west",
  "valet stations",
  "e-charging",
];
