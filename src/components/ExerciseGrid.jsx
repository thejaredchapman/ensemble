import { ExerciseCard } from "./ExerciseCard";

export function ExerciseGrid({ exercises, onSelect }) {
  if (exercises.length === 0) {
    return (
      <section className="grid" aria-label="Exercise list">
        <div className="empty" role="status">
          <div className="empty__emoji" aria-hidden="true">🎭</div>
          <p className="empty__text">No exercises match your filters.</p>
          <p className="empty__hint">Try clearing a filter or widening your search.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="grid" aria-label="Exercise list">
      {exercises.map((ex) => (
        <ExerciseCard key={ex.id} exercise={ex} onClick={() => onSelect(ex)} />
      ))}
    </section>
  );
}
