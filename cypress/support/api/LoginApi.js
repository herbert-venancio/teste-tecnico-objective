const API_URL = Cypress.env('apiUrl');

const LoginApi = {
  autenticar(email, password) {
    return cy.request({
      method: 'POST',
      url: `${API_URL}/login`,
      body: { email, password },
      failOnStatusCode: false,
    });
  },
};

module.exports = LoginApi;
