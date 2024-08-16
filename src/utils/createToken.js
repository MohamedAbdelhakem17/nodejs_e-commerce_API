const jwt = require("jsonwebtoken");
const { tokenSecretKey } = require("../config/variable");

const generateToken = (payload) =>
  jwt.sign(payload, tokenSecretKey, {
    expiresIn: "30d",
  });

module.exports = generateToken;
