const booksModel = require("../models/booksModel")
const reviewModel = require("../models/reviewModel")
const validate = require("../validation/validation")

//--------------------------------------------------------------------//

const addReview = async function (req, res) {
    try {
        if (!(validate.isValid(req.params.bookId) && validate.isValidObjectId(req.params.bookId))) {
            return res.status(400).send({ status: false, msg: "bookId is not valid" })
        }

        if (!validate.isValidBody(req.body)) {
            return res.status(400).send({ status: false, message: ' Review body is empty' })
        }

        let { reviewedBy, rating, review } = req.body

        if (!validate.isValid(reviewedBy)) {
            return res.status(400).send({ status: false, message: 'reviewedBy is not valid ' })
        }

        if (!validate.isValid(review)) {
            return res.status(400).send({ status: false, message: 'review is not valid ' })
        }

        if (!validate.isValid(rating)) {
            return res.status(400).send({ status: false, message: 'rating is not valid ' })
        }

        if (!([1, 2, 3, 4, 5].includes(Number(rating)))) {
            return res.status(400).send({ status: false, msg: "Rating should be from [1,2,3,4,5] this values" })

        }

        let book = await booksModel.findOne({ _id: req.params.bookId, isDeleted: false })
        if (book) {

            req.body["bookId"] = req.params.bookId
            req.body["reviewedAt"] = new Date()

            let review = await reviewModel.create(req.body)

            let ReviewCount = await reviewModel.find({ bookId: req.params.bookId }).count()
            console.log(ReviewCount)

            let countUpdate = await booksModel.findOneAndUpdate({ _id: req.params.bookId }, { reviews: ReviewCount })

            return res.status(201).send({ status: true, msg: "Thank you for Reviewing the book", addedReview: review })

        } else {
            return res.status(404).send({ status: true, msg: "no such book exist to be review" })


        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, error: err.message })

    }
}

//--------------------------------------------------------------------//

module.exports = { addReview }

//--------------------------------------------------------------------//