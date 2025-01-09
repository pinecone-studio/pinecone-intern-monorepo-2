describe('Профайл хуудас', () => {
  beforeEach(() => {
    // Visit the profile page (ensure the correct URL is used)
    cy.visit('/profile'); 
  
  });

  it('Профайл мэдээллийг анхдагч байдлаар харах ёстой', () => {
    // Verify that the user's name and email are visible
    cy.contains('Hi, Shagai').should('be.visible');
    cy.contains('n.shagai@pinecone.mn').should('be.visible');
    cy.get('p.text-lg.font-medium.text-zinc-950').contains('Personal Information').should('be.visible');
  });

  it('Профайл болон Зураг табуудыг зөв өөрчлөх ёстой', () => {
    // Verify initial state for the Profile tab
    cy.get('.rounded-md.text-sm.text-zinc-950').contains('Profile').should('have.class', 'bg-zinc-100');
    
    // Click on Images tab and verify it is active
    cy.get('.rounded-md.text-sm.text-zinc-950').contains('Images').click();
    cy.get('.rounded-md.text-sm.text-zinc-950').contains('Images').should('have.class', 'bg-zinc-100');
    
    // Click back to Profile tab and ensure visibility
    cy.get('[data-cy="Tab-Navigation-Profile"]').first().click();
    cy.get('[data-cy="Tab-Navigation"]').should("be.visible");
  });

  it('Анхдагч байдлаар "Profile" табын агуулгыг харуулах ёстой', () => {
    // Ensure the "Personal Information" section is visible
    cy.contains('Personal Information').should('be.visible');
    
    // Verify input fields are present
    cy.get('input[placeholder="Elon"]').should('exist');
    cy.get('input[placeholder="Musk"]').should('exist');
  });

  it('Зураг табын агуулгыг дарсны дараа харуулах ёстой', () => {
    // Click on the Images tab
    cy.get('[data-cy="Tab-Navigation-Images"]').last().click();

    // Verify that the image container exists
    cy.get('[data-cy="Image-page"]').should('exist');
    
    // Ensure the "No image available" message is displayed

  });

  it('Профайлыг "Update profile" товчийг дарж шинэчлэх ёстой', () => {
    // Click the update profile button
    cy.get('[data-cy="Update-Button"]').click();
  });

  it('Зөв хугацааны сонголт үзүүлж буй огнооны талбар харагдах ёстой', () => {
    // Verify the date input field
    cy.get('[data-cy="Input-date"]').should('exist');
    cy.get('[data-cy="day-input"]').type('10');
    cy.get('[data-cy="month-input"]').type('12');
    cy.get('[data-cy="year-input"]').type('1990');
  });

 
  it('should toggle the sidebar and LucideMenu visibility on menu click', () => {
    // Initially, the sidebar should be hidden (check if it has a `hidden` class)
    cy.viewport(600,1000) 
    cy.get('[data-cy="menu"]').should('exist');
    cy.get('[data-cy="menu"]').click();
  });
});
