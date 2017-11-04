const mssql = require('mssql');

const config = {
    server: "csc495.database.windows.net",
    database: "csc495-db",
    user: "csc495",
    password: "D-4f-Fac",
    port: 1433,
    options: {
        encrypt: true
    }
};

let conn = mssql.connect(config);

module.exports = conn;
