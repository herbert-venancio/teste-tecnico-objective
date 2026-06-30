const ProductListPage = require('../../support/pages/ProductListPage');
const CartPage = require('../../support/pages/CartPage');

describe('Frontend - Lista de Compras e Carrinho (sessão única)', () => {
  let usuario;
  let adminUsuario;
  let produto;

  before(() => {
    cy.apiCreateUser({ admin: true }).then((admin) => {
      adminUsuario = admin;
      cy.apiLogin(admin.email, admin.password).then((token) => {
        cy.apiCreateProduct(token, { quantidade: 10 }).then((p) => {
          produto = p;
        });
      });
    });

    cy.apiCreateUser().then((u) => {
      usuario = u;
    });
  });

  after(() => {
    cy.apiLogin(adminUsuario.email, adminUsuario.password).then((token) => {
      cy.apiDeleteProduct(produto._id, token);
    });
    cy.apiDeleteUser(adminUsuario._id);
    cy.apiDeleteUser(usuario._id);
  });

  it('deve adicionar produto à lista de compras e validar nome e quantidade', () => {
    cy.loginViaApi(usuario.email, usuario.password, usuario.nome);

    cy.intercept('GET', '**/produtos**').as('carregarProdutos');
    ProductListPage.visit();
    cy.wait('@carregarProdutos');

    ProductListPage.searchByName(produto.nome);

    cy.contains('.card.col-3', produto.nome).within(() => {
      cy.contains(`$ ${produto.preco}`).should('be.visible');
      cy.get('[data-testid="adicionarNaLista"]').click();
    });

    cy.url().should('include', '/minhaListaDeProdutos');

    CartPage.productName.should('contain.text', produto.nome);
    CartPage.productQuantity.should('contain.text', '1');
  });

  it('deve concluir a adição ao carrinho a partir da lista de compras', () => {
    cy.loginViaApi(usuario.email, usuario.password, usuario.nome);

    cy.intercept('GET', '**/produtos**').as('carregarProdutos');
    ProductListPage.visit();
    cy.wait('@carregarProdutos');

    ProductListPage.searchByName(produto.nome);
    cy.contains('.card.col-3', produto.nome)
      .find('[data-testid="adicionarNaLista"]')
      .click();

    cy.url().should('include', '/minhaListaDeProdutos');
    CartPage.productName.should('contain.text', produto.nome);

    CartPage.confirmAddToCart();
    cy.url().should('include', '/carrinho');
  });
});
