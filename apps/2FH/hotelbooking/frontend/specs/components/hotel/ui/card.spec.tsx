import { render, screen } from '@testing-library/react';
import React from 'react';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '../../../../src/components/ui/Card';

describe('Card Components', () => {
  describe('Card', () => {
    it('renders card with default styling', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('renders card with custom className', () => {
      render(<Card className="custom-class">Card content</Card>);
      const card = screen.getByText('Card content');
      expect(card).toHaveClass('custom-class');
    });

    it('forwards ref correctly', () => {
      const ref = jest.fn();
      render(<Card ref={ref}>Card content</Card>);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('CardHeader', () => {
    it('renders card header with default styling', () => {
      render(<CardHeader>Header content</CardHeader>);
      expect(screen.getByText('Header content')).toBeInTheDocument();
    });

    it('renders card header with custom className', () => {
      render(<CardHeader className="custom-header">Header content</CardHeader>);
      const header = screen.getByText('Header content');
      expect(header).toHaveClass('custom-header');
    });

    it('forwards ref correctly', () => {
      const ref = jest.fn();
      render(<CardHeader ref={ref}>Header content</CardHeader>);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('CardTitle', () => {
    it('renders card title with default styling', () => {
      render(<CardTitle>Title content</CardTitle>);
      expect(screen.getByText('Title content')).toBeInTheDocument();
    });

    it('renders card title with custom className', () => {
      render(<CardTitle className="custom-title">Title content</CardTitle>);
      const title = screen.getByText('Title content');
      expect(title).toHaveClass('custom-title');
    });

    it('forwards ref correctly', () => {
      const ref = jest.fn();
      render(<CardTitle ref={ref}>Title content</CardTitle>);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('CardDescription', () => {
    it('renders card description with default styling', () => {
      render(<CardDescription>Description content</CardDescription>);
      expect(screen.getByText('Description content')).toBeInTheDocument();
    });

    it('renders card description with custom className', () => {
      render(<CardDescription className="custom-description">Description content</CardDescription>);
      const description = screen.getByText('Description content');
      expect(description).toHaveClass('custom-description');
    });

    it('forwards ref correctly', () => {
      const ref = jest.fn();
      render(<CardDescription ref={ref}>Description content</CardDescription>);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('CardContent', () => {
    it('renders card content with default styling', () => {
      render(<CardContent>Content</CardContent>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders card content with custom className', () => {
      render(<CardContent className="custom-content">Content</CardContent>);
      const content = screen.getByText('Content');
      expect(content).toHaveClass('custom-content');
    });

    it('forwards ref correctly', () => {
      const ref = jest.fn();
      render(<CardContent ref={ref}>Content</CardContent>);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('CardFooter', () => {
    it('renders card footer with default styling', () => {
      render(<CardFooter>Footer content</CardFooter>);
      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });

    it('renders card footer with custom className', () => {
      render(<CardFooter className="custom-footer">Footer content</CardFooter>);
      const footer = screen.getByText('Footer content');
      expect(footer).toHaveClass('custom-footer');
    });

    it('forwards ref correctly', () => {
      const ref = jest.fn();
      render(<CardFooter ref={ref}>Footer content</CardFooter>);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Card composition', () => {
    it('renders complete card structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>Card Content</CardContent>
          <CardFooter>Card Footer</CardFooter>
        </Card>
      );

      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card Description')).toBeInTheDocument();
      expect(screen.getByText('Card Content')).toBeInTheDocument();
      expect(screen.getByText('Card Footer')).toBeInTheDocument();
    });
  });
});
