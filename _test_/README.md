Testing Documentation for Virtual Waiter
This directory contains tests for the Virtual Waiter application. The tests are written using Jest and React Testing Library.

Running Tests
To run all tests:

npm test
To run tests with coverage:

npm test -- --coverage
To run a specific test file:

npm test -- path/to/test/file.test.js
To run tests in watch mode (tests will re-run when files change):

npm test -- --watch
Test Structure
The tests are organized as follows:

__tests__/ - Root test directory
components/ - Tests for React components
utils/ - Tests for utility functions
setup.js - Global test setup and mocks
Writing New Tests
Component Tests
When writing tests for components, follow this pattern:

import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { act } from 'react'
import YourComponent from '../../path/to/your/component'

describe('YourComponent', () => {
  it('should render correctly', () => {
    render(<YourComponent />)
    
    // Assert that elements are in the document
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
  
  it('should handle user interactions', () => {
    render(<YourComponent />)
    
    // Simulate user interaction
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Click Me' }))
    })
    
    // Assert the expected outcome
    expect(screen.getByText('Result after click')).toBeInTheDocument()
  })
})
Utility Function Tests
When writing tests for utility functions, follow this pattern:

import { yourUtilityFunction } from '../../path/to/your/utility'

describe('yourUtilityFunction', () => {
  it('should handle normal input correctly', () => {
    expect(yourUtilityFunction('input')).toBe('expected output')
  })
  
  it('should handle edge cases', () => {
    expect(yourUtilityFunction(null)).toBe('expected output for null')
    expect(yourUtilityFunction('')).toBe('expected output for empty string')
  })
})
Mocking
For mocking dependencies, use Jest's mocking capabilities:

// Mock a module
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    // Add other methods as needed
  }),
}))

// Mock a function
const mockFunction = jest.fn()
mockFunction.mockReturnValue('mocked value')
Best Practices
Test behavior, not implementation details
Use data-testid attributes for elements that don't have accessible roles
Keep tests simple and focused on one aspect of functionality
Use descriptive test names that explain what is being tested
Clean up after tests to avoid affecting other tests
Coverage Goals
Aim for high test coverage, especially for critical business logic. The coverage report will show which parts of the code are not covered by tests.

Troubleshooting
If tests are failing, check:

Are all dependencies installed?
Are mocks set up correctly?
Is the component rendering as expected?
Are there any console errors?