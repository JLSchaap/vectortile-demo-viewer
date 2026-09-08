
describe('PDOK VectorTile Demo Viewer - visualisatiekeuze', () => {
  beforeEach(() => cy.visit('http://localhost:4200'))

  it('opent een doorzoekbaar selectiepanel', () => {
    cy.get('[data-testid="visualisatie-toggle"]').click()
    cy.get('[data-testid="visualisatie-menu"]').should('be.visible')
    cy.get('[data-testid="visualisatie-search"]').should('be.visible')
    cy.contains('[role="tab"]', 'BGT').should('be.visible')
    cy.get('[data-testid="visualisatie-search"]').type('{esc}')
    cy.get('[data-testid="visualisatie-menu"]').should('not.exist')
  })

  it('filtert op categorie en zoekterm', () => {
    cy.get('[data-testid="visualisatie-toggle"]').click()
    cy.get('[data-testid="category-BAG"]').click()
    cy.get('[data-testid="visualisatie-search"]').type('standaard')
    cy.get('.option-section').should('contain.text', 'BAG standaard')
    cy.get('.option-section').should('not.contain.text', 'BGT Standaard')
  })

  it('selecteert een visualisatie en bewaart een favoriet', () => {
    cy.get('[data-testid="visualisatie-toggle"]').click()
    cy.contains('.option-row button.lbutton', 'BGT Achtergrond').first().click()
    cy.get('[data-testid="visualisatie-toggle"]').click()
    cy.contains('.option-row', 'BGT Achtergrond').find('.favorite-button').click()
    cy.contains('h2', 'Favorieten').parent().should('contain.text', 'BGT Achtergrond')
  })
})
