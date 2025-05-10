import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TablesPage from '@/app/business/[id]/tables/page';
import '@testing-library/jest-dom';

// Mock the BottomNavigation component
jest.mock('@/app/business/components/BottomNavigation', () => ({
  BottomNavigation: () => <div data-testid="bottom-navigation">Bottom Navigation</div>
}));

// Mock the Tabs components
jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children, onValueChange }: any) => (
    <div data-testid="tabs" onChange={onValueChange}>
      {children}
    </div>
  ),
  TabsList: ({ children }: any) => <div data-testid="tabs-list">{children}</div>,
  TabsTrigger: ({ children, value, onClick }: any) => (
    <button data-testid={`tab-${value}`} onClick={onClick}>
      {children}
    </button>
  )
}));

describe('TablesPage', () => {
  it('renders all area tabs', () => {
    render(<TablesPage />);
    
    expect(screen.getByText('Terraza')).toBeInTheDocument();
    expect(screen.getByText('Barra')).toBeInTheDocument();
    expect(screen.getByText('Interior')).toBeInTheDocument();
  });

  it('renders tables for the selected area', () => {
    render(<TablesPage />);
    
    // Initially shows terraza tables
    expect(screen.getAllByText(/Mesa \d+/)).toHaveLength(10);
    expect(screen.getByText('Mesa 1')).toBeInTheDocument();
    expect(screen.getByText('Mesa 10')).toBeInTheDocument();
  });

  it('displays correct table status', () => {
    render(<TablesPage />);
    
    // Check for different table statuses
    expect(screen.getAllByText('Pedido en curso')).toHaveLength(8);
    expect(screen.getByText('Reservada')).toBeInTheDocument();
    expect(screen.getByText('Disponible')).toBeInTheDocument();
  });

  it('displays table time and duration correctly', () => {
    render(<TablesPage />);
    
    // Check for time display
    expect(screen.getAllByText('14:40 - 40 min')).toHaveLength(8);
    expect(screen.getByText('14:45')).toBeInTheDocument();
  });

  it('renders bottom navigation', () => {
    render(<TablesPage />);
    expect(screen.getByTestId('bottom-navigation')).toBeInTheDocument();
  });
}); 