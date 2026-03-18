import type { Criterion, Option, Scores } from './calculator';

export interface MatrixState {
  options: Option[];
  criteria: Criterion[];
  scores: Scores;
}

export function encodeState(state: MatrixState): string {
  const json = JSON.stringify({
    o: state.options.map((o) => ({ i: o.id, n: o.name })),
    c: state.criteria.map((c) => ({ i: c.id, n: c.name, w: c.weight })),
    s: state.scores,
  });
  return btoa(encodeURIComponent(json));
}

export function decodeState(encoded: string): MatrixState | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    const data = JSON.parse(json);
    return {
      options: data.o.map((o: { i: string; n: string }) => ({
        id: o.i,
        name: o.n,
      })),
      criteria: data.c.map((c: { i: string; n: string; w: number }) => ({
        id: c.i,
        name: c.n,
        weight: c.w,
      })),
      scores: data.s,
    };
  } catch {
    return null;
  }
}

export function getStateFromURL(): MatrixState | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('m');
  if (!encoded) return null;
  return decodeState(encoded);
}

export function setStateToURL(state: MatrixState): string {
  const encoded = encodeState(state);
  const url = new URL(window.location.href);
  url.searchParams.set('m', encoded);
  window.history.replaceState(null, '', url.toString());
  return url.toString();
}
