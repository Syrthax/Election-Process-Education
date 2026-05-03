import { describe, it, expect } from 'vitest';
import { appReducer, initialState, ACTIONS, MAX_COMPARE } from '../appReducer';

describe('appReducer', () => {
  it('returns initialState for unknown actions', () => {
    expect(appReducer(initialState, { type: 'UNKNOWN' })).toBe(initialState);
  });

  it('SET_USER_STATE updates userState', () => {
    const next = appReducer(initialState, { type: ACTIONS.SET_USER_STATE, payload: 'registered' });
    expect(next.userState).toBe('registered');
  });

  it('SET_LOCATION updates state and constituency', () => {
    const next = appReducer(initialState, {
      type: ACTIONS.SET_LOCATION,
      payload: { state: 'Maharashtra', constituency: 'Mumbai North' },
    });
    expect(next.selectedState).toBe('Maharashtra');
    expect(next.selectedConstituency).toBe('Mumbai North');
  });

  it('TOGGLE_CHECKLIST flips a key', () => {
    const a = appReducer(initialState, { type: ACTIONS.TOGGLE_CHECKLIST, payload: 'epic' });
    expect(a.checklist.epic).toBe(true);
    const b = appReducer(a, { type: ACTIONS.TOGGLE_CHECKLIST, payload: 'epic' });
    expect(b.checklist.epic).toBe(false);
  });

  it('TOGGLE_COMPARE adds, removes, and respects MAX_COMPARE', () => {
    let s = initialState;
    s = appReducer(s, { type: ACTIONS.TOGGLE_COMPARE, payload: 'a' });
    s = appReducer(s, { type: ACTIONS.TOGGLE_COMPARE, payload: 'b' });
    s = appReducer(s, { type: ACTIONS.TOGGLE_COMPARE, payload: 'c' });
    expect(s.compareList).toEqual(['a', 'b', 'c']);
    expect(s.compareList).toHaveLength(MAX_COMPARE);

    // Adding a fourth is a no-op.
    const s2 = appReducer(s, { type: ACTIONS.TOGGLE_COMPARE, payload: 'd' });
    expect(s2.compareList).toEqual(['a', 'b', 'c']);

    // Toggling an existing id removes it.
    const s3 = appReducer(s, { type: ACTIONS.TOGGLE_COMPARE, payload: 'b' });
    expect(s3.compareList).toEqual(['a', 'c']);
  });

  it('CLEAR_COMPARE empties the compareList', () => {
    const s = { ...initialState, compareList: ['a', 'b'] };
    expect(appReducer(s, { type: ACTIONS.CLEAR_COMPARE }).compareList).toEqual([]);
  });

  it('does not mutate input state', () => {
    const before = { ...initialState, compareList: [] };
    const snapshot = JSON.stringify(before);
    appReducer(before, { type: ACTIONS.TOGGLE_COMPARE, payload: 'x' });
    expect(JSON.stringify(before)).toBe(snapshot);
  });
});
