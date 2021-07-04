const jwt = require("jsonwebtoken");
require('dotenv').config()
const config = require('../config')

const createToken = (user) => {
  const exp = '1h'

  const payload = {
    sub: user,
    iat: Math.floor(Date.now() / 1000),
  };

  const signedToken = jwt.sign(payload, config.jwtSecret, {
    expiresIn: exp, // 30s for testing purposes
  });

  return {
    token: "Bearer " + signedToken,
    expires: exp,
  };
};

module.exports = {
  createToken
}