const jwt = require("jsonwebtoken");

const tokenChecker = async function (req, res, next) {
  try {
    let token = req.headers["user-login-key"];

    if (!token) {
      return res.status(401).send({ status: false, message: "Missing authentication token in request ⚠️", });
    }

    jwt.verify(token, "Project_3_BooksManagement", function (err, decoded) {
      if (err) {
        return res.status(400).send({ status: false, message: "token invalid ⚠️" });
      }
      else {
        req.userId = decoded.userId;
        return next();
      }
    });

  }
  catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {tokenChecker}
