import { render, screen } from '@testing-library/react';
import BusinessesPage from '@/app/business/page';
import { getAllBusinesses } from '@/database/repositories/business-repository';
import '@testing-library/jest-dom';

// Mock the getAllBusinesses function
jest.mock('@/database/repositories/business-repository', () => ({
  getAllBusinesses: jest.fn(),
}));

describe('BusinessesPage', () => {
  const mockBusinesses = [
    {
      id: 1,
      name: { en: 'Test Business 1', es: 'Negocio de Prueba 1' },
      address: {
        street: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
        postalCode: '12345'
      }
    },
    {
      id: 2,
      name: { en: 'Test Business 2', es: 'Negocio de Prueba 2' },
      address: {
        street: '456 Test Ave',
        city: 'Test City 2',
        state: 'Test State 2',
        country: 'Test Country',
        postalCode: '67890'
      }
    }
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    (getAllBusinesses as jest.Mock).mockResolvedValue(mockBusinesses);
  });

  it('renders businesses with their information', async () => {
    render(await BusinessesPage());

    // Check if the page title is rendered
    expect(screen.getByText('Businesses')).toBeInTheDocument();

    // Check if business names are rendered
    expect(screen.getByText('Test Business 1')).toBeInTheDocument();
    expect(screen.getByText('Test Business 2')).toBeInTheDocument();

    // Check if addresses are rendered
    expect(screen.getByText('123 Test St')).toBeInTheDocument();
    expect(screen.getByText('456 Test Ave')).toBeInTheDocument();
    expect(screen.getByText('Test City, Test State')).toBeInTheDocument();
    expect(screen.getByText('Test City 2, Test State 2')).toBeInTheDocument();
    expect(screen.getByText('Test Country 12345')).toBeInTheDocument();
    expect(screen.getByText('Test Country 67890')).toBeInTheDocument();

    // Verify that getAllBusinesses was called
    expect(getAllBusinesses).toHaveBeenCalledTimes(1);
  });

  it('renders no businesses when the list is empty', async () => {
    (getAllBusinesses as jest.Mock).mockResolvedValue([]);
    
    render(await BusinessesPage());

    // Check if the page title is still rendered
    expect(screen.getByText('Businesses')).toBeInTheDocument();

    // Verify that no business cards are rendered
    const businessCards = screen.queryAllByRole('link');
    expect(businessCards).toHaveLength(0);
  });
}); 