
// Setup file for Jest
import '@testing-library/jest-dom';

// Make sure global test functions are defined for TypeScript
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
    }
  }
}
