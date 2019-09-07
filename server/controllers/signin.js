const bcrypt = require("bcrypt-nodejs");
const get = require("lodash/get");

const { postgresClient: db } = require("../connections");
const { createSession, isAuthenticated } = require("../utils/sessions");

const getUserInfo = email => {
  return db
    .select("*")
    .from("users")
    .where("email", "=", email)
    .then(user => {
      if (!user[0]) {
        throw new Error("unable to get user");
      }
      return user[0];
    })
    .catch(err => {
      throw new Error("unable to get user");
    });
};

const handleCreateSession = async (req, res) => {
  if (!isAuthenticated(res)) {
    return res.status(403).json("unable to authenticate");
  }
  const email = get(res, "locals.email.email");
  return getUserInfo(email)
    .then(userInfo => res.json(userInfo))
    .catch(err => {
      return res.status(500).json(err.message);
    });
};

const handleSignin = (req, res) => {
  const { email, pass } = req.body;
  if (!email || !pass) {
    return res.status(400).json("incorrect form submission");
  }
  db.select("*")
    .from("login")
    .where("email", "=", email)
    .then(data => {
      const isValid = bcrypt.compareSync(pass, data[0].hash);
      if (isValid) {
        return Promise.all([
          getUserInfo(email),
          createSession(email, data[0].iduser)
        ])
          .then(responses => {
            res.json({ idToken: responses[1], ...responses[0] });
          })
          .catch(err => res.status(500).json(err));
      } else {
        res.status(400).json("wrong credentials");
      }
    })
  .catch(err => res.status(400).json("wrong credentials"));
};

module.exports = {
  handleSignin: handleSignin,
  handleCreateSession
};
