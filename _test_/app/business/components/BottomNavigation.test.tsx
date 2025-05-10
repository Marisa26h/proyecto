import React from 'react';
import { render, screen } from '@testing-library/react';
import { BottomNavigation } from '@/app/business/components/BottomNavigation';
import '@testing-library/jest-dom';

// Mock Next.js hooks
const mockUseParams = jest.fn();
const mockUsePathname = jest.fn();

jest.mock('next/navigation', () => ({
  useParams: () => mockUseParams(),
  usePathname: () => mockUsePathname()
}));

describe('BottomNavigation', () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ id: '123' });
    mockUsePathname.mockReturnValue('/business/123');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders all navigation buttons', () => {
    render(<BottomNavigation />);
    
    // Check if all navigation items are rendered
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Mesas')).toBeInTheDocument();
    expect(screen.getByText('Pedidos')).toBeInTheDocument();
    expect(screen.getByText('Perfil')).toBeInTheDocument();
  });

  it('has the correct styling for active and inactive buttons when on home page', () => {
    mockUsePathname.mockReturnValue('/business/123');
    render(<BottomNavigation />);
    
    // The "Inicio" button should be active (orange color)
    const homeButton = screen.getByText('Inicio').closest('a');
    expect(homeButton).toHaveClass('text-orange-500');
    
    // The other buttons should be inactive (gray color)
    const tableButton = screen.getByText('Mesas').closest('a');
    const ordersButton = screen.getByText('Pedidos').closest('button');
    const profileButton = screen.getByText('Perfil').closest('button');
    
    expect(tableButton).toHaveClass('text-gray-500');
    expect(ordersButton).toHaveClass('text-gray-500');
    expect(profileButton).toHaveClass('text-gray-500');
  });

  it('has the correct styling for active and inactive buttons when on tables page', () => {
    mockUsePathname.mockReturnValue('/business/123/tables');
    render(<BottomNavigation />);
    
    // The "Mesas" button should be active (orange color)
    const tableButton = screen.getByText('Mesas').closest('a');
    expect(tableButton).toHaveClass('text-orange-500');
    
    // The other buttons should be inactive (gray color)
    const homeButton = screen.getByText('Inicio').closest('a');
    const ordersButton = screen.getByText('Pedidos').closest('button');
    const profileButton = screen.getByText('Perfil').closest('button');
    
    expect(homeButton).toHaveClass('text-gray-500');
    expect(ordersButton).toHaveClass('text-gray-500');
    expect(profileButton).toHaveClass('text-gray-500');
  });

  it('has the correct styling for active and inactive buttons when on a different page', () => {
    mockUsePathname.mockReturnValue('/business/123/other');
    render(<BottomNavigation />);
    
    // All buttons should be inactive (gray color)
    const homeButton = screen.getByText('Inicio').closest('a');
    const tableButton = screen.getByText('Mesas').closest('a');
    const ordersButton = screen.getByText('Pedidos').closest('button');
    const profileButton = screen.getByText('Perfil').closest('button');
    
    expect(homeButton).toHaveClass('text-gray-500');
    expect(tableButton).toHaveClass('text-gray-500');
    expect(ordersButton).toHaveClass('text-gray-500');
    expect(profileButton).toHaveClass('text-gray-500');
  });

  it('handles null pathname gracefully', () => {
    mockUsePathname.mockReturnValue(null);
    render(<BottomNavigation />);
    
    // All buttons should be inactive (gray color)
    const homeButton = screen.getByText('Inicio').closest('a');
    const tableButton = screen.getByText('Mesas').closest('a');
    const ordersButton = screen.getByText('Pedidos').closest('button');
    const profileButton = screen.getByText('Perfil').closest('button');
    
    expect(homeButton).toHaveClass('text-gray-500');
    expect(tableButton).toHaveClass('text-gray-500');
    expect(ordersButton).toHaveClass('text-gray-500');
    expect(profileButton).toHaveClass('text-gray-500');
  });

  it('renders with the correct layout', () => {
    render(<BottomNavigation />);
    
    // Check if the container has the correct classes
    const container = screen.getByText('Inicio').closest('div');
    expect(container).toHaveClass('fixed bottom-0 left-0 right-0');
    expect(container).toHaveClass('flex justify-around');
  });

  it('generates correct navigation links', () => {
    mockUseParams.mockReturnValue({ id: '456' });
    render(<BottomNavigation />);
    
    // Check if the links have the correct hrefs
    const homeLink = screen.getByText('Inicio').closest('a');
    const tablesLink = screen.getByText('Mesas').closest('a');
    
    expect(homeLink).toHaveAttribute('href', '/business/456');
    expect(tablesLink).toHaveAttribute('href', '/business/456/tables');
  });
}); 