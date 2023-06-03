describe('Newsletter', () => {
  beforeEach(() => {
    cy.task('seedDatabase');
  });

  it('should display a success message', () => {
    cy.intercept('POST', '/newsletter*', { status: 201 }).as('subscribed');
    cy.visit('/');
    cy.get('[data-cy="newsletter-email"]').click({ force: true });

    cy.get('[data-cy="newsletter-email"]').type('test@example.com');

    cy.get('[data-cy="newsletter-submit"]').click();
    cy.wait('@subscribed');
    cy.contains('Thanks for signing up');
  });

  it('should display validation errors', () => {
    cy.intercept('POST', '/newsletter*', { message: 'Email already exist' }).as(
      'subscribed'
    );
    cy.visit('/');
    cy.get('[data-cy="newsletter-email"]').click({ force: true });

    cy.get('[data-cy="newsletter-email"]').type('test@example.com');

    cy.get('[data-cy="newsletter-submit"]').click();
    cy.wait('@subscribed');
    cy.contains('Email already exist');
  });

  it('should successfully create a new contact', () => {
    cy.request({
      method: 'POST',
      url: '/newsletter',
      body: { email: 'test@example.com' },
      form: true
    }).then((res) => {
      expect(res.status).equal(201);
    });
  });
});
