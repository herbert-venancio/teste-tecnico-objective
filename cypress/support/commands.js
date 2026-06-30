const { buildUser } = require('./factories/userFactory');
const { buildProduct } = require('./factories/productFactory');

const API_URL = Cypress.env('apiUrl');

Cypress.Commands.add('apiCreateUser', (options = {}) => {
  const user = buildUser(options);
  return cy
    .request({ method: 'POST', url: `${API_URL}/usuarios`, body: user })
    .then((res) => ({ ...user, _id: res.body._id }));
});

Cypress.Commands.add('apiDeleteUser', (id) => {
  cy.request({ method: 'DELETE', url: `${API_URL}/usuarios/${id}`, failOnStatusCode: false });
});

Cypress.Commands.add('apiLogin', (email, password) => {
  return cy
    .request({ method: 'POST', url: `${API_URL}/login`, body: { email, password } })
    .then((res) => res.body.authorization);
});

Cypress.Commands.add('apiCreateProduct', (token, overrides = {}) => {
  const product = { ...buildProduct(), ...overrides };
  return cy
    .request({
      method: 'POST',
      url: `${API_URL}/produtos`,
      headers: { Authorization: token },
      body: product,
    })
    .then((res) => ({ ...product, _id: res.body._id }));
});

Cypress.Commands.add('apiDeleteProduct', (id, token) => {
  cy.request({
    method: 'DELETE',
    url: `${API_URL}/produtos/${id}`,
    headers: { Authorization: token },
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('loginViaApi', (email, password, nome = '') => {
  cy.apiLogin(email, password).then((token) => {
    window.localStorage.setItem('serverest/userToken', token);
    window.localStorage.setItem('serverest/userEmail', email);
    window.localStorage.setItem('serverest/userNome', nome);
  });
});
