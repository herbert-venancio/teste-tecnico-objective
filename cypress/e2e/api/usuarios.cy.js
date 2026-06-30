const { buildUser } = require('../../support/factories/userFactory');
const UsuarioApi = require('../../support/api/UsuarioApi');

describe('API - CRUD de Usuários', () => {
  context('POST /usuarios - Cadastro', () => {
    it('deve cadastrar um novo usuário com sucesso', () => {
      const usuario = buildUser();

      UsuarioApi.criar(usuario).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body.message).to.eq('Cadastro realizado com sucesso');
        expect(res.body._id).to.be.a('string').and.not.be.empty;

        UsuarioApi.deletar(res.body._id);
      });
    });

    it('deve rejeitar cadastro com email já utilizado', () => {
      const usuario = buildUser();

      UsuarioApi.criar(usuario).then((primeiro) => {
        UsuarioApi.criar(usuario).then((segundo) => {
          expect(segundo.status).to.eq(400);
          expect(segundo.body.message).to.eq('Este email já está sendo usado');

          UsuarioApi.deletar(primeiro.body._id);
        });
      });
    });
  });

  context('GET /usuarios/{_id} - Busca por ID', () => {
    it('deve retornar os dados do usuário criado', () => {
      const usuario = buildUser();

      UsuarioApi.criar(usuario).then((res) => {
        const id = res.body._id;

        UsuarioApi.buscar(id).then((busca) => {
          expect(busca.status).to.eq(200);
          expect(busca.body._id).to.eq(id);
          expect(busca.body.nome).to.eq(usuario.nome);
          expect(busca.body.email).to.eq(usuario.email);
          expect(busca.body.administrador).to.eq(usuario.administrador);

          UsuarioApi.deletar(id);
        });
      });
    });
  });

  context('PUT /usuarios/{_id} - Atualização', () => {
    it('deve atualizar os dados do usuário com sucesso', () => {
      const usuarioOriginal = buildUser();
      const usuarioAtualizado = buildUser();

      UsuarioApi.criar(usuarioOriginal).then((res) => {
        const id = res.body._id;

        UsuarioApi.atualizar(id, usuarioAtualizado).then((update) => {
          expect(update.status).to.eq(200);
          expect(update.body.message).to.eq('Registro alterado com sucesso');

          UsuarioApi.buscar(id).then((busca) => {
            expect(busca.body.nome).to.eq(usuarioAtualizado.nome);
            expect(busca.body.email).to.eq(usuarioAtualizado.email);

            UsuarioApi.deletar(id);
          });
        });
      });
    });
  });

  context('DELETE /usuarios/{_id} - Exclusão', () => {
    it('deve excluir o usuário com sucesso', () => {
      const usuario = buildUser();

      UsuarioApi.criar(usuario).then((res) => {
        const id = res.body._id;

        UsuarioApi.deletar(id).then((del) => {
          expect(del.status).to.eq(200);
          expect(del.body.message).to.eq('Registro excluído com sucesso');
        });
      });
    });

    it('deve retornar mensagem ao tentar excluir usuário inexistente', () => {
      UsuarioApi.deletar('id-inexistente-000').then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.message).to.eq('Nenhum registro excluído');
      });
    });
  });
});
