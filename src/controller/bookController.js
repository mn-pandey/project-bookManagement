const booksModel = require("../models/booksModel")
const userModel = require("../models/userModel")
const validate = require("../validation/validation")
const validateDate = require("validate-date");

const createBook = async function (req, res) {
    try {
        let data = req.body;
        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data

        if (!validate.isValidBody(data)) {
            return res.status(400).send({ status: false, message: "Please provide data" })
        }

        if (!validate.isValid(title)) {
            return res.status(400).send({ status: false, message: "Title must be present" })
        }
        const checktitle = await booksModel.findOne({ title: title })
        if (checktitle) {
            return res.status(400).send({ status: false, message: "Please provide another title, this title has been used" })
        }

        if (!validate.isValid(excerpt)) {
            return res.status(400).send({ status: false, message: "excerpt must be present" })
        }

        if (!validate.isValid(userId)) {
            return res.status(400).send({ status: false, message: "userId must be present" })
        }

        if (!validate.isValid(ISBN)) {
            return res.status(400).send({ status: false, message: "ISBN must be present" })
        }
        const checkisbn = await booksModel.findOne({ ISBN: ISBN });
        if (checkisbn) {
            return res.status(400).send({ status: false, message: "Please provide another isbn, this isbn has been used" })
        }

        if (!validate.isValid(category)) {
            return res.status(400).send({ status: false, message: "category must be present" })
        }
        if (!validate.isValid(subcategory)) {
            return res.status(400).send({ status: false, message: "subcategory must be present" })
        }
        if (!validate.isValid(releasedAt)) {
            return res.status(400).send({ status: false, message: "releasedAt must be present" })
        }

        if (!validate.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid userId" })
        }

        if (!validateDate(releasedAt, responseType = 'boolean')) {
            return res.status(400).send({ status: false, message: "Invalid date format, Please provide date as 'YYYY-MM-DD'" })
        };

        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(400).send({ status: false, message: "User does not exists" })
        }

        const newBook = await booksModel.create(data);
        return res.status(201).send({ status: true, message: "Book created successfully", data: newBook })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

module.exports = { createBook }
