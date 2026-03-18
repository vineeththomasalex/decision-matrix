export interface Criterion {
  id: string;
  name: string;
  weight: number;
}

export interface Option {
  id: string;
  name: string;
}

// scores[criterionId][optionId] = score (1–10)
export type Scores = Record<string, Record<string, number>>;

export interface OptionResult {
  optionId: string;
  name: string;
  rawScore: number;
  normalizedScore: number; // 0–100
  rank: number;
}

const MAX_SCORE = 10;

export function calculateResults(
  options: Option[],
  criteria: Criterion[],
  scores: Scores,
): OptionResult[] {
  if (options.length === 0 || criteria.length === 0) return [];

  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
  if (totalWeight === 0) return [];

  const results: OptionResult[] = options.map((opt) => {
    const rawScore = criteria.reduce((sum, c) => {
      const score = scores[c.id]?.[opt.id] ?? 0;
      return sum + c.weight * score;
    }, 0);

    const normalizedScore = (rawScore / (totalWeight * MAX_SCORE)) * 100;

    return {
      optionId: opt.id,
      name: opt.name,
      rawScore,
      normalizedScore: Math.round(normalizedScore * 10) / 10,
      rank: 0,
    };
  });

  results.sort((a, b) => b.normalizedScore - a.normalizedScore);
  results.forEach((r, i) => {
    r.rank = i + 1;
  });

  return results;
}

export function resultsToMarkdown(
  criteria: Criterion[],
  options: Option[],
  scores: Scores,
  results: OptionResult[],
): string {
  const lines: string[] = [];
  lines.push('# Decision Matrix ⚖️\n');

  // Scoring table
  const header = ['Criteria', 'Weight', ...options.map((o) => o.name)];
  lines.push('| ' + header.join(' | ') + ' |');
  lines.push('| ' + header.map(() => '---').join(' | ') + ' |');

  for (const c of criteria) {
    const row = [c.name, String(c.weight)];
    for (const o of options) {
      row.push(String(scores[c.id]?.[o.id] ?? 0));
    }
    lines.push('| ' + row.join(' | ') + ' |');
  }

  lines.push('');
  lines.push('## Results\n');

  const resHeader = ['Rank', 'Option', 'Score'];
  lines.push('| ' + resHeader.join(' | ') + ' |');
  lines.push('| ' + resHeader.map(() => '---').join(' | ') + ' |');

  for (const r of results) {
    lines.push(`| ${r.rank} | ${r.name} | ${r.normalizedScore}% |`);
  }

  return lines.join('\n');
}
