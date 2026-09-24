export default function Controls({
  searchTerm,
  onSearchChange,
  neighbourhoods,
  selectedNeighbourhood,
  onNeighbourhoodChange,
}) {
  return (
    <div className="controls">
      <input
        type="text"
        id="station-search"
        placeholder="Search by station name or street..."
        autoComplete="off"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select
        id="neighbourhood-filter"
        value={selectedNeighbourhood}
        onChange={(e) => onNeighbourhoodChange(e.target.value)}
      >
        <option value="all">All Neighbourhoods</option>
        {neighbourhoods.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
