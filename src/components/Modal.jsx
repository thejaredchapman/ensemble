import { useEffect, useRef } from "react";
import { CATEGORY_COLORS, CATEGORY_LABELS, FORMAT_COLORS, ENERGY_COLORS } from "../constants";

export function Modal({ exercise, onClose }) {
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleKeyDown(e) {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;

      const focusable = dialog.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }

    dialog.addEventListener("keydown", handleKeyDown);
    return () => dialog.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const {
    title, emoji, categories, format, energy, players, time,
    tagline, description, steps, benefits, variations, debrief, tags, source,
  } = exercise;

  const variationList = Array.isArray(variations)
    ? variations
    : variations ? [variations] : [];

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal__header">
          <div className="modal__title-row">
            <span className="modal__emoji" aria-hidden="true">{emoji}</span>
            <div className="modal__title-block">
              <h2 className="modal__title" id="modal-title">{title}</h2>
              {tagline && <p className="modal__tagline">{tagline}</p>}
              <div className="modal__badges">
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className="badge badge--category"
                    style={{ "--badge-color": CATEGORY_COLORS[cat] }}
                  >
                    {CATEGORY_LABELS[cat] ?? cat}
                  </span>
                ))}
                <span
                  className="badge badge--format"
                  style={{ "--badge-color": FORMAT_COLORS[format] }}
                >
                  {format}
                </span>
                <span
                  className="badge badge--energy"
                  style={{ "--badge-color": ENERGY_COLORS[energy] }}
                >
                  {energy} energy
                </span>
              </div>
              <div className="modal__stats">
                <span className="modal__stat">⏱ {time}</span>
                <span className="modal__stat">👥 {players} players</span>
              </div>
            </div>
          </div>
          <button
            className="modal__close"
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close exercise details"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal__body">
          <p className="modal__description">{description}</p>

          {steps?.length > 0 && (
            <section className="modal__section" aria-labelledby="how-to-play">
              <h3 className="modal__section-title" id="how-to-play">How to Play</h3>
              <ol className="modal__steps">
                {steps.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
            </section>
          )}

          {benefits?.length > 0 && (
            <section className="modal__section" aria-labelledby="why-matters">
              <h3 className="modal__section-title" id="why-matters">💡 Why It Matters</h3>
              <ul className="modal__bullets">
                {benefits.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </section>
          )}

          {variationList.length > 0 && (
            <section className="modal__section" aria-labelledby="variations">
              <h3 className="modal__section-title" id="variations">🔀 Tips &amp; Variations</h3>
              <ul className="modal__bullets">
                {variationList.map((v, i) => <li key={i}>{v}</li>)}
              </ul>
            </section>
          )}

          {debrief?.length > 0 && (
            <section className="modal__section" aria-labelledby="debrief">
              <h3 className="modal__section-title" id="debrief">💬 Debrief Questions</h3>
              <ul className="modal__bullets modal__bullets--questions">
                {debrief.map((q, i) => <li key={i}>{q}</li>)}
              </ul>
            </section>
          )}

          {tags?.length > 0 && (
            <div className="modal__tags" aria-label="Tags">
              {tags.map((t) => <span key={t} className="tag">#{t}</span>)}
            </div>
          )}

          {source && (
            <div className="modal__source">
              <span className="modal__source-icon" aria-hidden="true">📚</span>
              <span>
                <em>{source.book}</em> — {source.author}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
