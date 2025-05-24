import '@testing-library/jest-dom';

// Always mock global fetch for all tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    ok: true,
    status: 200,
  })
) as jest.Mock;
