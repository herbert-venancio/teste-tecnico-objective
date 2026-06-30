const API_URL = Cypress.env('apiUrl');

const ProdutoApi = {
  criar(payload, token) {
    return cy.request({
      method: 'POST',
      url: `${API_URL}/produtos`,
      headers: { Authorization: token },
      body: payload,
      failOnStatusCode: false,
    });
  },

  buscar(id) {
    return cy.request({
      method: 'GET',
      url: `${API_URL}/produtos/${id}`,
    });
  },

  atualizar(id, payload, token) {
    return cy.request({
      method: 'PUT',
      url: `${API_URL}/produtos/${id}`,
      headers: { Authorization: token },
      body: payload,
      failOnStatusCode: false,
    });
  },

  deletar(id, token) {
    return cy.request({
      method: 'DELETE',
      url: `${API_URL}/produtos/${id}`,
      headers: { Authorization: token },
      failOnStatusCode: false,
    });
  },
};

module.exports = ProdutoApi;
