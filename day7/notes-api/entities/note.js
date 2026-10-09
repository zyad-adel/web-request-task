const { EntitySchema } = require("typeorm");

const NoteSchema = new EntitySchema({
  name: "note",
  tableName: "notes",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    content: {
      type: "text",
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "user",
      joinColumn: true,
      nullable: false,
    },
  },
});

module.exports = NoteSchema;