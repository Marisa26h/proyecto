import React from 'react';
import { render, screen } from '@testing-library/react';
import { BusinessInfo } from '@/app/business/components/BusinessInfo';
import '@testing-library/jest-dom';

describe('BusinessInfo', () => {
  it('renders business information correctly with LocalizedText name', () => {
    const props = {
      name: { en: 'Test Restaurant', es: 'Restaurante de Prueba' },
      address: {
        street: '123 Test Street',
        city: 'Test City'
      }
    };

    render(<BusinessInfo {...props} />);
    
    // Check if business name is rendered
    expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
    
    // Check if address is rendered
    expect(screen.getByText('123 Test Street, Test City')).toBeInTheDocument();
    
    // Check if default values are rendered
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText(/\+200 opiniones/)).toBeInTheDocument();
    expect(screen.getByText('15 min')).toBeInTheDocument();
    expect(screen.getByText('24 platos')).toBeInTheDocument();
  });

  it('renders business information correctly with string name', () => {
    const props = {
      name: 'String Name Restaurant',
      address: {
        street: '456 Another Street',
        city: 'Another City'
      }
    };

    render(<BusinessInfo {...props} />);
    
    // Check if business name is rendered
    expect(screen.getByText('String Name Restaurant')).toBeInTheDocument();
    
    // Check if address is rendered
    expect(screen.getByText('456 Another Street, Another City')).toBeInTheDocument();
  });

  it('renders with custom values for optional props', () => {
    const props = {
      name: 'Custom Props Restaurant',
      address: {
        street: '789 Custom Street',
        city: 'Custom City'
      },
      rating: 3.5,
      reviewCount: 50,
      deliveryTime: '30 min',
      dishCount: 10
    };

    render(<BusinessInfo {...props} />);
    
    // Check if custom values are rendered
    expect(screen.getByText('3.5')).toBeInTheDocument();
    expect(screen.getByText(/\+50 opiniones/)).toBeInTheDocument();
    expect(screen.getByText('30 min')).toBeInTheDocument();
    expect(screen.getByText('10 platos')).toBeInTheDocument();
  });

  it('renders with full address object', () => {
    const props = {
      name: 'Full Address Restaurant',
      address: {
        street: '123 Full Street',
        city: 'Full City',
        state: 'Full State',
        country: 'Full Country',
        postalCode: '12345'
      }
    };

    render(<BusinessInfo {...props} />);
    
    // Should still only show street and city
    expect(screen.getByText('123 Full Street, Full City')).toBeInTheDocument();
  });

  it('handles empty address fields gracefully', () => {
    const props = {
      name: 'Empty Address Restaurant',
      address: {
        street: '',
        city: ''
      }
    };

    render(<BusinessInfo {...props} />);
    
    // Check that empty address is rendered correctly
    const addressElement = screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'p' && 
             element?.classList.contains('text-gray-600') &&
             element?.classList.contains('mt-1') &&
             content.trim() === ',';
    });
    expect(addressElement).toBeInTheDocument();
  });

  it('handles missing optional props', () => {
    const props = {
      name: 'Missing Props Restaurant',
      address: {
        street: '123 Test Street',
        city: 'Test City'
      },
      rating: undefined,
      reviewCount: undefined,
      deliveryTime: undefined,
      dishCount: undefined
    };

    render(<BusinessInfo {...props} />);
    
    // Should use default values
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText(/\+200 opiniones/)).toBeInTheDocument();
    expect(screen.getByText('15 min')).toBeInTheDocument();
    expect(screen.getByText('24 platos')).toBeInTheDocument();
  });

  // New test cases to cover lines 28-29
  it('handles LocalizedText name without en key by using first available language', () => {
    const props = {
      name: { es: 'Restaurante Español', fr: 'Restaurant Français' },
      address: {
        street: '123 Test Street',
        city: 'Test City'
      }
    };

    render(<BusinessInfo {...props} />);
    
    // Should use the first available language value (es in this case)
    expect(screen.getByText('Restaurante Español')).toBeInTheDocument();
  });

  it('handles LocalizedText name with empty en value', () => {
    const props = {
      name: { en: '', es: 'Restaurante con Nombre Vacío' },
      address: {
        street: '123 Test Street',
        city: 'Test City'
      }
    };

    render(<BusinessInfo {...props} />);
    
    // Should render an empty business name
    const headingElement = screen.getByRole('heading', { level: 1 });
    expect(headingElement).toBeInTheDocument();
    expect(headingElement.textContent).toBe('');
  });

  it('handles address with missing properties', () => {
    render(
      <BusinessInfo
        name="Test Business"
        address={{} as any}
      />
    );
    expect(screen.getByText('Test Business')).toBeInTheDocument();
  });

  it('handles address with partial properties', () => {
    render(
      <BusinessInfo
        name="Test Business"
        address={{ street: 'Test Street', city: '' }}
      />
    );
    expect(screen.getByText('Test Business')).toBeInTheDocument();
    expect(screen.getByText('Test Street,')).toBeInTheDocument();
  });
}); 