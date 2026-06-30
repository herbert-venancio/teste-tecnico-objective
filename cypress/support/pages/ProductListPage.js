class ProductListPage {
  visit() {
    cy.visit('/home');
  }

  getProductCardByName(name) {
    return cy.contains('.card.col-3', name);
  }

  addToListByName(name) {
    this.getProductCardByName(name)
      .find('[data-testid="adicionarNaLista"]')
      .click();
  }

  searchByName(name) {
    cy.get('[data-testid="pesquisar"]').clear().type(name);
    cy.get('[data-testid="botaoPesquisar"]').click();
  }
}

module.exports = new ProductListPage();
