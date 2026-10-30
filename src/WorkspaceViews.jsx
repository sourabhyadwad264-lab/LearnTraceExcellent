import { useState } from 'react';
import {
  ArrowUpRight, Bookmark, BookOpen, Check, CheckCheck,
  Clock3, Clipboard, Code2, Download, FileText, Filter, Flame, FolderOpen,
  GraduationCap, Lightbulb, Pin, PinOff, Plus, Sparkles, Target, Trash2, X
} from 'lucide-react';

function formatToday() {
  return new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
    .format(new Date())
    .toUpperCase();
}

function formatDate(value) {
  if (!value) return 'Just now';
  const date = new Date(value);
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date);
}

function PageHeading({ eyebrow, title, description, action, actionLabel = 'Add new' }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>
    {action && <button className="primary-button" onClick={action}><Plus size={17}/>{actionLabel}</button>}</div>;
}

export function Overview({ workspace, recentItems, totalItems, understoodCount, reviewCount, goalProgress, onCreate, onNavigate, onToggleGoal, onToggleStatus, onDelete, search, onImport, onExport }) {
  const filteredRecent = recentItems.filter((item) => `${item.title} ${item.course || ''} ${item.language || ''} ${item.note || ''} ${item.body || ''}`.toLowerCase().includes(search.toLowerCase()));
  return <>
    <PageHeading eyebrow={formatToday()} title="Your learning, in focus." description="Pick up where you left off. Every small insight moves you forward." action={() => onCreate('bookmark')} actionLabel="Capture a moment"/>
    <section className="welcome-banner">
      <div className="welcome-copy"><div className="welcome-kicker"><Sparkles size={15}/> YOUR PERSONAL LEARNING SPACE</div><h2>Progress isn't always a straight line.<br/><span>Keep following the thread.</span></h2><p>Capture what matters today. Make it easier for tomorrow-you to continue.</p><button className="banner-button" onClick={() => onCreate('note')}>Write a quick note <ArrowUpRight size={16}/></button></div>
      <div className="banner-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="art-core"><GraduationCap size={38}/></div><div className="art-node node-one"><Bookmark size={17}/></div><div className="art-node node-two"><Code2 size={18}/></div><div className="art-node node-three"><Lightbulb size={17}/></div><div className="art-spark spark-one">✳</div><div className="art-spark spark-two">✦</div></div>
    </section>

    <section className="stats-grid" aria-label="Workspace statistics">
      <StatCard icon={Bookmark} iconClass="purple" label="Captured moments" value={workspace.bookmarks.length} foot={`${reviewCount} to revisit`} trend="Keep collecting" />
      <StatCard icon={Code2} iconClass="blue" label="Code entries" value={workspace.snippets.length} foot="Your personal code shelf" trend="Build your toolkit" />
      <StatCard icon={CheckCheck} iconClass="green" label="Concepts understood" value={understoodCount} foot="Marked as understood" trend="Knowledge compounds" />
      <StatCard icon={Flame} iconClass="orange" label="Learning assets" value={totalItems} foot="Across your workspace" trend="Your library grows" />
    </section>

    <div className="content-grid">
      <section className="panel recent-panel">
        <div className="panel-heading"><div><h3>Recently captured</h3><p>Your latest learning trail</p></div><button className="text-button" onClick={() => onNavigate('bookmarks')}>View all <ArrowUpRight size={15}/></button></div>
        <div className="recent-list">
          {filteredRecent.length ? filteredRecent.map((item) => <div className="recent-item" key={`${item.kind}-${item.id}`}>
            <div className={`recent-icon ${item.kind}`}><item.icon size={17}/></div>
            <div className="recent-copy"><strong>{item.title}</strong><span>{item.course || item.language || 'Personal note'} <span className="bullet">·</span> {formatDate(item.createdAt)}</span></div>
            {item.kind === 'bookmark' && <button className={`status-pill ${item.status}`} onClick={() => onToggleStatus(item.id)}>{item.status === 'understood' ? <Check size={13}/> : <Clock3 size={13}/>} {item.status === 'understood' ? 'Understood' : 'Review'}</button>}
            <button className="subtle-icon-button" aria-label={`Delete ${item.title}`} onClick={() => onDelete(item.kind === 'bookmark' ? 'bookmarks' : item.kind === 'snippet' ? 'snippets' : 'notes', item.id)}><Trash2 size={15}/></button>
          </div>) : <EmptyState title="Nothing matches your search" text="Try another keyword or capture a new learning moment." />}
        </div>
        <div className="quick-add-row">
          <button onClick={() => onCreate('bookmark')}><span className="quick-add-icon purple"><Bookmark size={15}/></span>Bookmark moment <Plus size={15}/></button>
          <button onClick={() => onCreate('snippet')}><span className="quick-add-icon blue"><Code2 size={15}/></span>Save code snippet <Plus size={15}/></button>
          <button onClick={() => onCreate('note')}><span className="quick-add-icon amber"><FileText size={15}/></span>Add a note <Plus size={15}/></button>
        </div>
      </section>

      <section className="panel goals-panel">
        <div className="panel-heading"><div><h3>This week's focus</h3><p>Small goals, meaningful progress</p></div><div className="goal-round-icon"><Target size={17}/></div></div>
        <div className="goal-progress-row"><div><strong>{goalProgress}%</strong><span>overall progress</span></div><div className="progress-ring"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="17" className="ring-track"/><circle cx="22" cy="22" r="17" className="ring-value" style={{ strokeDasharray: `${Math.min(goalProgress, 100) * 1.068} 107` }}/></svg><Check size={14}/></div></div>
        <div className="goal-list">{workspace.goals.map((goal) => {
          const target = Number.parseInt(goal.target.match(/\d+/)?.[0] || '1', 10);
          const done = goal.done >= target;
          return <button className="goal-item" key={goal.id} onClick={() => onToggleGoal(goal.id)}>
            <span className={`goal-check ${done ? 'checked' : ''}`}>{done && <Check size={13}/>}</span>
            <span className="goal-copy"><strong>{goal.title}</strong><small>{goal.target}</small><span className="mini-progress"><span style={{ width: `${Math.min(goal.done / target * 100, 100)}%` }}/></span></span>
            <span className="goal-count">{goal.done}/{target}</span>
          </button>;
        })}</div>
        <div className="goal-tip"><Lightbulb size={16}/><span><strong>A little reminder</strong> You don't need to master everything today. Just take the next step.</span></div>
      </section>
    </div>

    <section className="bottom-tools">
      <div className="bottom-tool-copy"><div className="tool-icon"><FolderOpen size={19}/></div><div><strong>Your learning belongs to you.</strong><p>Export a backup or restore your workspace on this device.</p></div></div>
      <div className="tool-actions"><button className="secondary-button" onClick={onExport}><Download size={16}/>Export backup</button><label className="secondary-button upload-button"><Clipboard size={16}/>Import backup<input type="file" accept="application/json,.json" onChange={onImport}/></label></div>
    </section>
  </>;
}

function StatCard({ icon: Icon, iconClass, label, value, foot, trend }) {
  return <div className="stat-card"><div className={`stat-icon ${iconClass}`}><Icon size={18}/></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-foot"><span>{foot}</span></div><div className="stat-trend"><ArrowUpRight size={13}/>{trend}</div></div>;
}

export function BookmarksPage({ items, search, filter, setFilter, onCreate, onToggle, onDelete }) {
  const visible = items.filter((item) => `${item.title} ${item.course} ${item.source} ${item.note}`.toLowerCase().includes(search.toLowerCase()))
    .filter((item) => filter === 'all' || item.status === filter);
  return <>
    <PageHeading eyebrow="YOUR LEARNING TRAIL" title="Learning bookmarks" description="Save the exact moment you want to return to, and leave a note for your future self." action={onCreate} actionLabel="Capture a moment"/>
    <div className="list-toolbar"><div className="filter-label"><Filter size={16}/> Filter by status</div><div className="filter-tabs">{[['all','All moments'],['review','To revisit'],['understood','Understood']].map(([value,label]) => <button key={value} className={filter === value ? 'selected' : ''} onClick={() => setFilter(value)}>{label}<span aria-hidden="true">{value === 'all' ? items.length : items.filter((item) => item.status === value).length}</span></button>)}</div></div>
    <div className="bookmark-grid">{visible.map((item) => <article className="bookmark-card" key={item.id}><div className="bookmark-card-top"><span className="course-chip">{item.course}</span><button className="subtle-icon-button" aria-label={`Delete ${item.title}`} onClick={() => onDelete(item.id)}><Trash2 size={16}/></button></div><h3>{item.title}</h3><div className="timestamp-line"><Clock3 size={15}/><strong>{item.timestamp}</strong><span>{item.source}</span></div><p>{item.note || 'No note added yet.'}</p><div className="bookmark-card-bottom"><span className={`status-pill ${item.status}`}>{item.status === 'understood' ? <Check size={13}/> : <Clock3 size={13}/>} {item.status === 'understood' ? 'Understood' : 'To revisit'}</span><button className="text-button" onClick={() => onToggle(item.id)}>{item.status === 'understood' ? 'Revisit this' : 'Mark as done'} <ArrowUpRight size={14}/></button></div></article>)}</div>
    {!visible.length && <EmptyState title="No bookmarks found" text="Try changing the filter or capture your next learning moment." action={onCreate} actionLabel="Add a bookmark"/>}
  </>;
}

export function SnippetsPage({ items, search, onCreate, onDelete }) {
  const visible = items.filter((item) => `${item.title} ${item.language} ${item.code} ${item.explanation} ${(item.tags || []).join(' ')}`.toLowerCase().includes(search.toLowerCase()));
  async function copyCode(code) {
    try { await navigator.clipboard.writeText(code); } catch { /* Clipboard can be unavailable in insecure contexts. */ }
  }
  return <>
    <PageHeading eyebrow="YOUR PERSONAL CODE SHELF" title="Code journal" description="Collect useful patterns with enough context to understand them later." action={onCreate} actionLabel="Save a snippet"/>
    <div className="snippet-grid">{visible.map((item) => <article className="snippet-card" key={item.id}><div className="snippet-head"><div className="language-badge"><Code2 size={14}/>{item.language}</div><button className="subtle-icon-button" aria-label={`Delete ${item.title}`} onClick={() => onDelete(item.id)}><Trash2 size={15}/></button></div><h3>{item.title}</h3><pre><code>{item.code}</code></pre><p>{item.explanation}</p><div className="tag-row">{(item.tags || []).map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div><button className="copy-code-button" onClick={() => copyCode(item.code)}><Clipboard size={15}/>Copy code</button></article>)}</div>
    {!visible.length && <EmptyState title="Your code shelf is waiting" text="Save a code pattern and add an explanation so you remember why it works." action={onCreate} actionLabel="Save your first snippet"/>}
  </>;
}

export function NotesPage({ items, search, onCreate, onDelete, onPin }) {
  const visible = items.filter((item) => `${item.title} ${item.body} ${item.course}`.toLowerCase().includes(search.toLowerCase())).sort((a, b) => Number(b.pinned) - Number(a.pinned));
  return <>
    <PageHeading eyebrow="THINK IT THROUGH" title="Notes & questions" description="Keep your explanations, open questions, and aha moments in one calm space." action={onCreate} actionLabel="Write a note"/>
    <div className="notes-grid">{visible.map((note) => <article className={`note-card ${note.pinned ? 'pinned' : ''}`} key={note.id}><div className="note-top"><span className="course-chip">{note.course || 'General'}</span><div className="note-actions"><button className="subtle-icon-button" aria-label={note.pinned ? `Unpin ${note.title}` : `Pin ${note.title}`} onClick={() => onPin(note.id)}>{note.pinned ? <PinOff size={15}/> : <Pin size={15}/>}</button><button className="subtle-icon-button" aria-label={`Delete ${note.title}`} onClick={() => onDelete(note.id)}><Trash2 size={15}/></button></div></div><h3>{note.title}</h3><p>{note.body}</p><div className="note-footer"><span>{formatDate(note.createdAt)}</span>{note.pinned && <span className="pinned-label"><Pin size={12}/> Pinned</span>}</div></article>)}</div>
    {!visible.length && <EmptyState title="A blank page can be a good start" text="Capture a question from class, a concept in your own words, or an idea to explore." action={onCreate} actionLabel="Write a note"/>}
  </>;
}

function EmptyState({ title, text, action, actionLabel }) {
  return <div className="empty-state"><div className="empty-icon"><BookOpen size={22}/></div><h3>{title}</h3><p>{text}</p>{action && <button className="secondary-button" onClick={action}><Plus size={16}/>{actionLabel}</button>}</div>;
}

export function CreateModal({ type, onClose, onCreate }) {
  const [form, setForm] = useState({ title: '', course: '', timestamp: '', source: '', note: '', status: 'review', language: 'JavaScript', code: '', explanation: '', tags: '', body: '' });
  const [error, setError] = useState('');
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const isBookmark = type === 'bookmark';
  const isSnippet = type === 'snippet';
  const heading = isBookmark ? 'Capture a learning moment' : isSnippet ? 'Save a code snippet' : 'Write a note';
  function submit(event) {
    event.preventDefault();
    if (!form.title.trim()) { setError('Please add a title.'); return; }
    if (isBookmark && !/^\d{2}:\d{2}(:\d{2})?$/.test(form.timestamp.trim())) { setError('Use a timestamp like 00:42:18.'); return; }
    if (isSnippet && !form.code.trim()) { setError('Add the code you want to save.'); return; }
    if (!isBookmark && !isSnippet && !form.body.trim()) { setError('Add the note content.'); return; }
    if (isBookmark) onCreate({ title: form.title.trim(), course: form.course.trim() || 'General', timestamp: form.timestamp.trim(), source: form.source.trim() || 'Self-study', note: form.note.trim(), status: form.status });
    else if (isSnippet) onCreate({ title: form.title.trim(), language: form.language, code: form.code, explanation: form.explanation.trim(), tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean) });
    else onCreate({ title: form.title.trim(), body: form.body.trim(), course: form.course.trim() || 'General', pinned: false });
  }
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="create-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-header"><div><span className="eyebrow">ADD TO YOUR WORKSPACE</span><h2 id="modal-title">{heading}</h2></div><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={20}/></button></div><form onSubmit={submit} className="modal-form">
    <label>Title <span className="required">*</span><input autoFocus value={form.title} onChange={(event) => update('title', event.target.value)} placeholder={isBookmark ? 'What do you want to remember?' : isSnippet ? 'What does this code do?' : 'Give this note a title'} /></label>
    {isBookmark && <><div className="form-two-col"><label>Lecture timestamp <span className="required">*</span><input value={form.timestamp} onChange={(event) => update('timestamp', event.target.value)} placeholder="00:42:18"/></label><label>Course or topic<input value={form.course} onChange={(event) => update('course', event.target.value)} placeholder="e.g. Spring Boot"/></label></div><label>Session / source<input value={form.source} onChange={(event) => update('source', event.target.value)} placeholder="e.g. Live class · Session 12"/></label><label>Note to your future self<textarea rows="3" value={form.note} onChange={(event) => update('note', event.target.value)} placeholder="What happened here? What should you revisit?"/></label><label>Understanding status<select value={form.status} onChange={(event) => update('status', event.target.value)}><option value="review">Need to revisit</option><option value="understood">Understood</option></select></label></>}
    {isSnippet && <><label>Language<select value={form.language} onChange={(event) => update('language', event.target.value)}>{['JavaScript','Java','SQL','HTML','CSS','JSON','Bash','Other'].map((language) => <option key={language}>{language}</option>)}</select></label><label>Code <span className="required">*</span><textarea className="code-input" rows="6" value={form.code} onChange={(event) => update('code', event.target.value)} placeholder="Paste your code here..."/></label><label>What does it do?<textarea rows="2" value={form.explanation} onChange={(event) => update('explanation', event.target.value)} placeholder="Explain the idea in your own words."/></label><label>Tags <span className="optional">(comma separated)</span><input value={form.tags} onChange={(event) => update('tags', event.target.value)} placeholder="React, arrays, hooks"/></label></>}
    {!isBookmark && !isSnippet && <><label>Course or topic<input value={form.course} onChange={(event) => update('course', event.target.value)} placeholder="e.g. Backend development"/></label><label>Your note <span className="required">*</span><textarea rows="6" value={form.body} onChange={(event) => update('body', event.target.value)} placeholder="Write an explanation, question, or idea..."/></label></>}
    {error && <p className="form-error" role="alert">{error}</p>}<div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button"><Check size={16}/>Save to workspace</button></div>
  </form></section></div>;
}
