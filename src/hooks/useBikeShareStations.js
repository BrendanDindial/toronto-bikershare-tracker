import { useCallback, useEffect, useRef, useState } from "react";
import {
  STATION_INFO_URL,
  STATION_STATUS_URL,
  REFRESH_INTERVAL_MS,
  MAX_RETRY_DELAY_MS,
} from "../constants";
import { fetchJSON } from "../utils/fetchJSON";
import { pickNeighbourhood, buildStationRecord } from "../utils/stationHelpers";

// Encapsulates the two-step GBFS load: station_information once on mount
// (names/locations/capacity, which basically never change), then
// station_status re-fetched every 30 seconds (live bike/dock counts).
// If the very first load fails, it keeps retrying the whole startup
// sequence on a timer instead of leaving the page stuck broken.
export function useBikeShareStations() {
  const stationInfoById = useRef(new Map());

  const [stations, setStations] = useState([]);
  const [neighbourhoods, setNeighbourhoods] = useState([]);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadStationInfo = useCallback(async () => {
    const payload = await fetchJSON(STATION_INFO_URL);

    payload.data.stations.forEach((station) => {
      stationInfoById.current.set(station.station_id, {
        id: station.station_id,
        name: station.name.trim(),
        address: station.address || "",
        capacity: station.capacity,
        neighbourhood: pickNeighbourhood(station.groups),
      });
    });

    // Now that we know all the neighbourhoods that exist, expose them
    // sorted alphabetically for the dropdown.
    const unique = new Set();
    stationInfoById.current.forEach((s) => unique.add(s.neighbourhood));
    setNeighbourhoods(Array.from(unique).sort());
  }, []);

  const refreshStationStatus = useCallback(async () => {
    const payload = await fetchJSON(STATION_STATUS_URL);

    const merged = payload.data.stations
      .map((status) => buildStationRecord(status, stationInfoById.current))
      .filter(Boolean); // drop stations we didn't have info for

    setStations(merged);
    setError(false);
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    let intervalId;
    let retryId;
    let cancelled = false;

    async function init() {
      try {
        await loadStationInfo(); // load the static data first
        if (cancelled) return;
        await refreshStationStatus(); // then the live data, so the first render has both
      } catch (err) {
        // Most likely a network hiccup, or the feed (and its proxy fallback)
        // being temporarily down. Show the error and keep retrying the
        // whole startup sequence instead of leaving the page stuck.
        console.error("Initial load failed, will keep retrying:", err);
        if (cancelled) return;
        setError(true);
        retryId = setTimeout(init, MAX_RETRY_DELAY_MS);
        return;
      }

      if (cancelled) return;

      // keep the live data refreshing in the background
      intervalId = setInterval(() => {
        refreshStationStatus().catch((err) => {
          console.error("Couldn't fetch station status:", err);
          setError(true);
        });
      }, REFRESH_INTERVAL_MS);
    }

    init();

    return () => {
      cancelled = true;
      clearInterval(intervalId);
      clearTimeout(retryId);
    };
  }, [loadStationInfo, refreshStationStatus]);

  return { stations, neighbourhoods, error, lastUpdated };
}
