import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';

beforeEach(() => localStorage.clear());

describe('LearnTrace app', () => {
  it('renders the overview and seeded learning data', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /your learning, in focus/i })).toBeInTheDocument();
    expect(screen.getByText(/dependency injection: constructor vs field injection/i)).toBeInTheDocument();
  });

  it('navigates to code journal', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /code journal/i }));
    expect(screen.getByRole('heading', { name: 'Code journal' })).toBeInTheDocument();
    expect(screen.getByText('Find products by partial name')).toBeInTheDocument();
  });

  it('creates a learning bookmark with a valid timestamp', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /capture a moment/i }));
    await user.type(screen.getByLabelText(/title/i), 'My new bookmark');
    await user.type(screen.getByLabelText(/lecture timestamp/i), '00:15:20');
    await user.type(screen.getByLabelText(/course or topic/i), 'React');
    await user.click(screen.getByRole('button', { name: /save to workspace/i }));
    expect(screen.getByText('My new bookmark')).toBeInTheDocument();
  });

  it('shows validation when bookmark timestamp is invalid', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /capture a moment/i }));
    await user.type(screen.getByLabelText(/title/i), 'Invalid timestamp example');
    await user.type(screen.getByLabelText(/lecture timestamp/i), '15 minutes');
    await user.click(screen.getByRole('button', { name: /save to workspace/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/use a timestamp like 00:42:18/i);
  });

  it('filters bookmarks by status', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /learning bookmarks/i }));
    await user.click(screen.getByRole('button', { name: /understood/i }));
    expect(screen.getByText('React useEffect cleanup')).toBeInTheDocument();
    expect(screen.queryByText('Dependency Injection: constructor vs field injection')).not.toBeInTheDocument();
  });

  it('switches between light and dark themes and remembers the choice', async () => {
    const user = userEvent.setup();
    const { container, unmount } = render(<App />);
    await user.click(screen.getByRole('button', { name: /switch to dark theme/i }));
    expect(container.querySelector('.app-shell')).toHaveAttribute('data-theme', 'dark');
    expect(localStorage.getItem('learntrace:theme')).toBe('dark');
    unmount();
    render(<App />);
    expect(document.querySelector('.app-shell')).toHaveAttribute('data-theme', 'dark');
  });

  it('lets the user clear a workspace search', async () => {
    const user = userEvent.setup();
    render(<App />);
    const searchInput = screen.getByRole('textbox', { name: /search workspace/i });
    await user.type(searchInput, 'a keyword that does not exist');
    await user.click(screen.getByRole('button', { name: /clear search/i }));
    expect(searchInput).toHaveValue('');
  });

  it('switches between light and dark themes and remembers the choice', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    const appShell = container.querySelector('.app-shell');

    expect(appShell).toHaveAttribute('data-theme', 'light');
    await user.click(screen.getByRole('button', { name: /switch to dark theme/i }));
    expect(appShell).toHaveAttribute('data-theme', 'dark');
    expect(localStorage.getItem('learntrace:theme')).toBe('dark');
  });

});
