class LoginPage {
  get emailInput() {
    return cy.get('[data-testid="email"]');
  }

  get passwordInput() {
    return cy.get('[data-testid="senha"]');
  }

  get submitButton() {
    return cy.get('[data-testid="entrar"]');
  }

  get errorMessage() {
    return cy.get('[data-testid="erro-email-senha"]');
  }

  visit() {
    cy.visit('/login');
  }

  fillEmail(email) {
    this.emailInput.clear().type(email);
  }

  fillPassword(password) {
    this.passwordInput.clear().type(password);
  }

  submit() {
    this.submitButton.click();
  }

  loginWith(email, password) {
    this.visit();
    this.fillEmail(email);
    this.fillPassword(password);
    this.submit();
  }
}

module.exports = new LoginPage();
