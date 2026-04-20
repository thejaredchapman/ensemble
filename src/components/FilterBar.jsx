import { CATEGORIES, CATEGORY_LABELS, CATEGORY_ICONS } from "../constants";

const FORMATS = [
  { key: "solo",  label: "Solo",  icon: "🧍" },
  { key: "pair",  label: "Pair",  icon: "👥" },
  { key: "group", label: "Group", icon: "👨‍👩‍👧" },
];

const ENERGIES = [
  { key: "Low",    label: "Low",    icon: "🌙" },
  { key: "Medium", label: "Medium", icon: "☕" },
  { key: "High",   label: "High",   icon: "⚡" },
];

const SORT_OPTIONS = [
  { key: "title-asc",    label: "Title (A→Z)" },
  { key: "title-desc",   label: "Title (Z→A)" },
  { key: "time-asc",     label: "Shortest first" },
  { key: "time-desc",    label: "Longest first" },
  { key: "energy-asc",   label: "Energy (low→high)" },
  { key: "energy-desc",  label: "Energy (high→low)" },
  { key: "players-asc",  label: "Fewest players" },
];

export function FilterBar({
  search, onSearch,
  activeCategory, onCategory,
  activeFormat, onFormat,
  activeEnergy, onEnergy,
  sortKey, onSort,
  onClear, hasActive,
}) {
  return (
    <section className="controls glass" role="search" aria-label="Search and filter">
      <div className="controls__row">
        <div className="search">
          <span className="search__icon" aria-hidden="true">🔍</span>
          <input
            className="search__input"
            type="search"
            placeholder="Search by name, description, or tag…"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            aria-label="Search exercises"
          />
          {search && (
            <button
              className="search__clear"
              onClick={() => onSearch("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="sort">
          <select
            className="sort__select"
            value={sortKey}
            onChange={(e) => onSort(e.target.value)}
            aria-label="Sort exercises"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>Sort: {o.label}</option>
            ))}
          </select>
          <span className="sort__chevron" aria-hidden="true">▾</span>
        </div>

        {hasActive && (
          <button className="clear-all" onClick={onClear} aria-label="Clear all filters">
            Clear all
          </button>
        )}
      </div>

      <div className="chip-group" role="group" aria-label="Filter by category">
        <span className="chip-group__label">Category</span>
        <button
          className={`chip ${activeCategory === null ? "chip--active" : ""}`}
          onClick={() => onCategory(null)}
          aria-pressed={activeCategory === null}
        >
          <span className="chip__icon" aria-hidden="true">🗂</span>
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`chip ${activeCategory === cat ? "chip--active" : ""}`}
            onClick={() => onCategory(activeCategory === cat ? null : cat)}
            aria-pressed={activeCategory === cat}
          >
            <span className="chip__icon" aria-hidden="true">{CATEGORY_ICONS[cat]}</span>
            {CATEGORY_LABELS[cat] ?? cat}
          </button>
        ))}
      </div>

      <div className="chip-group" role="group" aria-label="Filter by format">
        <span className="chip-group__label">Format</span>
        {FORMATS.map((f) => (
          <button
            key={f.key}
            className={`chip ${activeFormat === f.key ? "chip--active" : ""}`}
            onClick={() => onFormat(activeFormat === f.key ? null : f.key)}
            aria-pressed={activeFormat === f.key}
          >
            <span className="chip__icon" aria-hidden="true">{f.icon}</span>
            {f.label}
          </button>
        ))}

        <span className="chip-group__label" style={{ marginLeft: "0.75rem" }}>Energy</span>
        {ENERGIES.map((e) => (
          <button
            key={e.key}
            className={`chip ${activeEnergy === e.key ? "chip--active" : ""}`}
            onClick={() => onEnergy(activeEnergy === e.key ? null : e.key)}
            aria-pressed={activeEnergy === e.key}
          >
            <span className="chip__icon" aria-hidden="true">{e.icon}</span>
            {e.label}
          </button>
        ))}
      </div>
    </section>
  );
}
