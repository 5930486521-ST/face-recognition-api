const { isAuthenticated, expireSession } = require("../utils/sessions");

const handleExpireSession = (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).json("token required");
  }
  if (!isAuthenticated(res)) {
    return res.status(403).json("unable to sign out");
  }
  expireSession(authorization)
    .then(result => {
      if (!result) {
        return res.status(401).json("unable to sign out");
      }
      return res.json(result);
    })
    .catch(err => res.status(500).json(err.message));
};

module.exports = {
  handleExpireSession
};
