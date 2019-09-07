const jwt = require("jsonwebtoken");
const { redisClient } = require("../connections");

const jwtVerify = encrypted => {
  return jwt.verify(encrypted, process.env.JWT_KEY || "fjwofeioawe;hifgo;aehw");
};

const idTokenResolver = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    try {
      res.locals.email = jwtVerify(authorization);
      return redisClient.get(authorization, (err, replies) => {
        if (err) {
          console.log(err);
        }
        res.locals.idUser = replies;
        next();
      });
    } catch (error) {
      console.log(error);
    }
  }
  next();
};

module.exports = {
  idTokenResolver
};
