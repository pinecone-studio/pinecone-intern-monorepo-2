// This test file validates that the jest-dom custom matchers are properly typed and available

describe('Jest DOM Custom Matchers', () => {
  it('should have toBeInTheDocument matcher available', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    expect(element).toBeInTheDocument();

    document.body.removeChild(element);
  });

  it('should have toHaveClass matcher available', () => {
    const element = document.createElement('div');
    element.className = 'test-class another-class';

    expect(element).toHaveClass('test-class');
    expect(element).toHaveClass('another-class');
    expect(element).not.toHaveClass('non-existent-class');
  });

  it('should have toHaveBeenCalled matcher available', () => {
    const mockFunction = jest.fn();

    expect(mockFunction).not.toHaveBeenCalled();

    mockFunction();

    expect(mockFunction).toHaveBeenCalled();
  });

  it('should work with custom matchers in component testing context', () => {
    // Create a real DOM element to test the matchers
    const element = document.createElement('div');
    element.className = 'test-class';
    document.body.appendChild(element);

    // This validates that the types are properly extended
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('test-class');

    document.body.removeChild(element);
  });
});
