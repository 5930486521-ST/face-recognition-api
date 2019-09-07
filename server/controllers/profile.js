const { postgresClient: db } = require("../connections");
const { isAuthenticated } = require("../utils/sessions");

const handleProfileGet = (req, res) => {
  const { id } = req.params;
  const { idUser } = res.locals;
  if (!isAuthenticated(res)) {
    return res.status(403).json("unable to Authenticate");
  }
  if (id != idUser) {
    return res.status(401).json("unauthorized to do this action");
  }
  db.select("*")
    .from("users")
    .where({ iduser: id })
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch(err => res.status(400).json("error getting user"));
};

const handleProfilePost = (req, res) => {
  const { id } = req.params;
  const { idUser } = res.locals;
  const { name } = req.body;
  if (!isAuthenticated(res)) {
    return res.status(403).json("unable to Authenticate");
  }
  if (id != idUser) {
    return res.status(401).json("unauthorized to do this action");
  }
  db.select("*")
    .from("users")
    .where({ iduser: id })
    .update({ name })
    .returning("*")
    .then(result => {
      if (result.length) {
        return res.json(result[0]);
      }
      return res.status(500).json("error updating user");
    })
    .catch(err => res.status(400).json("error updating user"));
};

module.exports = {
  handleProfileGet,
  handleProfilePost
};
