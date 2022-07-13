const validator = require("email-validator");
const mongoose = require("mongoose");


//--------------------------------------------------------------------//

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const isValidBody = function (data) {
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

const validateDate = function (value){
  let regex =  /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
  if(!regex.test(value)){
    return false;
  }
  return true;
}

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId)
}



//--------------------------------------------------------------------//


module.exports = {
  isValid,
  isValidBody,
  isValidSyntaxOfEmail,
  isValidMobileNum,
  alphabetTestOfString,
  validateDate,
  isValidObjectId
};


//--------------------------------------------------------------------//