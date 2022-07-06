const validator = require("email-validator");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const isValidRequestBody = function (data) {
  return Object.keys(data).length > 0;
};

const isValidMobileNum = function (value) {
  if (!/^[6-9]\d{9}$/.test(value)) {
    return false;
  }
  return true;
};

const isValidSyntaxOfEmail = function (value) {
  if (!validator.validate(value.trim())) {
    return false;
  }
  return true;
};

let alphabetTestOfString = function (value) {
  let regex = /^[A-Za-z ]+$/;
  if (!regex.test(value)) {
    return false;
  }
  return true;
};

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId)
}


//----------------------------------------------//

module.exports = {
  isValid,
  isValidRequestBody,
  isValidSyntaxOfEmail,
  isValidMobileNum,
  alphabetTestOfString,
  isValidObjectId
};