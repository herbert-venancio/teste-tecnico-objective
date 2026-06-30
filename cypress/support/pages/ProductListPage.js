class ProductListPage {
  visit() {
    cy.visit('/');
  }

  getProductCardByName(name) {
    return cy.contains('[data-testid="card-produto"]', name);
  }

  addToCartByName(name) {
    this.getProductCardByName(name)
      .find('[data-testid="adicionar produto"]')
      .click();
  }
}

module.exports = new ProductListPage();
