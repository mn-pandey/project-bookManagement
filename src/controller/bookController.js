const booksModel = require("../models/booksModel")
const userModel = require("../models/userModel")
const reviewModel = require("../models/reviewModel")
const validate = require("../validation/validation")
const validateDate = require("validate-date");

//--------------------------------------------------------------------//

const bookCreation = async function (req, res) {
    try {
        let data = req.body;
        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data

        if (!validate.isValidBody(data)) {
            return res.status(400).send({ status: false, message: "Please provide data ⚠️" })
        }

        if (!validate.isValid(userId)) {
            return res.status(400).send({ status: false, message: "Please provide userId ⚠️" });
        }

        if (!validate.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Please Provide a valid userId in body ⚠️" });;
        }

        if (userId != req.userId) {
            return res.status(403).send({ status: false, message: "Your are not authorize to create this book with this userId ⚠️" });;
        }

        if (!validate.isValid(title)) {
            return res.status(400).send({ status: false, message: "Title must be present ⚠️" })
        }
        const checkTitle = await booksModel.findOne({ title: title })
        if (checkTitle) {
            return res.status(400).send({ status: false, message: "Please provide another title, this title has been used ⚠️" })
        }

        if (!validate.isValid(excerpt)) {
            return res.status(400).send({ status: false, message: "excerpt must be present ⚠️" })
        }

        if (ISBN.trim().length !== 13 || !Number(ISBN))
            return res.status(400).send({ status: false, message: "ISBN must contain 13 digits" });

        const checkIsbn = await booksModel.findOne({ ISBN: ISBN });
        if (checkIsbn) {
            return res.status(400).send({ status: false, message: "Please provide another isbn, this isbn has been used ⚠️" })
        }

        if (!validate.isValid(category)) {
            return res.status(400).send({ status: false, message: "category must be present ⚠️" })
        }

        if (!validate.isValid(subcategory)) {
            return res.status(400).send({ status: false, message: "subcategory must be present ⚠️" })
        }

        if (!validate.isValid(releasedAt)) {
            return res.status(400).send({ status: false, message: "releasedAt must be present ⚠️" })
        }

        if (!validateDate(releasedAt, responseType = 'boolean')) {
            return res.status(400).send({ status: false, message: "Invalid date format, Please provide date as 'YYYY-MM-DD' ⚠️" })
        };
        a
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(400).send({ status: false, message: "User does not exists ⚠️" })
        }

        const newBook = await booksModel.create(data);
        return res.status(201).send({ status: true, message: "Book created successfully ✅", data: newBook })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

//--------------------------------------------------------------------//

const getBooks = async function (req, res) {
    try {
        let filter = { isDeleted: false }
        if (req.query.userId) {

            if (!(validate.isValid(req.query.userId) && validate.isValidObjectId(req.query.userId))) {
                return res.status(400).send({ status: false, msg: "userId is not valid ⚠️" })
            }
            filter["userId"] = req.query.userId
        }
        if (req.query.category) {

            if (!validate.isValid(req.query.category)) {
                return res.status(400).send({ status: false, message: "Book category is not valid ⚠️" })
            }
            filter["category"] = req.query.category
        }
        if (req.query.subcategory) {

            if (!validate.isValid(req.query.subcategory)) {
                return res.status(400).send({ status: false, message: "Book subcategory is not valid ⚠️" })

            }
            filter["subcategory"] = req.query.subcategory
        }
        let book = await booksModel.find(filter).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })

        if (book.length > 0) {
            return res.status(200).send({ status: true, message: "book  list ✅", data: book })

        } else {
            return res.status(404).send({ status: false, message: "no such book found !! ⚠️" })

        }
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}


//--------------------------------------------------------------------//

const getBookByParams = async function (req, res) {
    try {
        const bookParams = req.params.bookId

        if (!validate.isValidObjectId(bookParams)) {
            return res.status(400).send({ status: false, message: "Inavlid bookId ⚠️" })
        }

        const findBook = await booksModel.findOne({ _id: bookParams, isDeleted: false }).select({ __v: 0 })
        if (!findBook) {
            return res.status(404).send({ status: false, message: `Book does not exist or is already been deleted for this ${bookParams} ⚠️` })
        }

        const reviewData = await reviewModel.find({ bookId: bookParams })
        let review = findBook.toObject()
        if (reviewData) {
            review["reviewData"] = reviewData
        }
        return res.status(200).send({ status: true, message: "Book found Successfully ✅", data: review })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

//--------------------------------------------------------------------//

const updateBooks = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        if (bookId) {
            if (!validate.isValidObjectId(bookId)) {
                return res.status(400).send({ status: false, msg: "bookId is not valid book id please check it ⚠️" })
            }
        }

        let book = await booksModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) {
            return res.status(400).send({ status: false, message: "bookId is not matching with any existing bookId or it is deleted ⚠️" })
        }

        if (book.userId != req.userId) {
            return res.status(403).send({ status: false, message: "Unauthorized access ⚠️" })
        }

        let data = req.body;
        if (!validate.isValidBody(data)) {
            return res.status(400).send({ status: false, message: "please provide what you want  to update ⚠️" })
        }

        const { title, excerpt, releasedAt, ISBN } = data;
        if (title) {
            let titlePresent = await booksModel.find({ title: title, isDeleted: false })
            if (titlePresent.length !== 0) {
                return res.status(400).send({ status: false, message: "title should be unique , it is already existed with any other book ⚠️" })
            }
            book.title = title;
        }
        if (excerpt) book.excerpt = excerpt;
        if (releasedAt) book.releasedAt = releasedAt;
        if (ISBN) {
            let ISBNprensent = await booksModel.find({ ISBN: ISBN, isDeleted: false })
            if (ISBNprensent.length !== 0) {
                return res.status(400).send({ status: false, message: "ISBN should be unique , it is already existed with any other book ⚠️" })
            }
            book.ISBN = ISBN;
        }
        book.save();
        return res.status(200).send({ status: true, message: "updated succesfully ✅", data: book })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

//--------------------------------------------------------------------//


const deleteBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        if (bookId) {
            if (!validate.isValidObjectId(bookId)) {
                return res.status(400).send({ status: false, msg: "bookId is not valid please check it ⚠️" })
            }
        }
        let book = await booksModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) {
            return res.status(404).send({ status: false, message: "bookId is not matching with any existing bookId or it is deleted ⚠️" })
        }
        if (book.userId != req.userId) {
            return res.status(403).send({ status: false, message: "Unauthorized access ⚠️" })
        }
        let deleted = await booksModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: Date.now() } })
        if (deleted) {
            return res.status(200).send({ status: true, message: "book deleted succesfully ✅" })
        }
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}
//--------------------------------------------------------------------//

module.exports = { bookCreation, getBooks, getBookByParams, updateBooks, deleteBookById }

//--------------------------------------------------------------------//