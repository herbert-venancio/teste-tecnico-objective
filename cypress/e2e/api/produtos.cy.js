const { buildUser } = require('../../support/factories/userFactory');
const { buildProduct } = require('../../support/factories/productFactory');
const UsuarioApi = require('../../support/api/UsuarioApi');
const LoginApi = require('../../support/api/LoginApi');
const ProdutoApi = require('../../support/api/ProdutoApi');

describe('API - CRUD de Produtos', () => {
  let adminToken;
  let adminId;

  beforeEach(() => {
    const admin = buildUser({ admin: true });
    UsuarioApi.criar(admin).then((res) => {
      adminId = res.body._id;
      LoginApi.autenticar(admin.email, admin.password).then((login) => {
        adminToken = login.body.authorization;
      });
    });
  });

  afterEach(() => {
    UsuarioApi.deletar(adminId);
  });

  context('POST /produtos - Cadastro', () => {
    it('deve cadastrar um produto com sucesso usando token de admin', () => {
      const produto = buildProduct();

      ProdutoApi.criar(produto, adminToken).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body.message).to.eq('Cadastro realizado com sucesso');
        expect(res.body._id).to.be.a('string').and.not.be.empty;

        ProdutoApi.deletar(res.body._id, adminToken);
      });
    });

    it('deve rejeitar cadastro de produto com nome duplicado', () => {
      const produto = buildProduct();

      ProdutoApi.criar(produto, adminToken).then((primeiro) => {
        ProdutoApi.criar(produto, adminToken).then((segundo) => {
          expect(segundo.status).to.eq(400);
          expect(segundo.body.message).to.eq('Já existe produto com esse nome');

          ProdutoApi.deletar(primeiro.body._id, adminToken);
        });
      });
    });

    it('deve rejeitar cadastro de produto sem token de autenticação', () => {
      const produto = buildProduct();

      ProdutoApi.criar(produto, '').then((res) => {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
      });
    });
  });

  context('GET /produtos/{_id} - Busca por ID', () => {
    it('deve retornar os dados do produto criado', () => {
      const produto = buildProduct();

      ProdutoApi.criar(produto, adminToken).then((res) => {
        const id = res.body._id;

        ProdutoApi.buscar(id).then((busca) => {
          expect(busca.status).to.eq(200);
          expect(busca.body._id).to.eq(id);
          expect(busca.body.nome).to.eq(produto.nome);
          expect(busca.body.preco).to.eq(produto.preco);
          expect(busca.body.quantidade).to.eq(produto.quantidade);

          ProdutoApi.deletar(id, adminToken);
        });
      });
    });
  });

  context('PUT /produtos/{_id} - Atualização', () => {
    it('deve atualizar os dados do produto com sucesso', () => {
      const produto = buildProduct();
      const produtoAtualizado = buildProduct();

      ProdutoApi.criar(produto, adminToken).then((res) => {
        const id = res.body._id;

        ProdutoApi.atualizar(id, produtoAtualizado, adminToken).then((update) => {
          expect(update.status).to.eq(200);
          expect(update.body.message).to.eq('Registro alterado com sucesso');

          ProdutoApi.buscar(id).then((busca) => {
            expect(busca.body.nome).to.eq(produtoAtualizado.nome);
            expect(busca.body.preco).to.eq(produtoAtualizado.preco);

            ProdutoApi.deletar(id, adminToken);
          });
        });
      });
    });
  });

  context('DELETE /produtos/{_id} - Exclusão', () => {
    it('deve excluir o produto com sucesso', () => {
      const produto = buildProduct();

      ProdutoApi.criar(produto, adminToken).then((res) => {
        const id = res.body._id;

        ProdutoApi.deletar(id, adminToken).then((del) => {
          expect(del.status).to.eq(200);
          expect(del.body.message).to.eq('Registro excluído com sucesso');
        });
      });
    });
  });
});
