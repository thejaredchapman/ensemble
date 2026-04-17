import { CATEGORIES, CATEGORY_LABELS, CATEGORY_ICONS } from "../constants";

export function FilterBar({ search, onSearch, activeCategory, onCategory }) {
  return (
    <div className="filter-bar" role="search">
      <div className="category-pills" role="group" aria-label="Filter by category">
        <button
          className={`pill ${activeCategory === null ? "pill--active" : ""}`}
          onClick={() => onCategory(null)}
        >
          <span className="pill__icon" aria-hidden="true">🗂</span>
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`pill ${activeCategory === cat ? "pill--active" : ""}`}
            onClick={() => onCategory(cat)}
          >
            <span className="pill__icon" aria-hidden="true">{CATEGORY_ICONS[cat]}</span>
            {CATEGORY_LABELS[cat] ?? cat}
          </button>
        ))}
      </div>
      <input
        className="search-input"
        type="search"
        placeholder="Search exercises, tags…"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        aria-label="Search exercises"
      />
    </div>
  );
}
