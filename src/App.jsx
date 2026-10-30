import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, Bookmark, Check, Code2, Download, FileText, LayoutDashboard,
  Menu, MoreHorizontal, Moon, Plus, Search, Sparkles, Sun, Target, Trash2, X
} from 'lucide-react';
import { Overview, BookmarksPage, SnippetsPage, NotesPage, CreateModal } from './WorkspaceViews.jsx';
import { readWorkspace, writeWorkspace } from './storage.js';
import { seedWorkspace } from './seed.js';

const initialWorkspace = () => {
  const saved = readWorkspace();
  const isValid = saved && ['bookmarks', 'snippets', 'notes', 'goals']
    .every((key) => Array.isArray(saved[key]));
  return isValid ? saved : structuredClone(seedWorkspace);
};
const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'bookmarks', label: 'Learning bookmarks', icon: Bookmark, countKey: 'bookmarks' },
  { id: 'snippets', label: 'Code journal', icon: Code2, countKey: 'snippets' },
  { id: 'notes', label: 'Notes & questions', icon: FileText, countKey: 'notes' }
];

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}


function getInitials() {
  return 'LT';
}

function formatToday() {
  return new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    .format(new Date()).toUpperCase();
}

export default function App() {
  const [workspace, setWorkspace] = useState(initialWorkspace);
  const [activePage, setActivePage] = useState('overview');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('bookmark');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [filter, setFilter] = useState('all');
  const searchInputRef = useRef(null);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('learntrace:theme') === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  function toggleTheme() {
    setTheme((current) => current === 'light' ? 'dark' : 'light');
  }

  useEffect(() => {
    writeWorkspace(workspace);
  }, [workspace]);

  useEffect(() => {
    try {
      localStorage.setItem('learntrace:theme', theme);
    } catch {
      // Theme still works for this session if browser storage is unavailable.
    }
  }, [theme]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(id);
  }, [toast]);

  // Ctrl/Cmd + K focuses search. Escape closes an open dialog or mobile menu.
  useEffect(() => {
    function handleKeyboardShortcuts(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
      if (event.key === 'Escape') {
        setShowModal(false);
        setMobileNavOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyboardShortcuts);
    return () => window.removeEventListener('keydown', handleKeyboardShortcuts);
  }, []);

  const totalItems = workspace.bookmarks.length + workspace.snippets.length + workspace.notes.length;
  const understoodCount = workspace.bookmarks.filter((item) => item.status === 'understood').length;
  const reviewCount = workspace.bookmarks.filter((item) => item.status === 'review').length;
  const goalProgress = workspace.goals.length
    ? Math.round(workspace.goals.reduce((sum, goal) => sum + goal.done, 0) /
      workspace.goals.reduce((sum, goal) => sum + Number.parseInt(goal.target.match(/\d+/)?.[0] || '1', 10), 0) * 100)
    : 0;

  const recentItems = useMemo(() => [
    ...workspace.bookmarks.map((item) => ({ ...item, kind: 'bookmark', icon: Bookmark })),
    ...workspace.snippets.map((item) => ({ ...item, kind: 'snippet', icon: Code2 })),
    ...workspace.notes.map((item) => ({ ...item, kind: 'note', icon: FileText }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5), [workspace]);

  function updateCollection(collection, nextItems) {
    setWorkspace((current) => ({ ...current, [collection]: nextItems }));
  }

  function openCreate(type) {
    setModalType(type);
    setShowModal(true);
  }

  function handleCreate(item) {
    const collection = modalType === 'bookmark' ? 'bookmarks' : modalType === 'snippet' ? 'snippets' : 'notes';
    updateCollection(collection, [{ ...item, id: makeId(collection.slice(0, 1)), createdAt: new Date().toISOString() }, ...workspace[collection]]);
    setShowModal(false);
    setToast(`${modalType === 'bookmark' ? 'Bookmark' : modalType === 'snippet' ? 'Code entry' : 'Note'} saved`);
  }

  function toggleBookmarkStatus(id) {
    updateCollection('bookmarks', workspace.bookmarks.map((item) => item.id === id
      ? { ...item, status: item.status === 'understood' ? 'review' : 'understood' }
      : item));
    setToast('Learning status updated');
  }

  function deleteItem(collection, id) {
    const item = workspace[collection].find((entry) => entry.id === id);
    if (!item) return;
    const shouldDelete = window.confirm(`Delete “${item.title}”? This cannot be undone.`);
    if (!shouldDelete) return;
    updateCollection(collection, workspace[collection].filter((entry) => entry.id !== id));
    setToast('Item deleted');
  }

  function toggleGoal(id) {
    setWorkspace((current) => ({
      ...current,
      goals: current.goals.map((goal) => goal.id === id
        ? { ...goal, done: goal.done >= Number.parseInt(goal.target.match(/\d+/)?.[0] || '1', 10) ? 0 : goal.done + 1 }
        : goal)
    }));
  }

  function togglePin(id) {
    updateCollection('notes', workspace.notes.map((note) => note.id === id ? { ...note, pinned: !note.pinned } : note));
  }

  function exportWorkspace() {
    const blob = new Blob([JSON.stringify(workspace, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `learntrace-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setToast('Workspace backup exported');
  }

  function importWorkspace(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(String(reader.result));
        const requiredCollections = ['bookmarks', 'snippets', 'notes', 'goals'];
        const validWorkspace = imported && typeof imported === 'object' &&
          requiredCollections.every((key) => Array.isArray(imported[key]));
        if (!validWorkspace) throw new Error('Invalid workspace format');
        setWorkspace({
          bookmarks: imported.bookmarks,
          snippets: imported.snippets,
          notes: imported.notes,
          goals: imported.goals
        });
        setToast('Workspace backup imported');
      } catch {
        setToast('That file is not a valid LearnTrace backup');
      }
      event.target.value = '';
    };
    reader.readAsText(file);
  }

  const pageTitle = navItems.find((item) => item.id === activePage)?.label || 'Overview';

  return (
    <div className="app-shell" data-theme={theme}>
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Activity size={21} strokeWidth={2.7} /></div>
          <div><span className="brand-name">learntrace</span><span className="brand-caption">YOUR LEARNING SPACE</span></div>
          <button className="icon-button sidebar-close" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)}><X size={18}/></button>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map(({ id, label, icon: Icon, countKey }) => (
            <button key={id} className={`nav-item ${activePage === id ? 'active' : ''}`} onClick={() => { setActivePage(id); setMobileNavOpen(false); }}>
              <Icon size={18} />
              <span>{label}</span>
              {countKey && <span className="nav-count">{workspace[countKey].length}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-section-heading"><span>YOUR FOCUS</span><MoreHorizontal size={17}/></div>
        <div className="focus-card">
          <div className="focus-icon"><Target size={17}/></div>
          <div className="focus-copy"><strong>Keep your momentum</strong><span>Small steps add up.</span></div>
          <div className="focus-spark"><Sparkles size={15}/></div>
        </div>
        <div className="sidebar-bottom">
          <div className="storage-note"><span className="storage-dot"/><span>Saved on this device</span></div>
          <button className="profile-row" onClick={exportWorkspace}>
            <div className="avatar">{getInitials()}</div>
            <div className="profile-copy"><strong>My workspace</strong><span>Personal learning</span></div>
            <Download size={16} className="profile-download"/>
          </button>
        </div>
      </aside>

      {mobileNavOpen && <button className="mobile-overlay" aria-label="Close menu overlay" onClick={() => setMobileNavOpen(false)} />}

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs">
            <button className="mobile-menu icon-button" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}><Menu size={20}/></button>
            <span>Workspace</span><span className="crumb-slash">/</span><strong>{pageTitle}</strong>
          </div>
          <div className="topbar-actions">
            <button
              className="theme-toggle icon-button"
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
            </button>
            <div className="search-box">
              <Search size={17}/>
              <input ref={searchInputRef} aria-label="Search workspace" placeholder="Search anything..." value={search} onChange={(event) => setSearch(event.target.value)} />
              {search ? <button className="search-clear" type="button" aria-label="Clear search" onClick={() => setSearch('')}><X size={14}/></button> : <kbd>Ctrl K</kbd>}
            </div>
            <button className="topbar-avatar" aria-label="Export workspace backup" title="Export workspace" onClick={exportWorkspace}>{getInitials()}</button>
          </div>
        </header>

        <div className="page-content">
          {activePage === 'overview' && (
            <Overview
              workspace={workspace} recentItems={recentItems} totalItems={totalItems}
              understoodCount={understoodCount} reviewCount={reviewCount} goalProgress={goalProgress}
              onCreate={openCreate} onNavigate={setActivePage} onToggleGoal={toggleGoal}
              onToggleStatus={toggleBookmarkStatus} onDelete={deleteItem}
              search={search} onImport={importWorkspace} onExport={exportWorkspace}
            />
          )}
          {activePage === 'bookmarks' && (
            <BookmarksPage items={workspace.bookmarks} search={search} filter={filter} setFilter={setFilter}
              onCreate={() => openCreate('bookmark')} onToggle={toggleBookmarkStatus}
              onDelete={(id) => deleteItem('bookmarks', id)} />
          )}
          {activePage === 'snippets' && (
            <SnippetsPage items={workspace.snippets} search={search}
              onCreate={() => openCreate('snippet')} onDelete={(id) => deleteItem('snippets', id)} />
          )}
          {activePage === 'notes' && (
            <NotesPage items={workspace.notes} search={search}
              onCreate={() => openCreate('note')} onDelete={(id) => deleteItem('notes', id)} onPin={togglePin} />
          )}
        </div>
        <footer className="app-footer"><span>Made for curious minds.</span><span><span className="footer-dot"/> Your progress, your pace.</span></footer>
      </main>

      {showModal && <CreateModal type={modalType} onClose={() => setShowModal(false)} onCreate={handleCreate} />}
      {toast && <div className="toast" role="status"><Check size={17}/>{toast}</div>}
    </div>
  );
}

