const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Note",
  tableName: "notes",
  columns: {
    id: { type: "int", primary: true, generated: true },
    title: { type: "varchar", nullable: false },
    content: { type: "text", nullable: true },
    userId: { type: "int", nullable: false },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "userId" },
      inverseSide: "notes",
    },
  },
});
