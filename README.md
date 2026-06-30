# Testes E2E — ServeRest

Automação de testes end-to-end com **Cypress** + **JavaScript** para:

- **Frontend:** https://front.serverest.dev/
- **API:** https://serverest.dev/

## Pré-requisitos

- Node.js >= 22.9.0
- npm >= 10

## Instalação

```bash
npm install
```

## Executar os testes

| Comando | Descrição |
| --- | --- |
| `npm run cy:open` | Abre o Cypress Test Runner (modo interativo) |
| `npm run cy:run` | Executa todos os testes em modo headless |
| `npm run cy:run:api` | Executa apenas os testes de API |
| `npm run cy:run:ui` | Executa apenas os testes de Frontend |
| `npm run lint` | Verifica o código com ESLint |
| `npm run format` | Formata o código com Prettier |

## Estrutura do projeto

```
cypress/
  e2e/
    api/
      usuarios.cy.js          # Teste 1 — CRUD de usuário
      autenticacao.cy.js      # Teste 2 — Autenticação via API
      produtos.cy.js          # Teste 3 — CRUD de produto
    ui/
      login.cy.js             # Teste 4 — Login válido e inválido
      logout.cy.js            # Teste 5 — Logout e proteção de rota
      carrinho-compra.cy.js   # Teste 6 — Carrinho (sessão única)
  support/
    api/                      # Service Objects (wrappers de cy.request)
    pages/                    # Page Objects (POM)
    factories/                # Test Data Factories (faker)
    commands.js               # Custom Commands globais
    e2e.js                    # Entry point do support
cypress.config.js
```

## Padrões adotados

- **Page Object Model (POM)** — encapsula seletores e ações de UI.
- **Service Object** — centraliza chamadas HTTP por recurso.
- **Test Data Factory** — dados únicos por execução via `@faker-js/faker`.
- **Custom Commands** — setup/teardown reutilizáveis (`cy.apiCreateUser`, `cy.loginViaApi`).
- **Conventional Commits** — histórico de commits padronizado e legível.
