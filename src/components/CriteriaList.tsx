import type { Criterion } from '../utils/calculator';

interface Props {
  criteria: Criterion[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onWeightChange: (id: string, weight: number) => void;
}

export default function CriteriaList({
  criteria,
  onAdd,
  onRemove,
  onRename,
  onWeightChange,
}: Props) {
  return (
    <div className="criteria-list">
      <div className="section-header">
        <h2>Criteria</h2>
        <button className="btn btn-add" onClick={onAdd}>
          + Add Criterion
        </button>
      </div>
      {criteria.map((c) => (
        <div key={c.id} className="criterion-row">
          <button
            className="btn btn-remove"
            onClick={() => onRemove(c.id)}
            title="Remove"
          >
            ×
          </button>
          <input
            className="criterion-name"
            value={c.name}
            onChange={(e) => onRename(c.id, e.target.value)}
            placeholder="Criterion name"
          />
          <div className="weight-control">
            <input
              type="range"
              min={1}
              max={10}
              value={c.weight}
              onChange={(e) => onWeightChange(c.id, Number(e.target.value))}
            />
            <span className="weight-badge">{c.weight}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
