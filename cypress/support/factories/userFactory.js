const { faker } = require('@faker-js/faker');

const buildUser = ({ admin = false } = {}) => ({
  nome: faker.person.fullName(),
  email: faker.internet.email({ provider: 'qatest.dev' }).toLowerCase(),
  password: faker.internet.password({ length: 12 }),
  administrador: admin ? 'true' : 'false',
});

module.exports = { buildUser };
