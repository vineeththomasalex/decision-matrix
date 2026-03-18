import type { Option } from '../utils/calculator';

interface Props {
  options: Option[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export default function OptionsHeader({
  options,
  onAdd,
  onRemove,
  onRename,
}: Props) {
  return (
    <div className="options-header">
      <div className="section-header">
        <h2>Options</h2>
        <button className="btn btn-add" onClick={onAdd}>
          + Add Option
        </button>
      </div>
      <div className="options-chips">
        {options.map((o) => (
          <div key={o.id} className="option-chip">
            <input
              value={o.name}
              onChange={(e) => onRename(o.id, e.target.value)}
              placeholder="Option name"
            />
            <button
              className="btn btn-remove-sm"
              onClick={() => onRemove(o.id)}
              title="Remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
