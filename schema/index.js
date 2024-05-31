const connection = require("../connection");
const helper = require('../helper');
const Joi = require("@hapi/joi");

/* Start:: Signup validation */
const registerSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(12).required(),
});

const regiserValidaion = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(422).send(error.details[0].message);
  } else {
    return next();
  }
};
/* End:: Signup validation */
/* Start:: Signin validation */
const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(12).required(),
});

const signinValidation = (req, res, next) => {
  const { error } = signinSchema.validate(req.body);
  if (error) {
    return res.status(422).send(error.details[0].message);
  } else {
    return next();
  }
};
/* End:: Signin validation */
/* Start:: Category validation */
const categorySchema = Joi.object({
  c_name: Joi.string().required(),
  c_image: Joi.string()
});
const categoryValidation = (req, res, next) => {
  const { error } = categorySchema.validate(req.body);
  if(error){
    return res.status(422).send(error.details[0].message);
  }else{
    return next();
  }
};
/* End:: Category validation */
/* Start:: Authentication Check */
const AuhCheck = (req, res, next) => {
  const header = req.headers['authorization'];
  if(header == '' || header == null){
    let msg = helper.responseJson(0, "Please add authentication");
    return res.status(422).send(msg);
  }else{
    let token = header.split(' ');
      token = token[1];
      let checkTokenSql = "select * FROM authentication where token='"+token+"'";
      connection.query(checkTokenSql, function(err, result){
        if(err){
          throw err;
        }else{
          if(result.length > 0){
            return next();
          }else{
            let msg = helper.responseJson(0, "Authentication not valid or expired");
            return res.status(402).send(msg);
          }
        }
      });
  }
}
/* End:: Authentication Check */

module.exports = { regiserValidaion, signinValidation, categoryValidation, AuhCheck };
