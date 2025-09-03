import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveBeenCalledWith(..._args: any[]): R;
      toBeDisabled(): R;
      toHaveTextContent(_text: string | RegExp): R;
      toHaveValue(_value: string | string[] | number): R;
      toHaveFocus(): R;
      toHaveAttribute(_attr: string, _value?: string): R;
      toHaveClass(..._classNames: string[]): R;
      toHaveLength(_length: number): R;
    }
  }
}
