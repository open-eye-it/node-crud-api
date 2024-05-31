const express = require("express");
const app = express();
const cors = require('cors');

var whitelist = ['http://localhost:1992'];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));


app.use(express.json({limit:'2mb'}));

const PORT = process.env.PORT || 1992;

app.listen(PORT, () => {
  console.log("Server listend on port: " + PORT);
});

const validateSchema = require("./schema");

const { signup, signin, signout } = require("./Controller/LoginSystemConrtoller");
const { categoryCreate, categoryList, categorySingle, categoryUpdate } = require('./Controller/CategoryConrtoller');

app.post("/signup", validateSchema.regiserValidaion, signup);
app.post("/signin", validateSchema.signinValidation, signin);
app.get("/signout", signout);

app.post("/caetgory/create", [validateSchema.AuhCheck, validateSchema.categoryValidation], categoryCreate);
app.get("/categories/list", [validateSchema.AuhCheck], categoryList);
app.get("/categories/single/:c_id", [validateSchema.AuhCheck], categorySingle);
app.put("/categories/updae/:c_id", [validateSchema.AuhCheck], categoryUpdate);
