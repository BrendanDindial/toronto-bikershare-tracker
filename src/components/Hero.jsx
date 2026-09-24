// HERO: Toronto skyline photo behind a dark gradient (set via CSS), content
// sits in a centered max-width column on top.
export default function Hero() {
  return (
    <header className="hero">
      <div className="hero-inner">
        <p className="eyebrow">🚲&nbsp; LIVE CITYWIDE DATA · TORONTO</p>

        <h1 className="headline">
          Real-time bike share
          <br />
          availability, <span className="gradient-text">all over the city.</span>
        </h1>

        <div className="divider"></div>

        <p className="intro">
          Live bike, e-bike, and dock counts for every Bike Share Toronto station, pulled
          straight from the city's public GBFS feed. No more guessing if a station is empty before you get
          there.
        </p>

        <div className="hero-actions">
          <a className="btn btn-primary" href="#current-station-availability">
            View Live Stations
          </a>
          <a
            className="btn btn-secondary"
            href="https://github.com/BrendanDindial"
            target="_blank"
            rel="noopener"
          >
            View Source
          </a>
        </div>
      </div>
    </header>
  );
}
