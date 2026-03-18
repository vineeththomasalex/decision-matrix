import type { OptionResult } from '../utils/calculator';

interface Props {
  results: OptionResult[];
}

export default function Results({ results }: Props) {
  if (results.length === 0) return null;

  const maxScore = Math.max(...results.map((r) => r.normalizedScore), 1);

  return (
    <div className="results">
      <h2>Results</h2>
      <div className="results-chart">
        {results.map((r) => {
          const isWinner = r.rank === 1;
          const barWidth = (r.normalizedScore / maxScore) * 100;
          return (
            <div
              key={r.optionId}
              className={`result-row ${isWinner ? 'winner' : ''}`}
            >
              <div className="result-rank">#{r.rank}</div>
              <div className="result-name">{r.name}</div>
              <div className="result-bar-wrapper">
                <div
                  className="result-bar"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: isWinner ? '#4CAF50' : '#5c6bc0',
                  }}
                />
              </div>
              <div className="result-score">{r.normalizedScore}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
