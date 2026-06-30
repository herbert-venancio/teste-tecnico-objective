describe('Frontend - Logout e Proteção de Rota', () => {
  let usuario;

  beforeEach(() => {
    cy.apiCreateUser().then((u) => {
      usuario = u;
      cy.loginViaApi(u.email, u.password, u.nome);
    });
  });

  afterEach(() => {
    cy.apiDeleteUser(usuario._id);
  });

  it('deve fazer logout e redirecionar para a tela de login', () => {
    cy.visit('/home');
    cy.get('[data-testid="logout"]').should('be.visible').click();

    cy.url().should('include', '/login');
    cy.get('[data-testid="entrar"]').should('be.visible');
  });

  it('deve redirecionar para login ao acessar rota protegida sem autenticação', () => {
    cy.clearLocalStorage();
    cy.visit('/home');

    cy.url().should('include', '/login');
    cy.get('[data-testid="entrar"]').should('be.visible');
  });

  it('deve redirecionar para login ao acessar rota protegida após logout', () => {
    cy.visit('/home');
    cy.get('[data-testid="logout"]').click();

    cy.visit('/home');
    cy.url().should('include', '/login');
  });
});
