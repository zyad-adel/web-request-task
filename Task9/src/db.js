const { DataSource } = require("typeorm");
const User = require("./entities/User");
const Note = require("./entities/Note");

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [User, Note],
});

module.exports = { AppDataSource };
