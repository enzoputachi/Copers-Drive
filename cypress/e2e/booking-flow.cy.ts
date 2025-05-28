
describe('Booking Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('completes a basic booking flow', () => {
    // Check if hero section is visible
    cy.get('h1').contains('Safe Travels for NYSC Corps Members').should('be.visible');
    
    // Fill out booking form
    cy.get('select#departure').select('Lagos');
    cy.get('select#destination').select('Abuja');
    
    // Open date picker and select a date
    cy.get('button').contains('Pick a date').click();
    cy.get('.rdp-day:not(.rdp-day_disabled)').first().click();
    
    // Select number of passengers
    cy.get('select#passengers').select('2');
    
    // Select seat class
    cy.get('label').contains('Executive').click();
    
    // Submit form
    cy.get('button').contains('Book Now').click();
    
    // Check if success message is shown
    cy.get('.sonner-toast').contains('Booking request submitted').should('be.visible');
  });
  
  it('displays validation errors for empty form submission', () => {
    // Attempt to submit empty form
    cy.get('button').contains('Book Now').click();
    
    // Check for validation errors
    cy.contains('Departure location is required').should('be.visible');
    cy.contains('Destination location is required').should('be.visible');
    cy.contains('Please select a date').should('be.visible');
  });
  
  it('navigates through featured routes carousel', () => {
    // Wait for featured routes to load
    cy.contains('Popular Routes').should('be.visible');
    
    // Check if we have at least one route displayed
    cy.get('div').contains('Lagos → Abuja').should('exist');
    
    // Click next button on carousel
    cy.get('button[aria-label="Next slide"]').click();
    
    // Check if a different route is now visible
    cy.get('div').contains('Port Harcourt → Owerri').should('exist');
  });
});
