const mongoose = require("mongoose");
const booksModel = require("../models/booksModel")
const reviewModel = require("../models/reviewModel")
const validate = require("../validation/validation")

//--------------------------------------------------------------------//

const addReview = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        if (bookId) {
            if (!validate.isValidObjectId(bookId)) {
                return res.status(400).send({ status: false, msg: "bookId is not valid book id please check it 🚫" })
            }
        }

        if (!validate.isValidBody(req.body)) {
            return res.status(400).send({ status: false, message: "Review body is empty 🚫" })
        }

        let { reviewedBy, rating, review } = req.body
        if(reviewedBy){
            if (!validate.isValid(reviewedBy)) {
                return res.status(400).send({ status: false, message: "reviewedBy is not valid 🚫" })
            }
        }

        if (!validate.isValid(review)) {
            return res.status(400).send({ status: false, message: "review is not valid 🚫" })
        }

        if (!validate.isValid(rating)) {
            return res.status(400).send({ status: false, message: "rating is not valid 🚫" })
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).send({ status: false, msg: "Rating should be in between 1 to 5 🚫" })
        }

        let book = await booksModel.findOne({ _id: req.params.bookId, isDeleted: false })
        if (book) {

            req.body["bookId"] = req.params.bookId
            req.body["reviewedAt"] = new Date()

            let review = await reviewModel.create(req.body)

            let ReviewCount = await reviewModel.find({ bookId: req.params.bookId }).count()
            console.log(ReviewCount)

            let countUpdate = await booksModel.findOneAndUpdate({ _id: req.params.bookId }, { reviews: ReviewCount })

            return res.status(201).send({ status: true, msg: "Thank you for Reviewing the book ✅", addedReview: review })

        } else {
            return res.status(404).send({ status: true, msg: "no such book exist to be review 🚫" })


        }
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

//--------------------------------------------------------------------//

const updateReview = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;
        if (bookId) {
            if (!validate.isValidObjectId(bookId)) {
                return res.status(400).send({ status: false, msg: "bookId is not valid book id please check it 🚫" })
            }
        }
        let book = await booksModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) {
            return res.status(404).send({ status: false, message: "book not found with this book id or it may be deleted 🚫" })
        }
        if (reviewId) {
            if (!validate.isValidObjectId(reviewId)) {
                return res.status(400).send({ status: false, msg: "reviewId is not valid book id please check it 🚫" })
            }
        }
        let bookReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!bookReview) {
            return res.status(404).send({ status: false, message: "review not found with this book id or it may be deleted 🚫" })
        }
        let data = req.body;
        if (!validate.isValidBody(data)) {
            return res.status(400).send({ status: false, message: "please provide what you want  to update 🚫" })
        }
        const { review, reviewedBy, rating } = data;
        if (review) bookReview.review = review;
        if (reviewedBy) bookReview.reviewedBy = reviewedBy;
        if (rating) bookReview.rating = rating
        bookReview.save();
        res.status(200).send({ status: true, message: "updated succesfully ✅", data: bookReview })
    }catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}


//---------------------------------------------------------------------//

const deleteReview = async function (req, res) {

    try {
        const book_id = req.params.bookId;

        const review_Id = req.params.reviewId;

        if (!validate.isValidObjectId(book_id)) {
            return res.status(400).send({ status: false, message: "Invalid BookId 🚫" })
        }

        if (!validate.isValidObjectId(review_Id)) {
            return res.status(400).send({ status: false, message: "Invalid reviewId 🚫" })
        }

        let checkBook = await booksModel.findById(book_id)
        if (!checkBook) {
            return res.status(404).send({ status: false, message: "BookId not found 🚫" })
        }

        let checkReview = await reviewModel.findById(review_Id)
        if (!checkReview) {
            return res.status(404).send({ status: false, message: "reviewId not found 🚫" })
        }

        if (checkBook.isDeleted == true || checkReview.isDeleted == true) {
            return res.status(400).send({ status: false, message: "can not delete review of deleted Book 🚫" })
        }

        const deleteReviewDetails = await reviewModel.findOneAndUpdate({_id: review_Id},{ $set: {isDeleted: true,
            deletedAt: new Date()}},
            {new: true}
        )

        if (deleteReviewDetails) {
            await booksModel.findOneAndUpdate({ _id: book_id }, { $inc: { reviews: -1 } })
        }
        return res.status(200).send({ status: true, message: "Review deleted successfully ✅", data: deleteReviewDetails })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

//--------------------------------------------------------------------//

module.exports = { addReview, updateReview, deleteReview }

//--------------------------------------------------------------------//