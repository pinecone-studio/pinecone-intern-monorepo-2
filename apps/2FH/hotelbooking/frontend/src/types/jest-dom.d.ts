import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toBeChecked(): R;
      toBeDisabled(): R;
      toHaveClass(..._classNames: string[]): R;
      toHaveAttribute(_attr: string, _value?: string): R;
    }
  }
}
