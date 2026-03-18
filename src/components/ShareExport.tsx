import { useState, useCallback } from 'react';
import type { Criterion, Option, Scores, OptionResult } from '../utils/calculator';
import { resultsToMarkdown } from '../utils/calculator';
import { setStateToURL } from '../utils/urlState';

interface Props {
  options: Option[];
  criteria: Criterion[];
  scores: Scores;
  results: OptionResult[];
}

export default function ShareExport({
  options,
  criteria,
  scores,
  results,
}: Props) {
  const [copied, setCopied] = useState<'url' | 'md' | null>(null);

  const handleShareURL = useCallback(() => {
    const url = setStateToURL({ options, criteria, scores });
    navigator.clipboard.writeText(url).then(() => {
      setCopied('url');
      setTimeout(() => setCopied(null), 2000);
    });
  }, [options, criteria, scores]);

  const handleExportMarkdown = useCallback(() => {
    const md = resultsToMarkdown(criteria, options, scores, results);
    navigator.clipboard.writeText(md).then(() => {
      setCopied('md');
      setTimeout(() => setCopied(null), 2000);
    });
  }, [criteria, options, scores, results]);

  return (
    <div className="share-export">
      <button className="btn btn-share" onClick={handleShareURL}>
        {copied === 'url' ? '✅ URL Copied!' : '🔗 Share URL'}
      </button>
      <button className="btn btn-export" onClick={handleExportMarkdown}>
        {copied === 'md' ? '✅ Markdown Copied!' : '📋 Copy as Markdown'}
      </button>
    </div>
  );
}
