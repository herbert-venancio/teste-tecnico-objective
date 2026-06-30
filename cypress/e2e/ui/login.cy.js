const LoginPage = require('../../support/pages/LoginPage');

describe('Frontend - Login', () => {
  let usuario;

  beforeEach(() => {
    cy.apiCreateUser().then((u) => {
      usuario = u;
    });
  });

  afterEach(() => {
    cy.apiDeleteUser(usuario._id);
  });

  it('deve fazer login com credenciais válidas e redirecionar para home', () => {
    LoginPage.loginWith(usuario.email, usuario.password);

    cy.url().should('include', '/home');
    cy.get('[data-testid="logout"]').should('be.visible');
  });

  it('deve exibir mensagem de erro ao tentar login com senha inválida', () => {
    LoginPage.visit();
    LoginPage.fillEmail(usuario.email);
    LoginPage.fillPassword('senha-invalida-999');
    LoginPage.submit();

    cy.url().should('include', '/login');
    cy.get('[role="alert"]').should('be.visible').and('contain.text', 'Email e/ou senha inválidos');
  });

  it('deve exibir mensagem de erro ao tentar login com email não cadastrado', () => {
    LoginPage.visit();
    LoginPage.fillEmail('nao-existe-xyz@qatest.dev');
    LoginPage.fillPassword('qualquersenha');
    LoginPage.submit();

    cy.url().should('include', '/login');
    cy.get('[role="alert"]').should('be.visible').and('contain.text', 'Email e/ou senha inválidos');
  });
});
