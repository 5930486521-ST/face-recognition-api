const { redisClient } = require("../connections");
const jwt = require("jsonwebtoken");
const get = require("lodash/get");

const storeTokenToRedis = async (token, id) => {
  try {
    await redisClient.set(token, id);
    return token;
  } catch (error) {
    throw new Error("Server Error");
  }
};

// implement both two kinds of session:
// token and cookie-like session (store the hash to DB to identify something)
const createSession = (email, id) => {
  // token
  try {
    const token = jwt.sign(
      { email },
      process.env.JWT_KEY || "fjwofeioawe;hifgo;aehw"
    );
    // cookie-like session: to store in DB (check both of them)
    return storeTokenToRedis(token, id);
  } catch (err) {
    throw new Error(err.message);
  }
};

const expireSession = async token => {
  try {
    const result =  await redisClient.del(token);
    return result
  } catch (error) {
    throw new Error("Server Error");
  }
};

const isAuthenticated = res => {
  const { email, idUser } = res.locals;
  if (!get(email, "email") || !idUser) {
    return false;
  }
  return true;
};

module.exports = {
  createSession,
  expireSession,
  isAuthenticated
};
