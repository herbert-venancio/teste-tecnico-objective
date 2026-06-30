class CartPage {
  get cartButton() {
    return cy.get('[data-testid="icon-carrinho"]');
  }

  open() {
    this.cartButton.click();
  }

  getItemByName(name) {
    return cy.contains('[data-testid="produto-carrinho"]', name);
  }

  getItemQuantity(name) {
    return this.getItemByName(name).find('[data-testid="quantidade"]');
  }
}

module.exports = new CartPage();
