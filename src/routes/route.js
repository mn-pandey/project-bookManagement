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
router.get("/books/:bookId", middleware.tokenChecker, bookController.getBookByParams)
router.put("/books/:bookId", middleware.tokenChecker, bookController.updateBooks)
router.delete("/books/:bookId", middleware.tokenChecker, bookController.deleteBookById)
router.post("/books/:bookId/review", reviewController.addReview)

//--------------------------------------------------------------------//
module.exports = router;