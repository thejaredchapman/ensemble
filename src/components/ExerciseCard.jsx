import { CATEGORY_COLORS, CATEGORY_LABELS, FORMAT_COLORS, ENERGY_COLORS } from "../constants";

export function ExerciseCard({ exercise, onClick }) {
  const { title, emoji, categories, format, energy, players, time, tagline, description } = exercise;
  const primaryCat = categories[0];
  const accent = CATEGORY_COLORS[primaryCat];

  return (
    <article
      className="card"
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onClick())}
      tabIndex={0}
      role="button"
      aria-label={`Open ${title}`}
      style={{ "--card-accent": accent }}
    >
      <div className="card__top">
        <span className="card__emoji" aria-hidden="true">{emoji}</span>
        <div className="card__cats">
          {categories.slice(0, 2).map((cat) => (
            <span
              key={cat}
              className="badge"
              style={{ "--badge-color": CATEGORY_COLORS[cat] }}
            >
              {CATEGORY_LABELS[cat] ?? cat}
            </span>
          ))}
          {categories.length > 2 && (
            <span className="badge badge--more">+{categories.length - 2}</span>
          )}
        </div>
      </div>

      <h2 className="card__title">{title}</h2>
      {tagline && <p className="card__tagline">{tagline}</p>}
      <p className="card__description">{description}</p>

      <div className="card__meta">
        <span className="card__stat">
          <span className="card__stat-icon" aria-hidden="true">⏱</span> {time}
        </span>
        <span className="card__stat">
          <span className="card__stat-icon" aria-hidden="true">👥</span> {players}
        </span>
        <span
          className="badge badge--format"
          style={{ "--badge-color": FORMAT_COLORS[format] }}
        >
          {format}
        </span>
        <span
          className="badge"
          style={{ "--badge-color": ENERGY_COLORS[energy] }}
        >
          {energy}
        </span>
      </div>
    </article>
  );
}
