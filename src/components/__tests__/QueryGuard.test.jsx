import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QueryGuard from '../QueryGuard';

describe('QueryGuard', () => {
  it('opens chat panel and shows welcome message', () => {
    render(<QueryGuard />);
    fireEvent.click(screen.getByLabelText(/ask a question/i));
    expect(screen.getByText(/Ask VoteWise/i)).toBeInTheDocument();
    expect(screen.getByText(/I will not recommend candidates/i)).toBeInTheDocument();
  });

  it('blocks advisory queries with the neutrality guard', async () => {
    render(<QueryGuard />);
    fireEvent.click(screen.getByLabelText(/ask a question/i));
    const input = screen.getByPlaceholderText(/ask about elections/i);
    fireEvent.change(input, { target: { value: 'who should i vote for?' } });
    fireEvent.submit(input.closest('form'));
    expect(await screen.findByText(/NEUTRALITY GUARD ACTIVATED/i)).toBeInTheDocument();
  });

  it('falls back to keyword response when LLM not configured', async () => {
    vi.stubEnv('VITE_FEATHERLESS_API_KEY', '');
    render(<QueryGuard />);
    fireEvent.click(screen.getByLabelText(/ask a question/i));
    const input = screen.getByPlaceholderText(/ask about elections/i);
    fireEvent.change(input, { target: { value: 'how do I register' } });
    fireEvent.submit(input.closest('form'));
    expect(await screen.findByText(/voters\.eci\.gov\.in/i)).toBeInTheDocument();
    vi.unstubAllEnvs();
  });
});
