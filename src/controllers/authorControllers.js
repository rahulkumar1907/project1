const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");




const createAuthor = async function (req, res) {
  try {
    let title = req.body.title
    let name = /^[a-zA-Z ]{2,30}$/.test(req.body.firstname);
    let last = /^[a-zA-Z ]{2,30}$/.test(req.body.lastname);
    let emailId = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(req.body.email);
    let password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(req.body.password);
//  if complete input key not present and require true like as firstname ,tag,category or complete object
    let blog = await authorModel.findOne({ email: req.body.email });
    if (req.body.firstname === undefined || req.body.lastname === undefined || req.body.email === undefined || req.body.password === undefined) {
      res.status(400).send({ msg: "Invalid request !! Please provide details" })
    }
    // if empty string in firstname like as "firstname": ""

    else if (!req.body.firstname) {
      res.status(400).send({ msg: "Firstname missing" })
    }
    else if (!req.body.lastname) {
      res.status(400).send({ msg: "Lastname missing" })
    }
    // checking enum key value for invalid enum
    else if (!["Mr", "Mrs", "Miss"].includes(title)) {
      return res.status(400).send({
        status: false,
        msg: "Title Must be of these values [Mr, Mrs, Miss] ",
      });
    }


    else if (!req.body.email) {
      res.status(400).send({ msg: "Email Id missing" })
    }
    else if (!req.body.password) {
      res.status(400).send({ msg: "Password missing" })

    }
    else if (name == false) {
      res.status(400).send({ msg: "Please Enter valid name." });
    }

    else if (last == false) {
      res.status(400).send({ msg: "Please Enter valid lastname." });
    }

    else if (emailId == false) {
      res.status(400).send({ msg: "Please Enter valid email." });
    }
    else if (password == false) {
      res.status(400).send({
        msg: "Password should include atleast one special character, one uppercase, one lowercase, one number and should be mimimum 8 character long",
      });
    }
    else if (!blog) {
      let data = req.body;
      let dataCreated = await authorModel.create(data);
      res.status(201).send({ data: dataCreated });
    }
    else if (blog) {
      res.status(409).send({ msg: "This email already exist" })
    }
  } catch (err) {
    res.status(500).send({ msg: "Server not responding", error: err.message });
  }
}




const loginAuthor = async function (req, res) {
  let email1 = req.body.email;
  let password1 = req.body.password;
//  can directly check body key value by taking key name
  if (!email1) {
    res
      .status(400)
      .send({ status: false, msg: "Please enter an email address." });
  } else if (!password1) {
    res.status(400).send({ status: false, msg: "Please enter Password." });
  } else {
    let author = await authorModel.findOne({
      email: email1,
      password: password1,
    });
    if (!author)
      return res.status(400).send({
        status: false,
        msg: "Email or the Password is incorrect.",
      });
//  toekn creation and expiration of jwt token
    let token = jwt.sign(
      // user can see this information
      {
        authorId: author._id.toString(),
        batch: "uranium",
        organisation: "FunctionUp",
      },
      // setting secret key
      "project1-uranium",
      { expiresIn: "4h" }
    );
    //  set token in header
    res.setHeader("x-api-key", token);
    res.status(200).send({ status: true, data: token });
  }
};



module.exports = { createAuthor, loginAuthor }




































