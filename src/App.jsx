import { useState, useMemo, useEffect, useCallback } from "react";
import { exercises } from "./data/exercises";
import { FilterBar } from "./components/FilterBar";
import { ExerciseGrid } from "./components/ExerciseGrid";
import { Modal } from "./components/Modal";
import { AccentPicker } from "./components/AccentPicker";
import { computeAccentVars } from "./utils/accentColor";
import "./App.css";

const parseFirstNumber = (str) => {
  if (!str) return Infinity;
  const m = String(str).match(/\d+/);
  return m ? Number(m[0]) : Infinity;
};

const ENERGY_RANK = { Low: 1, Medium: 2, High: 3 };

const SORTS = {
  "title-asc":    (a, b) => a.title.localeCompare(b.title),
  "title-desc":   (a, b) => b.title.localeCompare(a.title),
  "time-asc":     (a, b) => parseFirstNumber(a.time) - parseFirstNumber(b.time),
  "time-desc":    (a, b) => parseFirstNumber(b.time) - parseFirstNumber(a.time),
  "energy-asc":   (a, b) => (ENERGY_RANK[a.energy] ?? 0) - (ENERGY_RANK[b.energy] ?? 0),
  "energy-desc":  (a, b) => (ENERGY_RANK[b.energy] ?? 0) - (ENERGY_RANK[a.energy] ?? 0),
  "players-asc":  (a, b) => parseFirstNumber(a.players) - parseFirstNumber(b.players),
};

export default function App() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeFormat, setActiveFormat] = useState(null);
  const [activeEnergy, setActiveEnergy] = useState(null);
  const [sortKey, setSortKey] = useState("title-asc");
  const [selected, setSelected] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) return stored === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [accentHue, setAccentHue] = useState(() => {
    const stored = localStorage.getItem("accentHue");
    return stored !== null ? Number(stored) : null;
  });

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const root = document.documentElement;
    if (accentHue === null) {
      ["--accent-1", "--accent-2", "--accent-3"].forEach((v) => root.style.removeProperty(v));
      localStorage.removeItem("accentHue");
      return;
    }
    const vars = computeAccentVars(accentHue, darkMode ? "dark" : "light");
    Object.entries(vars).forEach(([key, value]) => root.style.setProperty(key, value));
    localStorage.setItem("accentHue", String(accentHue));
  }, [accentHue, darkMode]);

  const toggleDark = useCallback(() => setDarkMode((d) => !d), []);
  const resetAccent = useCallback(() => setAccentHue(null), []);

  const clearAll = useCallback(() => {
    setSearch("");
    setActiveCategory(null);
    setActiveFormat(null);
    setActiveEnergy(null);
    setSortKey("title-asc");
  }, []);

  const hasActiveFilters =
    Boolean(search) || activeCategory || activeFormat || activeEnergy || sortKey !== "title-asc";

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const result = exercises.filter((ex) => {
      if (activeCategory && !ex.categories.includes(activeCategory)) return false;
      if (activeFormat && ex.format !== activeFormat) return false;
      if (activeEnergy && ex.energy !== activeEnergy) return false;
      if (!q) return true;
      return (
        ex.title.toLowerCase().includes(q) ||
        ex.description.toLowerCase().includes(q) ||
        (ex.tagline ?? "").toLowerCase().includes(q) ||
        ex.tags?.some((t) => t.toLowerCase().includes(q)) ||
        ex.categories?.some((c) => c.toLowerCase().includes(q))
      );
    });
    const sorter = SORTS[sortKey] ?? SORTS["title-asc"];
    return [...result].sort(sorter);
  }, [search, activeCategory, activeFormat, activeEnergy, sortKey]);

  return (
    <div className="app">
      <section className="hero glass" aria-label="Introduction">
        <div className="hero__inner">
          <div className="hero__brand">
            <span className="hero__eyebrow">
              <span className="hero__dot" aria-hidden="true" />
              Improv &amp; ensemble library
            </span>
            <h1 className="hero__title">ENSEMBLE</h1>
            <p className="hero__subtitle">
              A curated collection of warm-ups, games and exercises for improv,
              theatre, classrooms and teams. Search, sort, and dive in.
            </p>
          </div>

          <div className="hero__stats" aria-live="polite">
            <div className="hero__stat">
              <span className="hero__stat-value">{filtered.length}</span>
              <span className="hero__stat-label">
                {hasActiveFilters ? "Matches" : "Exercises"}
              </span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-value">{exercises.length}</span>
              <span className="hero__stat-label">Total</span>
            </div>
            <AccentPicker hue={accentHue} onChange={setAccentHue} onReset={resetAccent} darkMode={darkMode} />
            <button
              className="theme-toggle"
              onClick={toggleDark}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={darkMode ? "Light mode" : "Dark mode"}
            >
              {darkMode ? "☀" : "☾"}
            </button>
          </div>
        </div>
      </section>

      <FilterBar
        search={search}
        onSearch={setSearch}
        activeCategory={activeCategory}
        onCategory={setActiveCategory}
        activeFormat={activeFormat}
        onFormat={setActiveFormat}
        activeEnergy={activeEnergy}
        onEnergy={setActiveEnergy}
        sortKey={sortKey}
        onSort={setSortKey}
        onClear={clearAll}
        hasActive={hasActiveFilters}
      />

      <ExerciseGrid exercises={filtered} onSelect={setSelected} />

      {selected && (
        <Modal exercise={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
