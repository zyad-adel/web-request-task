const { DataSource } = require("typeorm");
const Note = require("./entities/note");
const User = require("./entities/user");

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",  
    password: "179",        
    database: "test_db",    
    synchronize: true,
    logging: false,
    entities: [Note, User],
});

module.exports = AppDataSource;
