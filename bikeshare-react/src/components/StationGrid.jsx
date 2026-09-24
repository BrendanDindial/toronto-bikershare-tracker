import StationCard from "./StationCard";

export default function StationGrid({ stations }) {
  if (stations.length === 0) {
    return (
      <div className="stations-grid">
        <p className="no-results">No stations match your search.</p>
      </div>
    );
  }

  return (
    <div className="stations-grid">
      {stations.map((station) => (
        <StationCard key={station.id} station={station} />
      ))}
    </div>
  );
}
