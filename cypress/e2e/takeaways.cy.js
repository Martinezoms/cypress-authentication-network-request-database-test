/// <reference types="Cypress" />

describe('Takeaways', () => {
  beforeEach(() => {
    cy.task('seedDatabase');
  });

  it('should display a list of fetched takeaways', () => {
    cy.visit('/');
    cy.get('[data-cy="takeaway-item"]').should('have.length', 2);
  });

  it('should add new takeaway', () => {
    cy.intercept('POST', '/takeaways/new*', 'success').as('createdTakeaway');
    cy.login();

    cy.visit('/takeaways/new');
    cy.get('[data-cy="title"]').as('titleInput').should('be.visible');
    cy.get('@titleInput').click();
    cy.get('@titleInput').type('TestTitle1');
    cy.get('[data-cy="body"]').type('TestBody1');
    cy.get('[data-cy="create-takeaway"]').click();
    cy.wait('@createdTakeaway')
      .its('request.body')
      .should('match', /TestTitle1.*TestBody1/);
  });
});
