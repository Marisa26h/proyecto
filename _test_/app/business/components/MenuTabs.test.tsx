import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MenuTabs } from '@/app/business/components/MenuTabs';
import '@testing-library/jest-dom';

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Menu: () => <div data-testid="menu-icon">Menu Icon</div>
}));

// Mock the drawer components
jest.mock('@/components/ui/drawer', () => ({
  Drawer: ({ children }: any) => <div data-testid="drawer">{children}</div>,
  DrawerTrigger: ({ children }: any) => <div data-testid="drawer-trigger">{children}</div>,
  DrawerContent: ({ children }: any) => <div data-testid="drawer-content">{children}</div>,
  DrawerHeader: ({ children }: any) => <div data-testid="drawer-header">{children}</div>,
  DrawerTitle: ({ children }: any) => <div data-testid="drawer-title">{children}</div>,
  DrawerClose: ({ children }: any) => <div data-testid="drawer-close">{children}</div>,
}));

// Mock the button component
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, className }: any) => (
    <button 
      data-testid={`button-${variant}${className?.includes('md:hidden') ? '-menu' : ''}`} 
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));

// Mock the ProductCard component
jest.mock('@/app/business/components/ProductCard', () => ({
  ProductCard: ({ product }: any) => (
    <div data-testid={`product-${product.id}`}>
      {typeof product.name === 'string' ? product.name : product.name.en}
    </div>
  ),
}));

// Mock the Tabs component to make testing easier
jest.mock('@/components/ui/tabs', () => {
  return {
    Tabs: ({ children, onValueChange, value }: any) => (
      <div data-testid="tabs" data-value={value} onChange={(e: any) => onValueChange?.(e.target.value)}>
        {children}
      </div>
    ),
    TabsList: ({ children }: any) => <div data-testid="tabs-list">{children}</div>,
    TabsTrigger: ({ children, value, onClick }: any) => (
      <button 
        data-testid={`tab-trigger-${value}`} 
        onClick={() => onClick?.(value)}
        value={value}
      >
        {children}
      </button>
    ),
    TabsContent: ({ children, value }: any) => (
      <div data-testid={`tab-content-${value}`} data-value={value}>{children}</div>
    ),
  };
});

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}));

describe('MenuTabs', () => {
  const mockProducts = {
    'Appetizers': [
      {
        id: 1,
        name: { en: 'Nachos', es: 'Nachos' },
        description: { en: 'Crispy nachos with cheese', es: 'Nachos crujientes con queso' },
        price: 7.99,
        images: [{ url: 'https://example.com/nachos.jpg', isPrimary: true }],
        category: { id: '1', name: { en: 'Test Category' } },
        stock: 100,
        businessId: 1
      },
      {
        id: 2,
        name: { en: 'Guacamole', es: 'Guacamole' },
        description: { en: 'Fresh guacamole with chips', es: 'Guacamole fresco con chips' },
        price: 6.99,
        images: [{ url: 'https://example.com/guacamole.jpg', isPrimary: true }],
        category: { id: '1', name: { en: 'Test Category' } },
        stock: 100,
        businessId: 1
      }
    ],
    'Main Dishes': [
      {
        id: 3,
        name: { en: 'Burger', es: 'Hamburguesa' },
        description: { en: 'Juicy beef burger', es: 'Hamburguesa jugosa de res' },
        price: 12.99,
        images: [{ url: 'https://example.com/burger.jpg', isPrimary: true }],
        category: { id: '2', name: { en: 'Test Category' } },
        stock: 50,
        businessId: 1
      }
    ]
  };

  const categories = ['Appetizers', 'Main Dishes'];

  it('renders all categories and products', () => {
    render(<MenuTabs products={mockProducts} categories={categories} />);
    
    // Check if all tabs are rendered
    expect(screen.getByTestId('tab-trigger-all')).toBeInTheDocument();
    expect(screen.getByTestId('tab-trigger-Appetizers')).toBeInTheDocument();
    expect(screen.getByTestId('tab-trigger-Main Dishes')).toBeInTheDocument();
    
    // Check if all tab contents are rendered
    expect(screen.getByTestId('tab-content-all')).toBeInTheDocument();
    expect(screen.getByTestId('tab-content-Appetizers')).toBeInTheDocument();
    expect(screen.getByTestId('tab-content-Main Dishes')).toBeInTheDocument();
    
    // Check if products are rendered in the appropriate tabs
    const allTabContent = screen.getByTestId('tab-content-all');
    expect(allTabContent.querySelectorAll('[data-testid^="product-"]')).toHaveLength(3);
  });

  it('handles empty categories gracefully', () => {
    render(<MenuTabs products={{}} categories={[]} />);
    
    // Should show a message when no categories are available
    expect(screen.getByText('No menu categories available')).toBeInTheDocument();
  });

  it('handles empty products in a category gracefully', () => {
    const emptyProducts = {
      'Empty Category': []
    };
    
    render(<MenuTabs products={emptyProducts} categories={['Empty Category']} />);
    
    // Check if the empty category tab content contains the message
    const emptyTabContent = screen.getByTestId('tab-content-Empty Category');
    expect(emptyTabContent).toHaveTextContent('No products in this category');
  });

  it('switches tabs correctly', () => {
    render(<MenuTabs products={mockProducts} categories={categories} />);
    
    // Initially shows all products
    const allTabContent = screen.getByTestId('tab-content-all');
    expect(allTabContent.querySelectorAll('[data-testid^="product-"]')).toHaveLength(3);
    
    // Click on Appetizers tab
    const appetizersTab = screen.getByTestId('tab-trigger-Appetizers');
    fireEvent.click(appetizersTab);
    
    // Check if the tab content has changed
    const appetizersContent = screen.getByTestId('tab-content-Appetizers');
    expect(appetizersContent).toBeInTheDocument();
    expect(appetizersContent.querySelectorAll('[data-testid^="product-"]')).toHaveLength(2);
    
    // Click on Main Dishes tab
    const mainDishesTab = screen.getByTestId('tab-trigger-Main Dishes');
    fireEvent.click(mainDishesTab);
    
    // Check if the tab content has changed
    const mainDishesContent = screen.getByTestId('tab-content-Main Dishes');
    expect(mainDishesContent).toBeInTheDocument();
    expect(mainDishesContent.querySelectorAll('[data-testid^="product-"]')).toHaveLength(1);
  });

  it('renders drawer menu for mobile view', () => {
    render(<MenuTabs products={mockProducts} categories={categories} />);
    
    // Check if drawer components are rendered
    expect(screen.getByTestId('drawer')).toBeInTheDocument();
    expect(screen.getByTestId('drawer-trigger')).toBeInTheDocument();
    expect(screen.getByTestId('drawer-content')).toBeInTheDocument();
    expect(screen.getByTestId('drawer-header')).toBeInTheDocument();
    expect(screen.getByTestId('drawer-title')).toBeInTheDocument();
    
    // Check if menu button is rendered
    expect(screen.getByTestId('button-ghost-menu')).toBeInTheDocument();
    
    // Check if drawer buttons are rendered with correct variants
    expect(screen.getByTestId('button-default')).toBeInTheDocument(); // "All" button
    expect(screen.getAllByTestId('button-ghost')).toHaveLength(2); // 2 category buttons
  });

  it('handles tab switching from drawer menu', () => {
    render(<MenuTabs products={mockProducts} categories={categories} />);
    
    // Find and click the drawer menu buttons
    const appetizersButton = screen.getAllByTestId('button-ghost')[1]; // First category button
    fireEvent.click(appetizersButton);
    
    // Check if the content has changed
    const appetizersContent = screen.getByTestId('tab-content-Appetizers');
    expect(appetizersContent.querySelectorAll('[data-testid^="product-"]')).toHaveLength(2);
    
    // Click back to all
    const allButton = screen.getByTestId('button-default');
    fireEvent.click(allButton);
    
    // Check if all products are shown
    const allTabContent = screen.getByTestId('tab-content-all');
    expect(allTabContent.querySelectorAll('[data-testid^="product-"]')).toHaveLength(3);
  });
}); 