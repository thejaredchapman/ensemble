import { ExerciseCard } from "./ExerciseCard";

export function ExerciseGrid({ exercises, onSelect }) {
  if (exercises.length === 0) {
    return (
      <div className="empty-state" role="status">
        <span aria-hidden="true">🎭</span>
        <p>No exercises match your filters.</p>
      </div>
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
