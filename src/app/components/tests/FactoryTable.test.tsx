/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import FactoryTable from '../FactoryTable';

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

test('renders FactoryTable headers', () => {
  render(<FactoryTable factories={[]} />);
  expect(screen.getByText(/Name/i)).toBeInTheDocument();
  expect(screen.getByText(/Lower Bound/i)).toBeInTheDocument();
  expect(screen.getByText(/Upper Bound/i)).toBeInTheDocument();
});
