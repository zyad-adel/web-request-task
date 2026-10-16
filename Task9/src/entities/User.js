const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: { type: "int", primary: true, generated: true },
    username: { type: "varchar", nullable: false },
    email: { type: "varchar", unique: true, nullable: false },
    password: { type: "varchar", nullable: false },
  },
  relations: {
    notes: { type: "one-to-many", target: "Note", inverseSide: "user" },
  },
});
