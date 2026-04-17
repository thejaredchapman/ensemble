import { useState, useMemo, useEffect, useCallback } from "react";
import { exercises } from "./data/exercises";
import { FilterBar } from "./components/FilterBar";
import { ExerciseGrid } from "./components/ExerciseGrid";
import { Modal } from "./components/Modal";
import "./App.css";

export default function App() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [selected, setSelected] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) return stored === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  const toggleDark = useCallback(() => setDarkMode((d) => !d), []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return exercises.filter((ex) => {
      if (activeCategory && !ex.categories.includes(activeCategory)) return false;
      if (!q) return true;
      return (
        ex.title.toLowerCase().includes(q) ||
        ex.description.toLowerCase().includes(q) ||
        (ex.tagline ?? "").toLowerCase().includes(q) ||
        ex.tags?.some((t) => t.toLowerCase().includes(q)) ||
        ex.categories?.some((c) => c.toLowerCase().includes(q))
      );
    });
  }, [search, activeCategory]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__brand">
            <div className="app-header__mark" aria-hidden="true">E</div>
            <div>
              <h1 className="app-header__title">ENSEMBLE</h1>
              <p className="app-header__subtitle">
                A library of improv, theatre &amp; ensemble exercises
              </p>
            </div>
          </div>
          <div className="app-header__right">
            <span className="app-header__count" aria-live="polite">
              {filtered.length} exercise{filtered.length !== 1 ? "s" : ""}
            </span>
            <button
              className="theme-toggle"
              onClick={toggleDark}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <FilterBar
          search={search}
          onSearch={setSearch}
          activeCategory={activeCategory}
          onCategory={setActiveCategory}
        />
        <ExerciseGrid exercises={filtered} onSelect={setSelected} />
      </main>

      {selected && (
        <Modal exercise={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
