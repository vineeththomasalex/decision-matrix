import { useState, useCallback, useMemo, useEffect } from 'react';
import './App.css';
import type { Criterion, Option, Scores } from './utils/calculator';
import { calculateResults } from './utils/calculator';
import { getStateFromURL } from './utils/urlState';
import CriteriaList from './components/CriteriaList';
import OptionsHeader from './components/OptionsHeader';
import ScoringGrid from './components/ScoringGrid';
import Results from './components/Results';
import ShareExport from './components/ShareExport';

let nextId = 1;
function uid() {
  return `id${nextId++}`;
}

function defaultState() {
  const o1 = uid(), o2 = uid(), o3 = uid();
  const c1 = uid(), c2 = uid(), c3 = uid(), c4 = uid();

  const options: Option[] = [
    { id: o1, name: 'React' },
    { id: o2, name: 'Vue' },
    { id: o3, name: 'Svelte' },
  ];

  const criteria: Criterion[] = [
    { id: c1, name: 'Learning Curve', weight: 7 },
    { id: c2, name: 'Performance', weight: 8 },
    { id: c3, name: 'Ecosystem', weight: 9 },
    { id: c4, name: 'DX', weight: 8 },
  ];

  const scores: Scores = {
    [c1]: { [o1]: 5, [o2]: 7, [o3]: 9 },
    [c2]: { [o1]: 7, [o2]: 7, [o3]: 9 },
    [c3]: { [o1]: 10, [o2]: 8, [o3]: 5 },
    [c4]: { [o1]: 7, [o2]: 8, [o3]: 9 },
  };

  return { options, criteria, scores };
}

function getInitialState() {
  const fromUrl = getStateFromURL();
  if (fromUrl) return fromUrl;
  return defaultState();
}

function App() {
  const [options, setOptions] = useState<Option[]>(() => getInitialState().options);
  const [criteria, setCriteria] = useState<Criterion[]>(() => getInitialState().criteria);
  const [scores, setScores] = useState<Scores>(() => getInitialState().scores);

  // Restore from URL on mount (handles shared links)
  useEffect(() => {
    const s = getStateFromURL();
    if (s) {
      setOptions(s.options);
      setCriteria(s.criteria);
      setScores(s.scores);
    }
  }, []);

  const results = useMemo(
    () => calculateResults(options, criteria, scores),
    [options, criteria, scores],
  );

  // ── Option handlers ──
  const addOption = useCallback(() => {
    setOptions((prev) => [...prev, { id: uid(), name: `Option ${prev.length + 1}` }]);
  }, []);

  const removeOption = useCallback((id: string) => {
    setOptions((prev) => prev.filter((o) => o.id !== id));
    setScores((prev) => {
      const next = { ...prev };
      for (const cId of Object.keys(next)) {
        const row = { ...next[cId] };
        delete row[id];
        next[cId] = row;
      }
      return next;
    });
  }, []);

  const renameOption = useCallback((id: string, name: string) => {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, name } : o)));
  }, []);

  // ── Criteria handlers ──
  const addCriterion = useCallback(() => {
    setCriteria((prev) => [
      ...prev,
      { id: uid(), name: `Criterion ${prev.length + 1}`, weight: 5 },
    ]);
  }, []);

  const removeCriterion = useCallback((id: string) => {
    setCriteria((prev) => prev.filter((c) => c.id !== id));
    setScores((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const renameCriterion = useCallback((id: string, name: string) => {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));
  }, []);

  const changeCriterionWeight = useCallback((id: string, weight: number) => {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, weight } : c)));
  }, []);

  // ── Score handler ──
  const changeScore = useCallback((criterionId: string, optionId: string, score: number) => {
    setScores((prev) => ({
      ...prev,
      [criterionId]: {
        ...prev[criterionId],
        [optionId]: score,
      },
    }));
  }, []);

  return (
    <>
      <header className="app-header">
        <h1>Decision Matrix ⚖️</h1>
        <p>Compare options with weighted criteria</p>
      </header>

      <OptionsHeader
        options={options}
        onAdd={addOption}
        onRemove={removeOption}
        onRename={renameOption}
      />

      <CriteriaList
        criteria={criteria}
        onAdd={addCriterion}
        onRemove={removeCriterion}
        onRename={renameCriterion}
        onWeightChange={changeCriterionWeight}
      />

      <ScoringGrid
        criteria={criteria}
        options={options}
        scores={scores}
        onScoreChange={changeScore}
      />

      <Results results={results} />

      <ShareExport
        options={options}
        criteria={criteria}
        scores={scores}
        results={results}
      />
    </>
  );
}

export default App;
