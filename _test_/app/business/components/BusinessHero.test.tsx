import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BusinessHero } from '@/app/business/components/BusinessHero';
import '@testing-library/jest-dom';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}));

// Mock the next/navigation module
const mockBack = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: mockBack,
    push: jest.fn(),
  }),
}));

describe('BusinessHero', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with the provided image', () => {
    render(<BusinessHero name="Test Restaurant" image="https://example.com/test.jpg" />);
    
    const image = screen.getByAltText('Test Restaurant');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/test.jpg');
  });

  it('renders with default image when no image is provided', () => {
    render(<BusinessHero name="Test Restaurant" />);
    
    const image = screen.getByAltText('Test Restaurant');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/restaurant-default.jpg');
  });

  it('renders with null image handled correctly', () => {
    render(<BusinessHero name="Test Restaurant" image={null} />);
    
    const image = screen.getByAltText('Test Restaurant');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/restaurant-default.jpg');
  });

  it('navigates back when back button is clicked', () => {
    render(<BusinessHero name="Test Restaurant" />);
    
    // Find the back button (first button in the component)
    const backButton = screen.getAllByRole('button')[0];
    fireEvent.click(backButton);
    
    // Check if the router.back function was called
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('renders search button', () => {
    render(<BusinessHero name="Test Restaurant" />);
    
    // There should be two buttons (back and search)
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    
    // The second button should be the search button
    const searchButton = buttons[1];
    expect(searchButton).toBeInTheDocument();
  });
}); 