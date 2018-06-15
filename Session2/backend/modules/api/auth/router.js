const express = require("express");
const router = express.Router();

const authController = require("./controller");

router.post("/", (req, res) => {
  authController
    .login(req.body)
    .then(userInfo => {
      req.session.userInfo = userInfo;
      res.send(userInfo);
    })
    .catch(error => res.status(error.status).send(error.err));
});

router.delete("/", (req, res) => {
  req.session.destroy();
  res.send("Logged out");
});

module.exports = router;
