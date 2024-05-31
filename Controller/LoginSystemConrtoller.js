const connection = require("../connection");
const bcrypt = require('bcrypt');
const helper = require('../helper');

module.exports = {
  signup: (req, res) => {
    const payload = req.body;
    bcrypt.hash(payload.password, 10, (err, hash) => {
      if(err){
        return;
      }
      let selecSql = "SELECT email FROM users WHERE email='"+payload.email+"'";
      connection.query(selecSql, function(err, result){
        if(err){
          throw err;
        }else{
          if(result.length > 0){
            let msg = helper.responseJson(0, "Email already exist.");
            return res.status(200).send(msg);  
          }else{
            let sql =
              "INSERT INTO users(username, email, password) values('" +
              payload.username +
              "', '" +
              payload.email +
              "', '" +
              hash +
              "')";
            connection.query(sql, function (err, result) {
              if (err) {
                throw err;
              } else {
                let msg = helper.responseJson(1, "User signup successfully.");
                return res.status(200).send(msg);
              }
            });   
          }
        }
      });
    });
  },
  signin: (req, res) => {
    const payload = req.body;
    let sql =
    "SELECT * FROM users WHERE email='" + payload.email +"'";
    connection.query(sql, function (err, result) {
      if (err) {
        throw err;
      } else {
        let data = result[0];
        bcrypt.compare(payload.password, data.password, function(err, result){
          if(err){
            throw err;
          }else{
            if(result){
              let randomString = helper.randomString(10);
              bcrypt.hash(randomString, 10, (err, token) => {
                if(err){
                  let msg = helper.responseJson(0, "Something wrong with signin.");
                  return res.status(202).send(msg);
                }else{
                  let addTokenSql = "INSERT INTO authentication(u_id, token) values('"+data.id+"', '"+token+"')"
                  connection.query(addTokenSql, function(err, result){
                    if(err){
                      throw err;
                    }else{
                      let msg = helper.responseJson(1, "User signin successfully", token);
                      return res.status(200).send(msg);
                    }
                  });
                }
              });
            }else{
              let msg = helper.responseJson(0, "Invalid Password");
              return res.status(422).send(msg);
            }
          }
        });
      }
    });
  },
  signout:(req, res) => {
    const header = req.headers['authorization'];
    if(header != ''){
      let token = header.split(' ');
      token = token[1];
      let checkTokenSql = "select * FROM authentication where token='"+token+"'";
      connection.query(checkTokenSql, function(err, result){
        if(err){
          throw err;
        }else{
          if(result.length > 0){
            let tokenData = result[0];
            let removeTokenSql = "DELETE FROM authentication WHERE token='"+tokenData.token+"'";
            connection.query(removeTokenSql, function(err, result){
              if(err){
                throw err;
              }else{
                let msg = helper.responseJson(1, "Signout successfully");
                return res.status(200).send(msg);
              }
            });
          }else{
            let msg = helper.responseJson(0, "Authentication not valid or expired");
            return res.status(402).send(msg);
          }
        }
      });
    }else{
      let msg = helper.responseJson(0, "Please add authentication");
      return res.status(404).send(msg);
    }
  }
};
