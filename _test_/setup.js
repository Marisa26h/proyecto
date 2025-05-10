// Optional: add any global mocks or setup needed for your tests
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
  }),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks()
})

// Add a simple test to prevent the "no tests" error
describe('Test setup', () => {
  it('should have Jest properly configured', () => {
    expect(true).toBe(true)
  })
}) 