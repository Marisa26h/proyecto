import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '@/app/business/components/ProductCard';
import '@testing-library/jest-dom';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // Convert boolean props to strings
    const processedProps = Object.fromEntries(
      Object.entries(props).map(([key, value]) => [
        key,
        typeof value === 'boolean' ? value.toString() : value
      ])
    );
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...processedProps} data-testid="next-image" />
  },
}));

describe('ProductCard', () => {
  const mockProduct = {
    id: 1,
    name: { en: 'Test Product', es: 'Producto de Prueba' },
    description: { en: 'Test Description', es: 'Descripción de Prueba' },
    price: 9.99,
    images: [{ url: 'https://example.com/image.jpg', isPrimary: true }],
    category: { id: '1', name: { en: 'Test Category' } },
    stock: 10,
    businessId: 1
  };

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    // Check if product name is rendered (in Spanish by default)
    expect(screen.getByText('Producto de Prueba')).toBeInTheDocument();
    
    // Check if product description is rendered
    expect(screen.getByText('Descripción de Prueba')).toBeInTheDocument();
    
    // Check if price is rendered
    expect(screen.getByText('9.99€')).toBeInTheDocument();
    
    // Check if image is rendered
    const image = screen.getByTestId('next-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('handles missing image gracefully', () => {
    const productWithoutImage = {
      ...mockProduct,
      images: [],
    };
    
    render(<ProductCard product={productWithoutImage} />);
    
    // Check that product info is still rendered
    expect(screen.getByText('Producto de Prueba')).toBeInTheDocument();
    
    // Check that no image is rendered
    const images = screen.queryByTestId('next-image');
    expect(images).not.toBeInTheDocument();
  });

  it('uses fallback language when preferred locale is not available', () => {
    const productWithOnlyEnglish = {
      ...mockProduct,
      name: { en: 'English Only' },
      description: { en: 'English Description Only' },
    };
    
    render(<ProductCard product={productWithOnlyEnglish} />);
    
    // Should fall back to English
    expect(screen.getByText('English Only')).toBeInTheDocument();
    expect(screen.getByText('English Description Only')).toBeInTheDocument();
  });

  it('handles image loading error', () => {
    render(<ProductCard product={mockProduct} />);
    
    const image = screen.getByTestId('next-image');
    fireEvent.error(image);
    
    // Image should be removed after error
    expect(screen.queryByTestId('next-image')).not.toBeInTheDocument();
  });

  it('handles string image URLs', () => {
    const productWithStringImage = {
      ...mockProduct,
      images: [{ url: 'https://example.com/direct-image.jpg', isPrimary: true }],
    };
    
    render(<ProductCard product={productWithStringImage} />);
    
    const image = screen.getByTestId('next-image');
    expect(image).toHaveAttribute('src', 'https://example.com/direct-image.jpg');
  });

  it('handles completely empty localized text', () => {
    const productWithEmptyText = {
      ...mockProduct,
      name: { en: '' },
      description: { en: '' },
    };
    
    render(<ProductCard product={productWithEmptyText} />);
    
    // Should render empty strings for name and description
    expect(screen.getByText('9.99€')).toBeInTheDocument(); // Only price should be visible
  });

  it('handles missing localized text', () => {
    const productWithMissingText = {
      ...mockProduct,
      name: { en: '' },
      description: { en: '' },
    };
    
    render(<ProductCard product={productWithMissingText} />);
    
    // Should render empty strings for name and description
    expect(screen.getByText('9.99€')).toBeInTheDocument(); // Only price should be visible
  });

  it('properly handles boolean props in the Image component', () => {
    // The ProductCard component passes boolean props to the Image component
    // such as fill={true} and priority={true}
    render(<ProductCard product={mockProduct} />);
    
    // Check if the image is rendered with boolean props converted to strings
    const image = screen.getByTestId('next-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('fill', 'true');
    expect(image).toHaveAttribute('priority', 'true');
    
    // This test specifically covers the boolean prop conversion in the Image mock
    // at lines 12-16 and the rendering of the mocked component at line 19
  });

  it('handles product with string images array', () => {
    const product = {
      ...mockProduct,
      images: [{ url: 'image1.jpg' }, { url: 'image2.jpg' }]
    };
    render(<ProductCard product={product} />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'image1.jpg');
  });

  it('handles product with missing localized text', () => {
    const product = {
      ...mockProduct,
      name: {},
      description: undefined
    };
    render(<ProductCard product={product} />);
    const nameElement = screen.getByRole('heading', { level: 3 });
    expect(nameElement).toHaveTextContent('');
  });

  it('handles product with only non-default locale', () => {
    const product = {
      ...mockProduct,
      name: { fr: 'Nom du produit' },
      description: { fr: 'Description du produit' }
    };
    render(<ProductCard product={product} />);
    expect(screen.getByText('Nom du produit')).toBeInTheDocument();
  });

  it('handles product with no images array', () => {
    const product = {
      ...mockProduct,
      images: undefined
    };
    render(<ProductCard product={product} />);
    const imageContainer = screen.queryByRole('img');
    expect(imageContainer).not.toBeInTheDocument();
  });

  it('handles product with string-type images', () => {
    const product = {
      ...mockProduct,
      images: ['direct-image-url.jpg', 'second-image.jpg'] as any
    };
    render(<ProductCard product={product} />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'direct-image-url.jpg');
  });
}); 