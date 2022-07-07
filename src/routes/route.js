const express = require('express');
const router = express.Router();
const userController = require("../controller/userController")
const bookController = require("../controller/bookController")
const reviewController = require("../controller/reviewController")
const middleware = require("../middleware/auth")



//--------------------------------------------------------------------//

router.post("/register", userController.registerUser)
router.post("/login", userController.loginUser)
router.post("/books", middleware.tokenChecker, bookController.bookCreation)
router.get("/books", middleware.tokenChecker, bookController.getBooks)

//--------------------------------------------------------------------//
module.exports = router;