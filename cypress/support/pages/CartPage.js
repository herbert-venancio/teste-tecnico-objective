class CartPage {
  get addToCartButton() {
    return cy.get('[data-testid="adicionar carrinho"]');
  }

  get productName() {
    return cy.get('[data-testid="shopping-cart-product-name"]');
  }

  get productQuantity() {
    return cy.get('[data-testid="shopping-cart-product-quantity"]');
  }

  confirmAddToCart() {
    this.addToCartButton.click();
  }
}

module.exports = new CartPage();
