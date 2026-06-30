const { buildUser } = require('../../support/factories/userFactory');
const UsuarioApi = require('../../support/api/UsuarioApi');
const LoginApi = require('../../support/api/LoginApi');

describe('API - Autenticação (/login)', () => {
  let usuario;
  let usuarioId;

  beforeEach(() => {
    usuario = buildUser();
    UsuarioApi.criar(usuario).then((res) => {
      usuarioId = res.body._id;
    });
  });

  afterEach(() => {
    UsuarioApi.deletar(usuarioId);
  });

  it('deve autenticar com credenciais válidas e retornar token Bearer', () => {
    LoginApi.autenticar(usuario.email, usuario.password).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.message).to.eq('Login realizado com sucesso');
      expect(res.body.authorization).to.be.a('string');
      expect(res.body.authorization).to.match(/^Bearer\s.+/);
    });
  });

  it('deve rejeitar login com senha incorreta', () => {
    LoginApi.autenticar(usuario.email, 'senha-errada-123').then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body.message).to.eq('Email e/ou senha inválidos');
    });
  });

  it('deve rejeitar login com email não cadastrado', () => {
    LoginApi.autenticar('nao-existe@qatest.dev', usuario.password).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body.message).to.eq('Email e/ou senha inválidos');
    });
  });

  it('deve rejeitar login com body vazio e informar campos obrigatórios', () => {
    LoginApi.autenticar('', '').then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.have.any.keys('email', 'password');
    });
  });
});
