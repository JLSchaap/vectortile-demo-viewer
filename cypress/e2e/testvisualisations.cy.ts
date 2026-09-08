
/// <reference types="cypress" />

describe('PDOK VectorTile Demo Viewer - visualisatiekeuze', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('http://localhost:4200')
  })

  it('opent een doorzoekbaar selectiepanel', () => {
    cy.get('[data-testid="visualisatie-toggle"]').click({ force: true })
    cy.get('[data-testid="visualisatie-menu"]').should('be.visible')
    cy.get('[data-testid="visualisatie-search"]').should('be.visible')
    cy.contains('[role="tab"]', 'BGT').should('be.visible')
    cy.get('[data-testid="visualisatie-search"]').type('{esc}')
    cy.get('[data-testid="visualisatie-menu"]').should('not.exist')
  })

  it('filtert op categorie en zoekterm', () => {
    cy.get('[data-testid="visualisatie-toggle"]').click({ force: true })
    cy.get('[data-testid="category-BAG"]').click({ force: true })
    cy.get('[data-testid="visualisatie-search"]').type('standaard')
    cy.get('.option-section').should('contain.text', 'BAG standaard')
    cy.get('.option-section').should('not.contain.text', 'BGT Standaard')
  })

  it('toont alle beschikbare categorieën met de Alle-filter', () => {
    cy.get('[data-testid="visualisatie-toggle"]').click({ force: true })
    cy.get('[data-testid="category-Alle"]').click({ force: true })
    cy.get('[data-testid="category-Alle"]').should('have.attr', 'aria-selected', 'true')
    cy.get('.option-section').should('have.length.greaterThan', 5)
    cy.get('#visualisaties-BGT').should('be.visible')
    cy.get('#visualisaties-BAG').should('be.visible')
    cy.get('#visualisaties-DKK').should('be.visible')
    cy.get('#visualisaties-TOP10NL').should('be.visible')
  })

  it('maakt de visualisatielijst scrollbaar', () => {
    cy.get('[data-testid="visualisatie-toggle"]').click({ force: true })
    cy.get('[data-testid="visualisatie-menu"]')
      .should('have.css', 'overflow-y', 'auto')
      .then($menu => {
        expect($menu[0].scrollHeight).to.be.greaterThan($menu[0].clientHeight)
      })
    cy.get('[data-testid="visualisatie-menu"]').scrollTo('bottom')
    cy.get('[data-testid="visualisatie-menu"]').then($menu => {
      expect($menu[0].scrollTop).to.be.greaterThan(0)
    })
  })

  it('toont de kaartcanvas over de volledige schermbreedte', () => {
    cy.window().then(browserWindow => {
      cy.get('#map1').should('be.visible').then($map => {
        const mapRect = $map[0].getBoundingClientRect()
        expect(mapRect.left).to.be.closeTo(0, 1)
        expect(mapRect.width).to.be.closeTo(browserWindow.innerWidth, 1)
      })
      cy.get('#map1 canvas').should('be.visible').then($canvas => {
        const canvasRect = $canvas[0].getBoundingClientRect()
        expect(canvasRect.left).to.be.closeTo(0, 1)
        expect(canvasRect.width).to.be.closeTo(browserWindow.innerWidth, 1)
      })
    })
  })

  it('filtert naar alleen DKK-visualisaties', () => {
    cy.get('[data-testid="visualisatie-toggle"]').click({ force: true })
    cy.get('[data-testid="category-DKK"]').click({ force: true })
    cy.get('[data-testid="category-DKK"]').should('have.attr', 'aria-selected', 'true')
    cy.get('.option-section').should('have.length', 1).and('contain.text', 'Kadastrale kaart Standaard visualisatie').and('contain.text', 'Kadastrale kaart Kwaliteits visualisatie')
    cy.get('.option-row').should('have.length', 2)
  })

  it('filtert naar alleen TOP10NL-visualisaties', () => {
    cy.get('[data-testid="visualisatie-toggle"]').click({ force: true })
    cy.get('[data-testid="category-TOP10NL"]').click({ force: true })
    cy.get('[data-testid="category-TOP10NL"]').should('have.attr', 'aria-selected', 'true')
    cy.get('.option-section').should('have.length', 1).and('contain.text', 'TOP10NL')
    cy.get('.option-row').should('have.length', 4)
  })

  it('selecteert TOP10NL en toont de visualisatie op de kaart', () => {
    cy.get('[data-testid="visualisatie-toggle"]').click({ force: true })
    cy.get('[data-testid="category-TOP10NL"]').click({ force: true })
    cy.contains('.option-row button.lbutton', 'TOP10NL').click({ force: true })

    cy.get('[data-testid="visualisatie-toggle"]')
      .should('contain.text', 'TOP10NL')
      .and('have.attr', 'aria-expanded', 'false')
    cy.get('.stylelink a', { timeout: 10000 })
      .should('have.attr', 'href')
      .and('match', /top10/i)
  })

  it('selecteert een visualisatie en toont deze bij recente keuzes', () => {
    cy.get('[data-testid="visualisatie-toggle"]').click({ force: true })
    cy.contains('.option-row button.lbutton', 'BGT Achtergrond').first().click({ force: true })
    cy.get('[data-testid="visualisatie-toggle"]').click({ force: true })
    cy.contains('h2', 'Recent gekozen').parent().should('contain.text', 'BGT Achtergrond')
  })
})
