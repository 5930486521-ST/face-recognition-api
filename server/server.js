const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { idTokenResolver } = require("./middlewares/authentication");

const { postgresClient } = require("./connections");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const signout = require("./controllers/signout")
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(idTokenResolver)

app.get("/", (req, res) => {
  postgresClient
    .select("*")
    .from("users")
    .then(userArray => res.json(userArray));
});
app.post("/signin", signin.handleSignin);
app.get("/signin", signin.handleCreateSession);
app.get("/signout",signout.handleExpireSession)
app.post("/regis", register.handleRegister);
app.get("/profile/:id", profile.handleProfileGet);
app.post("/profile/:id", profile.handleProfilePost);
app.put("/image", image.handleImage);
app.post("/imageurl", image.handleApiCall);

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
