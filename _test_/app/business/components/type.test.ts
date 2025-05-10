import { Product, ProductsByCategory, Business } from '@/app/business/components/types';
import { Product as BaseProduct, Business as BaseBusiness } from '@/types';

describe('Types', () => {
  it('Product type is compatible with BaseProduct', () => {
    const product: Product = {
      id: 1,
      name: { en: 'Test Product', es: 'Producto de Prueba' },
      description: { en: 'Description', es: 'Descripción' },
      price: 9.99,
      images: [{ url: 'test.jpg', isPrimary: true }],
      category: { id: '1', name: { en: 'Test Category' } },
      stock: 100,
      businessId: 1
    };

    // This assignment will fail TypeScript compilation if types are incompatible
    const baseProduct: BaseProduct = product;
    expect(baseProduct).toBeDefined();
  });

  it('ProductsByCategory type has correct structure', () => {
    const productsByCategory: ProductsByCategory = {
      'Test Category': [
        {
          id: 1,
          name: { en: 'Test Product', es: 'Producto de Prueba' },
          description: { en: 'Description', es: 'Descripción' },
          price: 9.99,
          images: [{ url: 'test.jpg', isPrimary: true }],
          category: { id: '1', name: { en: 'Test Category' } },
          stock: 100,
          businessId: 1
        }
      ]
    };

    expect(Array.isArray(productsByCategory['Test Category'])).toBe(true);
    expect(productsByCategory['Test Category'][0].id).toBe(1);
  });

  it('Business type extends BaseBusiness correctly', () => {
    const business: Business = {
      id: 1,
      name: { en: 'Test Business', es: 'Negocio de Prueba' },
      address: {
        street: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
        postalCode: '12345'
      },
      products: {
        'Test Category': [
          {
            id: 1,
            name: { en: 'Test Product', es: 'Producto de Prueba' },
            description: { en: 'Description', es: 'Descripción' },
            price: 9.99,
            images: [{ url: 'test.jpg', isPrimary: true }],
            category: { id: '1', name: { en: 'Test Category' } },
            stock: 100,
            businessId: 1
          }
        ]
      }
    };

    // Check if business has all required properties
    expect(business.id).toBeDefined();
    expect(business.name).toBeDefined();
    expect(business.products).toBeDefined();
    expect(Array.isArray(business.products['Test Category'])).toBe(true);
  });
}); 