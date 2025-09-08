# Tinder Frontend E2E Tests

This directory contains comprehensive end-to-end tests for the Tinder frontend application using Cypress.

## Test Structure

### Main Test Files

1. **`profile-creation.cy.tsx`** - Main profile creation flow tests
   - Gender selection step
   - Age input step
   - Basic details step
   - Image upload step
   - Completion step
   - Complete flow integration

2. **`profile-creation-edge-cases.cy.tsx`** - Edge cases and error handling
   - Dropdown interactions
   - Form validation edge cases
   - Navigation edge cases
   - Input validation edge cases
   - File upload edge cases
   - Network and performance edge cases
   - Browser compatibility
   - Accessibility edge cases
   - Data persistence edge cases

3. **`signup-navigation.cy.tsx`** - Signup and navigation tests
   - Home page to signup navigation
   - Signup form validation
   - Profile creation navigation
   - Error handling and recovery
   - Authentication flow
   - URL and route handling
   - Performance and loading
   - Cross-browser compatibility
   - Mobile navigation

4. **`main-app.cy.tsx`** - Main application functionality
   - App initialization
   - User interface components
   - Data management
   - User interactions
   - Error handling
   - Performance
   - Security
   - Accessibility
   - Responsive design
   - Integration tests
   - End-to-end user journey

5. **`test-runner.cy.tsx`** - Test suite execution and environment setup
   - Test suite execution
   - Test environment setup
   - Test data management
   - Test reporting

## Running Tests

### Run All Tests
```bash
npx nx e2e 2FH-tinder-frontend
```

### Run Tests in Open Mode
```bash
npx nx e2e:open 2FH-tinder-frontend
```

### Run Specific Test File
```bash
npx cypress run --spec "cypress/e2e/(main)/profile-creation.cy.tsx"
```

## Test Coverage

### Profile Creation Flow
- ✅ Gender selection with dropdown
- ✅ Age input validation
- ✅ Basic details form
- ✅ Image upload functionality
- ✅ Completion step
- ✅ Step navigation
- ✅ Form validation
- ✅ Data persistence

### Edge Cases
- ✅ Dropdown interactions
- ✅ Form validation edge cases
- ✅ Navigation edge cases
- ✅ Input validation edge cases
- ✅ File upload edge cases
- ✅ Network error handling
- ✅ Browser compatibility
- ✅ Accessibility features
- ✅ Data persistence

### Navigation
- ✅ Home page to signup
- ✅ Signup form validation
- ✅ Profile creation navigation
- ✅ Error handling
- ✅ Authentication flow
- ✅ URL routing
- ✅ Performance
- ✅ Mobile compatibility

### Main App
- ✅ App initialization
- ✅ UI components
- ✅ Data management
- ✅ User interactions
- ✅ Error handling
- ✅ Performance
- ✅ Security
- ✅ Accessibility
- ✅ Responsive design
- ✅ Integration
- ✅ End-to-end journey

## Test Data

The tests use the following test data:
- Email: `test@example.com`
- Password: `password123`
- Age: `25`, `28`
- Names: `John Doe`, `Jane Smith`
- Descriptions: Various test descriptions

## Browser Support

Tests are configured to run on:
- Chrome (default)
- Firefox
- Safari
- Mobile browsers (iPhone, Android)

## Viewport Testing

Tests cover multiple viewport sizes:
- Desktop: 1920x1080
- Tablet: 768x1024
- Mobile: 375x667, 414x896
- iPhone X: 375x812

## Accessibility Testing

Tests include accessibility checks for:
- Keyboard navigation
- Screen reader support
- ARIA attributes
- Color contrast
- Focus management

## Performance Testing

Tests include performance checks for:
- Page load times
- Network conditions
- Large datasets
- Concurrent users

## Error Handling

Tests cover various error scenarios:
- Network errors
- Validation errors
- Unexpected errors
- Authentication errors
- Authorization errors

## Continuous Integration

The tests are configured to run in CI/CD pipelines with:
- Mochawesome reporting
- Screenshot capture on failure
- Video recording
- Test retries
- Parallel execution

## Maintenance

### Adding New Tests
1. Create new test file in appropriate directory
2. Follow existing naming conventions
3. Include proper test descriptions
4. Add to test runner if needed

### Updating Tests
1. Update test selectors when UI changes
2. Update test data as needed
3. Maintain test coverage
4. Update documentation

### Debugging Tests
1. Use `cypress open` for interactive debugging
2. Check console logs for errors
3. Use `cy.debug()` for debugging
4. Check screenshots and videos

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Clear Naming**: Use descriptive test names
3. **Proper Selectors**: Use data-testid when possible
4. **Wait Strategies**: Use proper waiting strategies
5. **Error Handling**: Test error scenarios
6. **Accessibility**: Include accessibility checks
7. **Performance**: Test performance scenarios
8. **Mobile**: Test mobile compatibility

## Troubleshooting

### Common Issues
1. **Element not found**: Check selectors and timing
2. **Test flakiness**: Add proper waits and retries
3. **Network issues**: Mock network requests
4. **Browser issues**: Check browser compatibility

### Debug Commands
```bash
# Run with debug output
npx cypress run --browser chrome --headed

# Run specific test with debug
npx cypress run --spec "cypress/e2e/(main)/profile-creation.cy.tsx" --headed

# Open Cypress for debugging
npx cypress open
```

## Contributing

When contributing to the tests:
1. Follow existing patterns
2. Add proper documentation
3. Test your changes
4. Update this README if needed
5. Ensure all tests pass