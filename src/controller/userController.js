const userModel = require("../models/userModel")
const validate = require("../validation/validation")


const createUser = async function (req, res){
    try{
        let data = req.body
        let { title, name, phone, email, password, address } = data
        
        if (!validate.isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Please provide data for registration 🛑" });
        }

        if (!validate.isValid(title)) {
            return res.status(400).send({ status: false, message: "Please provide title field 🛑" });
        }

        if (!validate.isValid(name)) {
            return res.status(400).send({ status: false, message: "Please provide name field 🛑" });
        }

        if (!validate.alphabetTestOfString(name)) {
            return res.status(400).send({ status: false, message: "You'll not be able to use special character or number in name 🛑" });
        }

        if (!validate.isValid(phone)) {
            return res.status(400).send({ status: false, message: "Please provide phone number 🛑" });
        }
        if (!validate.isValidMobileNum(phone)) {
            return res.status(400).send({ status: false, message: 'Please provide a valid phone number 🛑' })
        }
        
        if (phone) {
            let checkphone = await userModel.findOne({ phone: phone })

            if (checkphone) {
                return res.status(400).send({ Status: false, message: "Please provide another phone number, this number has been used 🛑" })
            }
        }

        if (!validate.isValid(email)) {
            return res.status(400).send({ status: false, message: "Please provide Email id 🛑" });;
        }
        if (!validate.isValidSyntaxOfEmail(email)) {
            return res.status(404).send({ status: false, message: "Please provide a valid Email Id 🛑" });
        }

        if (email) {
            let checkemail = await userModel.findOne({ email: email })

            if (checkemail) {
                return res.status(400).send({ Status: false, message: "Please provide another email, this email has been used 🛑" })
            }
        }

        if (!validate.isValid(password)) {
            return res.status(400).send({ status: false, message: "Please provide password 🛑" });;
        }
        let size = Object.keys(password).length
        if (size <= 8 || size >= 12 ) {
            return res.status(400).send({ status: false, message: "Please provide password with minimum or equal to 8 and maximum or equal to 12 characters 🛑" });;
        }

        if (!validate.isValid(address)) {
            return res.status(400).send({ status: false, message: "Please provide address 🛑" });
        }

        let registration = { title, name, phone, email, password, address }

        const userData = await userModel.create(registration);
        return res.status(201).send({ status: true, message: 'Registration Successful', data: userData });

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}


module.exports = { createUser }