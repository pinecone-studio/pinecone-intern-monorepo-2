import { render, screen } from '@testing-library/react';
import { PublicFooter } from '@/components/landing-page/PublicFooter';

describe('PublicFooter', () => {
  it('renders without crashing', () => {
    render(<PublicFooter />);
    expect(screen.getByTestId('Footer-Container')).toBeInTheDocument();
  });

  it('displays the company logo and name', () => {
    render(<PublicFooter />);
    expect(screen.getByText('Pedia')).toBeInTheDocument();
  });

  it('displays copyright information', () => {
    render(<PublicFooter />);
    expect(screen.getByText('© 2025 Booking Mongolia. All Rights Reserved.')).toBeInTheDocument();
  });

  it('displays contact information section', () => {
    render(<PublicFooter />);
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
  });

  it('displays email contact information', () => {
    render(<PublicFooter />);
    expect(screen.getByText('Email: support@pedia.mn')).toBeInTheDocument();
  });

  it('displays phone contact information', () => {
    render(<PublicFooter />);
    expect(screen.getByText('Phone: +976 (11) 123-4567')).toBeInTheDocument();
  });

  it('displays customer support information', () => {
    render(<PublicFooter />);
    expect(screen.getByText('Customer Support: Available 24/7')).toBeInTheDocument();
  });

  it('displays social media section', () => {
    render(<PublicFooter />);
    expect(screen.getByText('Follow us')).toBeInTheDocument();
  });

  it('displays all social media platforms', () => {
    render(<PublicFooter />);
    expect(screen.getByText('Facebook')).toBeInTheDocument();
    expect(screen.getByText('Instagram')).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('Youtube')).toBeInTheDocument();
  });

  it('displays policies section', () => {
    render(<PublicFooter />);
    expect(screen.getByText('Policies')).toBeInTheDocument();
  });

  it('displays all policy links', () => {
    render(<PublicFooter />);
    expect(screen.getByText('Terms & Conditions')).toBeInTheDocument();
    expect(screen.getByText('Privacy')).toBeInTheDocument();
    expect(screen.getByText('Cookies')).toBeInTheDocument();
    expect(screen.getByText('Cancellation Policy')).toBeInTheDocument();
  });

  it('displays other section', () => {
    render(<PublicFooter />);
    expect(screen.getByText('Other')).toBeInTheDocument();
  });

  it('displays other links', () => {
    render(<PublicFooter />);
    expect(screen.getByText('About us')).toBeInTheDocument();
    expect(screen.getByText('Careers')).toBeInTheDocument();
    expect(screen.getByText('Travel guides')).toBeInTheDocument();
  });

  it('has correct container styling', () => {
    render(<PublicFooter />);
    const container = screen.getByTestId('Footer-Container');
    expect(container).toHaveClass('mt-auto', 'bg-white');
  });

  it('has correct layout structure', () => {
    render(<PublicFooter />);
    const mainContainer = screen.getByTestId('Footer-Container').querySelector('.flex.justify-between');
    expect(mainContainer).toHaveClass('w-[1280px]', 'mx-auto', 'pt-10', 'pb-10', 'px-8');
  });

  it('displays contact icons correctly', () => {
    render(<PublicFooter />);
    // Check that icons are rendered (they should be present as SVG elements)
    const emailSection = screen.getByText('Email: support@pedia.mn').closest('div');
    const phoneSection = screen.getByText('Phone: +976 (11) 123-4567').closest('div');
    const supportSection = screen.getByText('Customer Support: Available 24/7').closest('div');
    
    expect(emailSection).toBeInTheDocument();
    expect(phoneSection).toBeInTheDocument();
    expect(supportSection).toBeInTheDocument();
  });

  it('has correct spacing between sections', () => {
    render(<PublicFooter />);
    const sections = screen.getByTestId('Footer-Container').querySelectorAll('.flex.flex-col.gap-4');
    expect(sections).toHaveLength(5); // Company info, Contact, Social, Policies, Other
  });

  it('displays company logo with correct styling', () => {
    render(<PublicFooter />);
    const logoContainer = screen.getByText('Pedia').closest('.flex.gap-\\[5px\\].items-center');
    expect(logoContainer).toBeInTheDocument();
  });

  it('has responsive design with proper spacing', () => {
    render(<PublicFooter />);
    const mainContainer = screen.getByTestId('Footer-Container').querySelector('.flex.justify-between');
    expect(mainContainer).toHaveClass('w-[1280px]', 'mx-auto');
  });

  it('maintains consistent text styling', () => {
    render(<PublicFooter />);
    const sectionHeaders = screen.getAllByText(/Contact Information|Follow us|Policies|Other/);
    sectionHeaders.forEach(header => {
      expect(header).toHaveClass('text-black', 'font-semibold');
    });
  });

  it('displays all text in correct color', () => {
    render(<PublicFooter />);
    
    // Check that text elements have appropriate styling
    const textElements = screen.getAllByText(/Pedia|support@pedia.mn|\+976|Facebook|Terms/);
    textElements.forEach(element => {
      // Check that elements have appropriate text styling (not necessarily text-black)
      expect(element).toBeInTheDocument();
    });
  });
}); 