import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import BusinessPage from '@/app/business/[id]/page';
import { getBusinessDetails } from '@/database/repositories/business-repository';
import { getCategories, getCategoriesByBusinessId } from '@/database/repositories/categories-repository';
import { notFound } from 'next/navigation';
import { Address, LocalizedText } from '@/types';

// Mock the repositories
jest.mock('@/database/repositories/business-repository', () => ({
  getBusinessDetails: jest.fn(),
}));

jest.mock('@/database/repositories/categories-repository', () => ({
  getCategories: jest.fn(),
  getCategoriesByBusinessId: jest.fn(),
}));

// Mock the next/navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

// Mock the components
jest.mock('@/app/business/components/BusinessHero', () => ({
  BusinessHero: ({ name, image }: { name: string; image?: string }) => (
    <div data-testid="business-hero">
      <div data-testid="business-name">{name}</div>
      <div data-testid="business-image">{image}</div>
    </div>
  ),
}));

jest.mock('@/app/business/components/BusinessInfo', () => ({
  BusinessInfo: ({ name, address }: { name: string; address: Address }) => (
    <div data-testid="business-info">
      <div data-testid="info-name">{name}</div>
      <div data-testid="info-address">{JSON.stringify(address)}</div>
    </div>
  ),
}));

jest.mock('@/app/business/components/MenuTabs', () => ({
  MenuTabs: ({ products, categories }: { products: Record<string, any[]>; categories: string[] }) => (
    <div data-testid="menu-tabs">
      <div data-testid="products">{JSON.stringify(products)}</div>
      <div data-testid="categories">{JSON.stringify(categories)}</div>
    </div>
  ),
}));

jest.mock('@/app/business/components/BottomNavigation', () => ({
  BottomNavigation: () => <div data-testid="bottom-navigation" />,
}));

describe('BusinessPage', () => {
  const mockBusiness = {
    id: 1,
    name: { en: 'Test Business', es: 'Negocio de Prueba' } as LocalizedText,
    address: {
      street: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      postalCode: '12345',
      country: 'Test Country',
    } as Address,
    image: 'test-image.jpg',
    products: {
      'Category 1': [
        {
          id: 1,
          name: { en: 'Product 1', es: 'Producto 1' } as LocalizedText,
          price: 10.99,
          description: { en: 'Description 1', es: 'Descripción 1' } as LocalizedText,
          stock: 10,
          businessId: 1,
        },
      ],
      'Category 2': [
        {
          id: 2,
          name: { en: 'Product 2', es: 'Producto 2' } as LocalizedText,
          price: 15.99,
          description: { en: 'Description 2', es: 'Descripción 2' } as LocalizedText,
          stock: 5,
          businessId: 1,
        },
      ],
    },
  };

  const mockCategories = ['Category 1', 'Category 2', 'Category 3'];

  beforeEach(() => {
    jest.clearAllMocks();
    (getBusinessDetails as jest.Mock).mockResolvedValue(mockBusiness);
    (getCategories as jest.Mock).mockResolvedValue(mockCategories);
    (getCategoriesByBusinessId as jest.Mock).mockResolvedValue(mockCategories);
  });

  it('renders the business page with correct data', async () => {
    const props = {
      params: {
        id: '1',
      },
    };

    const page = await BusinessPage(props);
    render(page);

    // Check if the main components are rendered
    expect(screen.getByTestId('business-hero')).toBeInTheDocument();
    expect(screen.getByTestId('business-info')).toBeInTheDocument();
    expect(screen.getByTestId('menu-tabs')).toBeInTheDocument();
    expect(screen.getByTestId('bottom-navigation')).toBeInTheDocument();

    // Check if the business name is correctly passed to the components
    expect(screen.getByTestId('business-name')).toHaveTextContent('Negocio de Prueba');
    expect(screen.getByTestId('info-name')).toHaveTextContent('Negocio de Prueba');

    // Check if the business image is correctly passed
    expect(screen.getByTestId('business-image')).toHaveTextContent('test-image.jpg');

    // Check if the address is correctly passed
    const addressText = screen.getByTestId('info-address').textContent;
    expect(addressText).toContain('Test City');
    expect(addressText).toContain('Test Country');

    // Check if products and categories are correctly passed to MenuTabs
    const productsText = screen.getByTestId('products').textContent;
    expect(productsText).toContain('Category 1');
    expect(productsText).toContain('Product 1');

    const categoriesText = screen.getByTestId('categories').textContent;
    expect(categoriesText).toContain('Category 1');
    expect(categoriesText).toContain('Category 3');
  });

  it('calls getBusinessDetails with the correct ID', async () => {
    const props = {
      params: {
        id: '1',
      },
    };

    await BusinessPage(props);

    expect(getBusinessDetails).toHaveBeenCalledWith(1);
  });

  it('calls getCategoriesByBusinessId with the correct ID', async () => {
    const props = {
      params: {
        id: '1',
      },
    };

    await BusinessPage(props);

    expect(getCategoriesByBusinessId).toHaveBeenCalledWith(1);
  });

  it('calls notFound when an error occurs', async () => {
    const props = {
      params: {
        id: '1',
      },
    };

    (getBusinessDetails as jest.Mock).mockRejectedValue(new Error('Business not found'));

    await BusinessPage(props);

    expect(notFound).toHaveBeenCalled();
  });

  it('calls notFound when the ID is invalid', async () => {
    const props = {
      params: {
        id: 'invalid',
      },
    };

    // Mock the implementation to throw an error when parsing an invalid ID
    (getBusinessDetails as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid ID');
    });

    await BusinessPage(props);

    expect(notFound).toHaveBeenCalled();
  });
}); 