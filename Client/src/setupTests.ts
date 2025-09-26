// This import adds the custom Jest DOM matchers for asserting on DOM nodes.
// It allows you to do things like:
// expect(element).toBeInTheDocument();
// expect(element).toHaveValue('some-value');
import '@testing-library/jest-dom';

import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// This runs a cleanup function after each test case, which is a best practice
// to prevent tests from affecting each other.
afterEach(() => {
  cleanup();
});
