import { describe, expect, it, beforeEach } from 'vitest';
import { readWorkspace, writeWorkspace, clearWorkspace } from './storage.js';

describe('workspace storage', () => {
  beforeEach(() => localStorage.clear());

  it('returns null when no workspace has been saved', () => {
    expect(readWorkspace()).toBeNull();
  });

  it('round-trips workspace data through localStorage', () => {
    const workspace = { bookmarks: [{ id: 'b1', title: 'Test' }], snippets: [], notes: [], goals: [] };
    expect(writeWorkspace(workspace)).toBe(true);
    expect(readWorkspace()).toEqual(workspace);
  });

  it('clears the saved workspace', () => {
    writeWorkspace({ bookmarks: [], snippets: [], notes: [], goals: [] });
    clearWorkspace();
    expect(readWorkspace()).toBeNull();
  });

  it('handles invalid JSON safely', () => {
    localStorage.setItem('learntrace:v1', '{not valid');
    expect(readWorkspace()).toBeNull();
  });
});
