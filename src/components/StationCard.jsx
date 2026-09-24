import { availabilityClass, formatRelativeTime } from "../utils/stationHelpers";

export default function StationCard({ station }) {
  return (
    <div className={`station-card panel ${availabilityClass(station)}`}>
      <h3>🚲 {station.name}</h3>
      <p className="neighbourhood-tag">{station.neighbourhood}</p>
      <p className="counts">
        <strong>{station.bikesAvailable}</strong> bikes available
        <span className="total-spots"> / {station.capacity}</span>
      </p>
      <p className="counts-sub">
        {station.mechanicalAvailable} regular · {station.ebikesAvailable} e-bike
      </p>
      <p className="status">{station.docksAvailable} open docks</p>
      <p className="live-time">{formatRelativeTime(station.lastReported)}</p>
    </div>
  );
}
