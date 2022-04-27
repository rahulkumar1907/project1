const authorModel = require("../models/authorModel");

// /^\w+@[a-z_]+?\.[a-z]{2,3}$/
const createAuthor = async function (req, res) {
  try {
    let name = /^[a-zA-Z ]{2,30}$/.test(req.body.firstname);
    if (name == false) {
      res.status(400).send({ msg: "Please Enter valid name." });
    } else {
      let last = /^[a-zA-Z ]{2,30}$/.test(req.body.lastname);
      if (last == false) {
        res.status(400).send({ msg: "Please Enter valid lastname." });
      } else {
        let emailid =  /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(req.body.email);
        if (emailid == false) {
          res.status(400).send({ msg: "Please Enter valid email." });
        } else {
          let pass =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(
              req.body.password
            );
          if (pass == false) {
            res.status(400).send({
              msg: "Password should include atleast one special character, one uppercase, one lowercase, one number and should be mimimum 8 character long",
            });
          } else {
            let data = req.body;
            let dataCreated = await authorModel.create(data);
            res.status(200).send({ data: dataCreated });
          }
        }
      }
    }
  } catch (err) {
    res.status(500).send({ msg: "Server not responding", error: err.message });
  }
};

module.exports.createAuthor = createAuthor;
