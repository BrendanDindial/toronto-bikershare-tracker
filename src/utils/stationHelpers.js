import { IGNORED_GROUP_TAGS } from "../constants";

// Picks a human-friendly neighbourhood name out of a station's "groups"
// array. The API throws a bunch of tags in there together (quadrant,
// program flags, actual neighbourhood) so we just filter out the ones
// we know aren't real neighbourhoods and take what's left.
export function pickNeighbourhood(groups) {
  if (!groups || groups.length === 0) return "Other";

  const realNeighbourhoods = groups
    .map((g) => g.trim())
    .filter((g) => !IGNORED_GROUP_TAGS.includes(g.toLowerCase()));

  return realNeighbourhoods[0] || "Other";
}

// Combines one station's live status with its static info into a single
// object that's easier to work with everywhere else.
export function buildStationRecord(status, stationInfoById) {
  const info = stationInfoById.get(status.station_id);
  if (!info) return null;

  // Different feed versions structure the bike-type breakdown a bit
  // differently, so this covers the field names actually seen in use.
  const bikeTypes = status.num_bikes_available_types || {};
  const ebikesAvailable = bikeTypes.ebike ?? status.num_ebikes_available ?? 0;
  const mechanicalAvailable =
    bikeTypes.mechanical ?? status.num_bikes_available - ebikesAvailable;

  return {
    id: status.station_id,
    name: info.name,
    address: info.address,
    neighbourhood: info.neighbourhood,
    capacity: info.capacity,
    bikesAvailable: status.num_bikes_available ?? 0,
    ebikesAvailable,
    mechanicalAvailable: Math.max(mechanicalAvailable, 0),
    docksAvailable: status.num_docks_available ?? 0,
    isRenting: status.is_renting !== 0,
    lastReported: status.last_reported,
  };
}

// Picks a CSS class so the card's left accent bar reflects how many
// bikes are actually available right now.
export function availabilityClass(station) {
  if (!station.isRenting || station.bikesAvailable === 0) return "full";
  if (station.bikesAvailable <= 2) return "low";
  return "available";
}

// Turns the "last_reported" unix timestamp from the API into something
// like "2 min ago" instead of a raw number.
export function formatRelativeTime(unixSeconds) {
  if (!unixSeconds) return "Just now";

  const secondsAgo = Math.floor(Date.now() / 1000 - unixSeconds);
  if (secondsAgo < 60) return "Updated just now";

  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) return `Updated ${minutesAgo} min ago`;

  const hoursAgo = Math.floor(minutesAgo / 60);
  return `Updated ${hoursAgo} hr ago`;
}
