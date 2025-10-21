const { generar, remover } = require("../controllers/autenticate.controller");
const express = require("express");

const router = express.Router();

router.post("/login", generar);
router.post("/logout", remover);

module.exports = router;