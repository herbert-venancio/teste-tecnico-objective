const API_URL = Cypress.env('apiUrl');

const UsuarioApi = {
  criar(payload) {
    return cy.request({
      method: 'POST',
      url: `${API_URL}/usuarios`,
      body: payload,
      failOnStatusCode: false,
    });
  },

  buscar(id) {
    return cy.request({
      method: 'GET',
      url: `${API_URL}/usuarios/${id}`,
    });
  },

  atualizar(id, payload) {
    return cy.request({
      method: 'PUT',
      url: `${API_URL}/usuarios/${id}`,
      body: payload,
      failOnStatusCode: false,
    });
  },

  deletar(id) {
    return cy.request({
      method: 'DELETE',
      url: `${API_URL}/usuarios/${id}`,
      failOnStatusCode: false,
    });
  },
};

module.exports = UsuarioApi;
