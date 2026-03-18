import type { Criterion, Option, Scores } from '../utils/calculator';

interface Props {
  criteria: Criterion[];
  options: Option[];
  scores: Scores;
  onScoreChange: (criterionId: string, optionId: string, score: number) => void;
}

export default function ScoringGrid({
  criteria,
  options,
  scores,
  onScoreChange,
}: Props) {
  if (criteria.length === 0 || options.length === 0) {
    return (
      <div className="scoring-grid-empty">
        Add at least one criterion and one option to start scoring.
      </div>
    );
  }

  return (
    <div className="scoring-grid-wrapper">
      <h2>Scoring</h2>
      <div className="scoring-grid">
        <table>
          <thead>
            <tr>
              <th className="col-criteria">Criteria</th>
              <th className="col-weight">Weight</th>
              {options.map((o) => (
                <th key={o.id}>{o.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {criteria.map((c) => (
              <tr key={c.id}>
                <td className="col-criteria">{c.name}</td>
                <td className="col-weight">
                  <span className="weight-badge">{c.weight}</span>
                </td>
                {options.map((o) => (
                  <td key={o.id} className="score-cell">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={scores[c.id]?.[o.id] ?? 5}
                      onChange={(e) =>
                        onScoreChange(c.id, o.id, Number(e.target.value))
                      }
                    />
                    <span className="score-value">
                      {scores[c.id]?.[o.id] ?? 5}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
