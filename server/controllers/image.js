const Clarifai = require('clarifai');
const { postgresClient: db } = require("../connections");
const { isAuthenticated } = require("../utils/sessions");

//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
 apiKey: 'YOUR_API_KEY_HERE'
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'))
}


const handleImage = (req, res) => {
  const { userInfo, addedEnties } = req.body;
  const { iduser,entries } = userInfo;
  const { idUser } = res.locals;
  if (!isAuthenticated(res)) {
    return res.status(403).json("unable to Authenticate");
  }
  if (iduser != idUser) {
    return res.status(401).json("unauthorized to do this action");
  }
  var updatedEntries = Number(entries) + addedEnties;
  db('users')
    .where('iduser', '=', iduser)
    .update({entries :updatedEntries})
    .returning('*')
    .then(entries => {
      res.json(entries[0]);
    })
  .catch(err => res.status(400).json(err))
}

module.exports = {
  handleImage,
  handleApiCall
}