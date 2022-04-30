const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");




const createAuthor = async function (req, res) {
  try {

let name = /^[a-zA-Z ]{2,30}$/.test(req.body.firstname);
let last = /^[a-zA-Z ]{2,30}$/.test(req.body.lastname);
let emailId =  /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(req.body.email);
let password =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(req.body.password);

let blog = await authorModel.findOne({ email:req.body.email });
if(req.body.firstname===undefined){
res.status(400).send({msg:"Bad Request"})
}
else if(!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password){
res.status(400).send({msg:"Input field missing"})
}
else if (name == false){
  res.status(400).send({ msg: "Please Enter name." });
    }

else if(last == false){
  res.status(400).send({ msg: "Please Enter valid lastname." });
}

else if(emailId == false){
 res.status(400).send({ msg: "Please Enter valid email." });
}
else if(password == false){
  res.status(400).send({
    msg: "Password should include atleast one special character, one uppercase, one lowercase, one number and should be mimimum 8 character long",
  });
}
else if(!blog){
  let data = req.body;
  let dataCreated = await authorModel.create(data);
  res.status(200).send({ data: dataCreated });
}
else if(blog){
  res.status(409).send({msg:"This email already exist"})
}
  }catch (err) {
    res.status(500).send({ msg: "Server not responding", error: err.message });
  }
}




const loginAuthor = async function (req, res) {
  let email1 = req.body.email;
  let password1 = req.body.password;

  if (!email1) {
    res
      .status(400)
      .send({ status: false, msg: "Please enter an email address." });
   }else if (!password1) {
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

      let token = jwt.sign(
        {
          authorId: author._id.toString(),
          batch: "uranium",
          organisation: "FunctionUp",
        },
        "project1-uranium"
      );
      res.setHeader("x-api-key", token);
      res.status(200).send({ status: true, data: token });
    }
};




// const createAuthor = async function (req, res) {
//   try {
//     let name = /^[a-zA-Z ]{2,30}$/.test(req.body.firstname);
//     if (name == false) {
//       res.status(400).send({ msg: "Please Enter valid name." });
//     } else {
//       let last = /^[a-zA-Z ]{2,30}$/.test(req.body.lastname);
//       if (last == false) {
//         res.status(400).send({ msg: "Please Enter valid lastname." });
//       } else {
//         let emailId =  /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(req.body.email);
//         if (emailId == false) {
//           res.status(400).send({ msg: "Please Enter valid email." });
//         } else {
//           let password =
//             /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(
//               req.body.password
//             );
//           if (password == false) {
//             res.status(400).send({
//               msg: "Password should include atleast one special character, one uppercase, one lowercase, one number and should be mimimum 8 character long",
//             });
//           } else {
//             let data = req.body;
//             let dataCreated = await authorModel.create(data);
//             res.status(200).send({ data: dataCreated });
//           }
//         }
//       }
//     }
//   } catch (err) {
//     res.status(500).send({ msg: "Server not responding", error: err.message });
//   }
// };





// const createAuthor = async function (req, res) {
//   try {
//     let fname = req.body.firstname;
//     let lname = req.body.lastname;
//     let email1 = req.body.email;
//     let password1 = req.body.password;

//     if (fname == 0) {
//       res.status(400).send({ status: false, msg: "Name is required." });
//     } else {
//       let name = /^[a-zA-Z ]{2,30}$/.test(req.body.firstname);
//       if (name == false) {
//         res.status(400).send({ status: false, msg: "Pleae Enter valid name." });
//       } else if (lname == 0) {
//         res.status(400).send({ status: false, msg: "Lastname is required." });
//       } else {
//         let last = /^[a-zA-Z ]{2,30}$/.test(lname);
//         if (last == false) {
//           res.status(400).send({ status: false, msg: "Please Enter valid lastname." });
//         } else if (email1 == 0) {
//           res.status(400).send({ status: false, msg: "email is required." });
//         } else {
//           let emailId = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email1);
//           if (emailId == false) {
//             res.status(400).send({ status: false, msg: "Please Enter valid email." });
//           } else if (password1 == 0) {
//             res.status(400).send({ status: false, msg: "Please create password." });
//           } else {
//             let password =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(password1);
//             if (password == false) {res.status(400).send({ status: false, msg: "Incorrect password" });
//             } else {
//               let data = req.body;
//               let dataCreated = await authorModel.create(data);
//               res.status(200).send({ data: dataCreated });
//             }
//           }
//         }
//       }
//     }
//   } catch (err) {
//     res.status(500).send({
//       status: false,
//       msg: "Server not responding",
//       error: err.message});
//     }
// }


module.exports.createAuthor = createAuthor;
module.exports.loginAuthor = loginAuthor;

//let email2= authorModel.find({email:req.body.email})
//                if(emai.length!=0){
//                  res.send({status:false , msg:"email already exist"})
//                }
