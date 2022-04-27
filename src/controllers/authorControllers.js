const authorModel = require("../models/authorModel");

const createAuthor = async function (req, res) {
    //try-statement defines a code-block to run if there is an error or undefined variable then it handle catch-statement to handle the error.
  try {        
    let email = req.body.email;
    //findOne is used to find the single object that matches the given condition given by the frontend.
    let emailId = await authorModel.findOne({ email: email });
    let data = req.body;

    //If emailId is already present in our authorCollection then it will execute else block.
    if (!emailId) {
      let dataCreated = await authorModel.create(data);
      res.status(200).send({ data: dataCreated });
    } else res.status(400).send({ msg: "Bad Request" });
  } catch (err) {
    res.status(500).send({ msg: "error", error: err.message });
  }
};





const newAuthor = async function (req, res){

   let b = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)
   console.log(b)

if(b==false){
  res.send({msg : "Please Enter valid email."})
}else{
  function ValidatePassword(password) 
  {
   if (/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(req.body.password))
    {
      return (true)
    }
     // alert("You have entered an invalid email address!")
      return (false)
  }

  if(ValidatePassword==false){
    res.send({msg : "Password must include atleast one lowercase, one uppercase, one special character, one number."})
  }else{
    let email = req.body.email;
    //findOne is used to find the single object that matches the given condition given by the frontend.
    let emailId = await authorModel.findOne({ email: email });
    let data = req.body;

    //If emailId is already present in our authorCollection then it will execute else block.
    if (!emailId) {
      let dataCreated = await authorModel.create(data);
      res.status(200).send({ data: dataCreated });
    } else res.status(400).send({ msg: "Bad Request" });
  }
}

}




module.exports.createAuthor = createAuthor;
module.exports.newAuthor = newAuthor;