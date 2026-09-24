import { useEffect, useMemo, useState } from "react";
import Hero from "./components/Hero";
import StatsSummary from "./components/StatsSummary";
import SectionHeading from "./components/SectionHeading";
import Controls from "./components/Controls";
import StationGrid from "./components/StationGrid";
import Footer from "./components/Footer";
import { useBikeShareStations } from "./hooks/useBikeShareStations";
import { PAGE_SIZE } from "./constants";

export default function App() {
  const { stations, neighbourhoods, error, lastUpdated } = useBikeShareStations();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Reset back to the first page whenever the search or filter changes,
  // same as the vanilla version resetting visibleCount on input/change.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchTerm, selectedNeighbourhood]);

  const filteredStations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const filtered = stations.filter((station) => {
      const matchesSearch =
        term === "" ||
        station.name.toLowerCase().includes(term) ||
        station.address.toLowerCase().includes(term);

      const matchesNeighbourhood =
        selectedNeighbourhood === "all" || station.neighbourhood === selectedNeighbourhood;

      return matchesSearch && matchesNeighbourhood;
    });

    // Busiest (most bikes available) stations first — feels more useful
    // than random API order.
    return [...filtered].sort((a, b) => b.bikesAvailable - a.bikesAvailable);
  }, [stations, searchTerm, selectedNeighbourhood]);

  const visibleStations = filteredStations.slice(0, visibleCount);
  const hasMore = visibleCount < filteredStations.length;

  return (
    <>
      <Hero />

      <StatsSummary stations={stations} />

      <div id="current-station-availability"></div>

      <SectionHeading />

      <section className="live-status">
        <Controls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          neighbourhoods={neighbourhoods}
          selectedNeighbourhood={selectedNeighbourhood}
          onNeighbourhoodChange={setSelectedNeighbourhood}
        />

        <p className="last-updated">
          {!error &&
            (lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : "Loading live data…")}
        </p>
        {error && (
          <p className="fetch-error">
            Couldn't reach the Bike Share Toronto feed right now. Retrying automatically…
          </p>
        )}

        <StationGrid stations={visibleStations} />

        <div className="load-more-wrap">
          {hasMore && (
            <button className="btn btn-secondary" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
              Show More Stations
            </button>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
