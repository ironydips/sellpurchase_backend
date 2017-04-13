//========================== Load Modules Start ===========================

//========================== Load Internal Module =========================

let exceptions = require('./customExceptions');
let appConstants = require('./constants');
let TOKEN_EXPIRATION_SEC = appConstants.TOKEN_EXPIRATION_TIME * 60;
let EMAIL_LINK_EXP_TIME = '2d';
let JWT_ALGORITHM = 'RS256';
let JWT_SECRET_KEY = "login_secret_key_to_save_data";

//========================== Load External Module =========================

let Promise = require("bluebird");
let jwt = Promise.promisifyAll(require("jsonwebtoken"));

//========================== Load External Module End =========================

//========================== Load Modules End =============================


let genJWTToken = function (user, setExpire) {
  let options = {};
  if (setExpire) {
    options.expiresIn = TOKEN_EXPIRATION_SEC;
  }
  return jwt.signAsync(user, JWT_SECRET_KEY, options)
    .then(function (jwtToken) {
      return jwtToken;
    }).catch(function (err) {
      throw new exceptions.tokenGenException();
    });
};

let verifyUsrToken = function (acsTokn) {
  return jwt.verifyAsync(acsTokn, JWT_SECRET_KEY)
    .then(function (tokenPayload) {
      return tokenPayload;
    }).catch(function (err) {
      throw new exceptions.unAuthenticatedAccess(err.message);
    });
};

let verifyUsrForgotPassToken = function (acsTokn) {
  return jwt.verifyAsync(acsTokn, JWT_SECRET_KEY)
    .then(function (tokenPayload) {
      return tokenPayload;
    }).catch(function (err) {
      throw new exceptions.unauthorizedAccess(err);
    });
};

//========================== Export Module Start ===========================

module.exports = {
  genJWTToken, verifyUsrToken
};

//========================== Export Module   End ===========================
