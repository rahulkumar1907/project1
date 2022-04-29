const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");
const jwt = require("jsonwebtoken");

const createBlog = async function (req, res) {
  //try-statement defines a code-block to run if there is an error or undefined variable then it handle catch-statement to handle the error.
  try {
    let data = req.body;
    let author = req.body.authorId;
    //console.log(author)

    //findById is used to find the single author _id, that matches the given id, given by the frontend.
    let Id = await authorModel.findById({ _id: author });
    //console.log(Id)
    if (Id) {
      let dataCreated = await blogModel.create(data);
      res.status(201).send({ status: true, data: dataCreated });
    } else {
      res.status(400).send({ status: false, msg: "Author does not exist!" });
    }
  } catch (err) {
    res
      .status(500)
      .send({
        status: false,
        msg: "Server not responding.",
        error: err.message,
      });
  }
};

//------------------------------------------------------------------------------------------//




const getBlog = async function (req, res) {


  let paramCat = req.query.category;
  let paramSub = req.query.subCategory;
  let paramId = req.query.authorId;
  let paramTag = req.query.tags;



  if(!paramCat && !paramSub && !paramId && !paramTag){
    let blog = await blogModel.find({ ispublished: true, isDeleted: false });
  return res.status(200).send({status:true, msg: blog });
  }

  let division = await blogModel.find({
    $or: [
      { authorId: paramId },
      { category: paramCat },
      { subCategory: paramSub },
      { tags: paramTag },
    ],
  });

if(division.length===0){
return  res.send({msg:"incorrect input feild"})
}

if (division.length != 0) {
  var data = division.filter(
    (x) => x.ispublished === true && x.isDeleted === false
  );
}
console.log(data)
 if(data.length===0){
    return res.status(400).send({msg:"nothing exist"})
    }
     else if (data) {
    return  res.status(200).send({status:true, msg: data });
     }
}






// const getBlog = async function (req, res) {
//   try {
//     let Category = req.query.category;
//     let SubCategory = req.query.subCategory;
//     let Id = req.query.authorId;
//     let Tags = req.query.tags;

//     let division = await blogModel.find({
//       $or: [
//         { authorId: Id },
//         { category: Category },
//         { subCategory: SubCategory },
//         { tags: Tags },
//       ],
//     });

//     if (division.length != 0) {
//       let data = division.filter(
//         (x) => x.ispublished === true && x.isDeleted === false
//       );

//       if (data) {
//         res.status(200).send({ status: true, msg: data });
//       } else {
//         res.status(404).send({ status: false, msg: "Blog does not exist!" });
//       }
//     } else {
//       let blog = await blogModel
//         .find({ ispublished: true, isDeleted: false })
//         .populate(authorId);
//       // console.log(blog)
//       res.status(200).send({ status: true, msg: blog });
//     }
//   } catch (err) {
//     res
//       .status(500)
//       .send({
//         status: false,
//         msg: "Server not responding",
//         error: err.message,
//       });
//   }
// };

//-----------------------------------------------------------------------------------------//

const updateBlog = async function (req, res) {
  try {
    let token = req.headers["x-Api-key"] || req.headers["x-api-key"];
    let decodedtoken = jwt.verify(token, "project1-uranium");
    let authorLoggedIn = decodedtoken.authorId;

    let blogId = req.params.blogId;
    let Body = req.body;
    const { title, body, tags, subCategory } = Body;
    let blog = await blogModel
      .findOne({ _id: blogId })
      .select({ _id: 0, authorId: 1 });

    if (blog == null) {
      res.status(400).send({ status: false, msg: "Blog does not exist." }); //blog Id does not exist becouse id is not from blog collection. Here we are checking blog id from path param.
    } else if (authorLoggedIn == blog.authorId) {
      console.log(blog.authorId);
      console.log(authorLoggedIn);

      const updateBlogs = await blogModel
        .findOneAndUpdate(
          { _id: req.params.blogId },
          {
            title: title,
            body: body,
            $addToSet: { tags: tags, subCategory: subCategory },
            ispublished: true,
          },
          { new: true }
        )
        .populate("authorId");
      res.status(200).send({ status: true, date: updateBlogs });
    } else {
      res.status(401).send({ status: false, msg: "Not authorised" });
    }
  } catch (err) {
    res
      .status(500)
      .send({
        status: false,
        msg: "Server not responding",
        error: err.message,
      });
  }
};

//------------------------------------------------------------------------------------------//

const deleteBlog = async function (req, res) {
  try {
    let token = req.headers["x-Api-key"] || req.headers["x-api-key"];
    let decodedtoken = jwt.verify(token, "project1-uranium");
    let authorLoggedIn = decodedtoken.authorId;

    let blogId = req.params.blogId;
    let blog = await blogModel
      .findOne({ _id: blogId, isDeleted: false })
      .select({ _id: 0, authorId: 1 });

    if (blog == null) {
      res.status(400).send({ status: false, msg: "Blog does not exist." }); //blog Id does not exist becouse id is not from blog collection. Here we are checking blog id from path param.
    } else if (authorLoggedIn == blog.authorId) {
      console.log(blog.authorId);
      console.log(authorLoggedIn);
      const deleteBlogs = await blogModel
        .findOneAndUpdate(
          { _id: req.params.blogId },
          { isDeleted: true },
          { new: true }
        )
        .populate("authorId");
      res.status(200).send({ status: true, msg: deleteBlogs });
    } else {
      res.status(401).send({ status: false, msg: "Not authorised" });
    }
  } catch (err) {
    res
      .status(500)
      .send({
        status: false,
        msg: "Server not responding",
        error: err.message,
      });
  }
};

//------------------------------------------------------------------------------------------//

// const deleteBlog1 = async function (req, res) {
//   try {
//     let token = req.headers["x-Api-key"] || req.headers["x-api-key"];
//     let decodedtoken = jwt.verify(token, "project1-uranium");
//     let authorLoggedIn = decodedtoken.authorId;
// console.log(authorLoggedIn)

//     let Category = req.query.category;
//     let SubCategory = req.query.subCategory;
//     let Id = req.query.authorId;
//     let Tags = req.query.tags;

//     let division = await blogModel.find({
//       $or: [
//         { authorId: Id },
//         { category: Category },
//         { subCategory: SubCategory },
//         { tags: Tags },
//       ],
//       isDeleted: false,
//     });
//     //console.log(division)

//     division.forEach(document=>authorLoggedIn == division.authorId)
//         //   res.status(404).send({ status: false, message: "Blog does not exist!" });
//         // } else {
//         //   for (let i = 0; i < division.length; i++) {
//         //     console.log("done2")
//             var deleteBlogs = await blogModel.updateMany(
//               { _id: division[i]._id },
//               { $set: { isDeleted: true } },
//               { new: true }
//             );
//           }
//         }
//         console.log("done3")
//         res.status(200).send({ status: true, msg: deleteBlogs });
//       } else {
//         console.log("done4")
//         res.status(401).send({ status: false, msg: "Not authorised" });
//       }
//     }
//   } catch (err) {
//     res
//       .status(500)
//       .send({
//         status: false,
//         msg: "Server not responding",
//         error: err.message,
//       });
//   }
// };

//------------------------------------------------------------------------------------------//

module.exports.createBlog = createBlog;
module.exports.getBlog = getBlog;
module.exports.updateBlog = updateBlog;
module.exports.deleteBlog = deleteBlog;
//module.exports.deleteBlog1 = deleteBlog1;
