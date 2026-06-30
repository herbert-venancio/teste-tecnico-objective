# Plano de Automação de Testes E2E — ServeRest

Plano de automação de QA para criação de **6 testes E2E** (3 de API + 3 de Frontend) com **Cypress** em **JavaScript**, cobrindo:

- **Frontend:** https://front.serverest.dev/
- **API (Swagger):** https://serverest.dev/

---

## 1. Stack e ferramentas

- **Cypress** (`^15`) como runner E2E — já presente em `devDependencies`.
- **JavaScript** (sem TypeScript), mantendo a configuração mínima e direta.
- **@faker-js/faker** para gerar dados dinâmicos (e-mail, nome, senha), garantindo
  testes auto-contidos e independentes do estado do ambiente público.
- **ESLint + Prettier** (com `eslint-plugin-cypress`) para padronização e qualidade de código.
- **cypress-plugin-api** (opcional) para deixar os testes de API mais legíveis no runner.

---

## 2. Estrutura de pastas proposta

```
cypress/
  e2e/
    api/
      usuarios.cy.js            # Testes 1–3 (API — Usuários e Login)
      produtos.cy.js            # Testes 1–3 (API — Produtos)
    ui/
      login.cy.js               # Testes 4–5 (Frontend — Autenticação)
      carrinho-compra.cy.js     # Teste 6 (Frontend — Carrinho, sessão única)
  fixtures/
  support/
    commands.js                 # custom commands (ex: cy.apiCreateUser, cy.apiLogin)
    e2e.js
    pages/                      # Page Objects (POM)
      LoginPage.js
      ProductListPage.js
      CartPage.js
    api/                        # Service Objects
      UsuarioApi.js
      ProdutoApi.js
      LoginApi.js
    factories/
      userFactory.js            # geração de dados via faker
      productFactory.js
cypress.config.js
.eslintrc.json / .prettierrc
```

---

## 3. Padrões de projeto adotados

- **Page Object Model (POM)** para os testes de UI — encapsula seletores e ações de cada página.
- **Service/API Object** para os testes de API — centraliza chamadas a `/usuarios`, `/login`, `/produtos`.
- **Test Data Factory** — gera dados únicos por execução (faker), atendendo à observação de que
  dados podem ser apagados por outros candidatos.
- **Custom Commands** — ações reutilizáveis (criar usuário via API, login programático)
  para reduzir duplicação e acelerar o setup (App Actions pattern).
- **baseUrl + env** no `cypress.config.js` separando URL do front
  (`https://front.serverest.dev/`) e da API (`https://serverest.dev/`).

---

## 4. Os 6 testes E2E

### — API —

#### Teste 1 — API: CRUD de usuário (`/usuarios`)

Fluxo auto-contido:

1. `POST /usuarios` cria usuário com dados gerados por faker → valida `201` e
   `message: "Cadastro realizado com sucesso"`.
2. `GET /usuarios/{id}` confirma persistência e integridade dos dados criados.
3. `PUT /usuarios/{id}` atualiza nome e senha → valida `200` e `message: "Registro alterado com sucesso"`.
4. `DELETE /usuarios/{id}` faz o teardown → valida `200` e `message: "Registro excluído com sucesso"`.

#### Teste 2 — API: Autenticação (`/login`)

Fluxo auto-contido:

1. Setup: `POST /usuarios` cria usuário temporário.
2. `POST /login` com credenciais válidas → valida `200` e presença do campo `authorization` (Bearer token).
3. `POST /login` com senha incorreta → valida `401` e mensagem de erro `"Email e/ou senha inválidos"`.
4. `POST /login` com body vazio → valida `400` com mensagem de campo obrigatório.
5. Teardown: `DELETE /usuarios/{id}`.

#### Teste 3 — API: CRUD de produtos (`/produtos`)

Fluxo auto-contido (requer admin):

1. Setup: cria usuário admin via `POST /usuarios` e obtém token via `POST /login`.
2. `POST /produtos` cria produto com dados gerados por faker, usando o token → valida `201`.
3. `GET /produtos/{id}` confirma persistência nome, preço e quantidade.
4. `PUT /produtos/{id}` atualiza preço → valida `200`.
5. `DELETE /produtos/{id}` faz teardown do produto e do usuário → valida `200`.

---

### — Frontend —

#### Teste 4 — Frontend: Login com credenciais válidas e inválidas

Fluxo auto-contido:

1. Setup: cria usuário via API no `beforeEach`.
2. Acessa `/login` e tenta autenticar com **senha inválida** → valida mensagem de erro na UI.
3. Autentica com **credenciais corretas** → valida redirecionamento para a tela principal e
   nome do usuário visível.
4. Teardown: remove o usuário via API.

#### Teste 5 — Frontend: Logout e proteção de rota autenticada

Fluxo auto-contido:

1. Setup: cria usuário via API e faz login programático (via `cy.request`, sem UI).
2. Acessa a área autenticada e confirma que o usuário está logado.
3. Clica em **Sair** → valida redirecionamento para `/login`.
4. Tenta acessar rota protegida diretamente após logout → valida redirecionamento de volta a `/login`.
5. Teardown: remove o usuário via API.

#### Teste 6 — Frontend: Fluxo de carrinho (sessão única)

Respeitando a observação "carrinho não sobrevive ao deslogar":

1. Setup: cria usuário e produto via API; faz login (tudo na mesma sessão Cypress).
2. Navega para a lista de produtos e localiza o produto criado no setup.
3. Adiciona o produto ao carrinho → valida feedback visual de adição.
4. Abre o carrinho e valida nome, preço e quantidade do item.
5. Teardown: exclui produto e usuário via API (carrinho é descartado junto com a sessão).

> Como o ambiente é público, setup e teardown de dados são sempre feitos via API
> para garantir isolamento e não depender de dados de terceiros.

---

## 5. Boas práticas aplicadas

- Testes **independentes**: cada `it` cria e destrói seus próprios dados
  (`beforeEach`/`afterEach`), sem acoplamento de ordem.
- Sem credenciais fixas/hardcoded — dados sempre dinâmicos.
- Assertivas claras e específicas (status HTTP, mensagens, conteúdo de elementos),
  evitando asserts genéricos.
- Seletores estáveis (`data-*`) sempre que possível; evitar XPath frágil.
- Sem `cy.wait(tempo fixo)` — usar `cy.intercept` + alias para sincronização de rede.

---

## 6. Estratégia de commits (Conventional Commits)

- `chore: configura cypress, eslint e prettier`
- `feat: adiciona factories, page objects e service objects`
- `test: adiciona teste e2e de CRUD de usuario (api)`
- `test: adiciona teste e2e de autenticacao (api)`
- `test: adiciona teste e2e de CRUD de produtos (api)`
- `test: adiciona teste e2e de login/logout (front)`
- `test: adiciona teste e2e de protecao de rota (front)`
- `test: adiciona teste e2e de carrinho (front)`
- `docs: documenta como executar os testes`

---

## 7. Mapeamento com os critérios de avaliação

| Critério | Como é atendido |
| --- | --- |
| Boas práticas de desenvolvimento | ESLint/Prettier, custom commands, env config, sem hardcode |
| Qualidade na construção de código | POM, Service Objects, factories, baixa duplicação |
| Aplicação de padrões de projeto | Page Object Model, Service Object, Factory, App Actions |
| Adequação e clareza das assertivas | Asserts específicos de status, mensagens e conteúdo |
| Escrita e organização dos cenários | Estrutura `describe/it` clara, separação api/ui, testes auto-contidos |
| Qualidade e clareza nos commits | Conventional Commits, commits atômicos por entrega |
