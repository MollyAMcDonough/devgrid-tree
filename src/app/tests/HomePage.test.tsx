/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import HomePage from '../page';

// Mock next/navigation for useRouter and related hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// Mock FactoryTable to avoid rendering its internals in this test
jest.mock('@/app/components/FactoryTable', () => {
  const MockFactoryTable = () => <div>FactoryTable</div>;
  MockFactoryTable.displayName = 'MockFactoryTable';
  return MockFactoryTable;
});

// Mock fetch to avoid real API calls
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([]),
    })
  ) as jest.Mock;
});

afterAll(() => {
  jest.resetAllMocks();
});

describe('HomePage', () => {
  it('renders the Factories heading', async () => {
    render(<HomePage />);
    await waitFor(() => {
      expect(screen.getByText(/Factories/i)).toBeInTheDocument();
    });
  });

  it('renders the Add Factory link', async () => {
    render(<HomePage />);
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /Add Factory/i })).toBeInTheDocument();
    });
  });

  it('renders the FactoryTable placeholder', async () => {
    render(<HomePage />);
    await waitFor(() => {
      expect(screen.getByText(/FactoryTable/i)).toBeInTheDocument();
    });
  });

  it('shows loading spinner', () => {
    render(<HomePage />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
