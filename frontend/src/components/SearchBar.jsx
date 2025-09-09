export default function SearchBar({ query, setQuery }) {
  return (
    <input
      className="search"
      placeholder="Search by name..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
