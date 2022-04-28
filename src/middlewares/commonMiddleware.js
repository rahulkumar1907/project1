

const jwt = require("jsonwebtoken");
const validateToken = function (req, res, next) {


  let token = req.headers["x-Api-key"] || req.headers["x-api-key"];
  if (!token) {
    return res.send({ status: false, msg: "token must be present" });
  }
  try {
    jwt.verify(token, "project1-uranium");
  } catch (error) {
    return res.send({ status: false, msg: "token is invalid" });
  }


  let decodedtoken = jwt.verify(token, "project1-uranium");
  let authorLoggedIn = decodedtoken.authorId;
  let authorId = req.query.authorId;
  if (authorLoggedIn != authorId) {
    return res.send({ status: false, data: "Author Id doesnot exist" });
  }
  next();
};
module.exports.validateToken = validateToken;
