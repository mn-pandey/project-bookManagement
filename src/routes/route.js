const express = require('express');
const router = express.Router();
const userController = require("../controller/userController")
const bookController = require("../controller/bookController")
const middleware = require("../middleware/auth")



//--------------------------------------------------------------------//

router.post("/register", userController.registerUser)
router.post("/login", userController.loginUser)
router.post("/books", middleware.tokenChecker, bookController.createBook)

//--------------------------------------------------------------------//
module.exports = router;