const express = require("express");
const router = express.Router();
const { loginAdmin } = require("../Controller/adminController");
const { loginShop } = require("../Controller/shopController");
const { loginUser } = require("../Controller/userController");

const loginHandlers = {
  shop: loginShop,
  user: loginUser,
  admin: loginAdmin,
};

router.post("/mainlogin", (req, res, next) => {
  const { email } = req.body;
  const { password } = req.body;
  const { type } = req.body;

  if (
    email == process.env.ADMIN_EMAIL &&
    password == process.env.ADMIN_PASSWORD &&
    type == process.env.ADMIN_TYPE
  ) {
    return loginHandlers["admin"](req, res, next);
  }

  if (!type || !loginHandlers[type]) {
    return res.status(400).json({ message: "invalid login type" });
  }

  return loginHandlers[type](req, res, next);
});

module.exports = router;
