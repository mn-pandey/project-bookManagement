const userModel = require("../models/userModel")
const validate = require("../validation/validation")
const jwt = require("jsonwebtoken")


//--------------------------------------------------------------------//

const registerUser = async function (req, res) {
    try {
        let data = req.body
        let { title, name, phone, email, password, address } = data

        if (!validate.isValidBody(data)) {
            return res.status(400).send({ status: false, message: "Please provide data for registration 🛑" });
        }

        if (!validate.isValid(title)) {
            return res.status(400).send({ status: false, message: "Please provide title field 🛑" });
        }
        if(title){
            if(!( ["Mr", "Mrs", "Miss"].includes(title))) {
              return res.status(400).send({ Status: false, message: "Please provide valid title 🛑" })
            }
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
            return res.status(400).send({ status: false, message: "Please provide a valid phone number 🛑" })
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
        let size = password.length
        if (size < 8 || size > 15) {
            return res.status(400).send({ status: false, message: "Please provide password with minimum or equal to 8 and maximum or equal to 15 characters 🛑" });;
        }

        if (!validate.isValid(address)) {
            return res.status(400).send({ status: false, message: "Please provide address 🛑" });
        }

        let registration = { title, name, phone, email, password, address }

        const userData = await userModel.create(registration);
        return res.status(201).send({ status: true, message: "Registration Successful ✅", data: userData });

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

//--------------------------------------------------------------------//

const loginUser = async function (req, res) {
    try {
        let data = req.body
        if (!validate.isValidBody(data))
            return res.status(400).send({ status: false, message: " Provide your login credentials 🛑" })

        if (!validate.isValid(data.email))
            return res.status(400).send({ status: false, Message: "Please provide your Email 🛑" })

        if (!validate.isValid(data.password))
            return res.status(400).send({ status: false, message: "Please provide your Password 🛑" })

        const user = await userModel.findOne ({ email: data.email, password: data.password })

        if (!user) return res.status(400).send({ status: false, message: "Invalid login credentials 🛑" });

        const token = jwt.sign({
            userId: user._id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 1000,
        }, "Project_3_BooksManagement")

        res.status(200).send({ status: true, message: "Login Sucsessful ✅", data: token });

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


//--------------------------------------------------------------------//


module.exports = { registerUser, loginUser }


//--------------------------------------------------------------------//
