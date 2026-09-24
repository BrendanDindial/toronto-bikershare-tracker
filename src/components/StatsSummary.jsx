export default function StatsSummary({ stations }) {
  const hasData = stations.length > 0;

  const totalBikes = stations.reduce((sum, s) => sum + s.bikesAvailable, 0);
  const totalEbikes = stations.reduce((sum, s) => sum + s.ebikesAvailable, 0);
  const totalDocks = stations.reduce((sum, s) => sum + s.docksAvailable, 0);

  return (
    <section className="stats-section">
      <div className="stats-summary">
        <div className="stat panel">
          <span className="stat-number">{hasData ? stations.length : "--"}</span>
          <span className="stat-label">Stations Reporting</span>
        </div>
        <div className="stat panel">
          <span className="stat-number">{hasData ? totalBikes : "--"}</span>
          <span className="stat-label">Bikes Available</span>
        </div>
        <div className="stat panel">
          <span className="stat-number">{hasData ? totalEbikes : "--"}</span>
          <span className="stat-label">E-Bikes Available</span>
        </div>
        <div className="stat panel">
          <span className="stat-number">{hasData ? totalDocks : "--"}</span>
          <span className="stat-label">Open Docks</span>
        </div>
      </div>
    </section>
  );
}
