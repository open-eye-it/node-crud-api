var mysql = require("mysql");

var conection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "node_crud_api",
});

conection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = conection;
