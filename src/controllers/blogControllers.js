const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');


const createBlog = async function (req, res) {
  try {
    data =req.body
    let author = req.body.authorId;
    let blog = req.body
    // req.body return a object and to change it in array we use Object.keys(blog) ,, that array have length zero
    let arr = Object.keys(blog)
   if (arr.length == 0) return res.status(400).send({ staus: false, msg: "Invalid request. Please provide Details" })
  
   else if (!blog.title) return res.status(400).send({ staus: false, msg: "title is required" })
    else if (!blog.body) return res.status(400).send({ staus: false, msg: "body is required" })
    else if (!blog.authorId) return res.status(400).send({ staus: false, msg: "authorId is required" })
  //  checking json objectId or  key in mongodb 
   
    else if (mongoose.Types.ObjectId.isValid(req.body.authorId) == false) return res.status(400).send({ staus: false, msg: "Author Id is Invalid" })
    else if (!blog.tags) return res.status(400).send({ staus: false, msg: "tags is required" })
    else if (!blog.category) return res.status(400).send({ staus: false, msg: "category is required" })
   
   
    if(req.body.isDeleted === true) {
      req.body.deletedAt = new Date()
    }
    if (req.body.ispublished === true) {
      req.body.publishedAt = new Date()
    }

    
    let Id = await authorModel.findById({ _id: author });

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
        Error: "Server not responding.",
        error: err.message,
      });
  }
};

//------------------------------------------------------------------------------------------//




const getBlog = async function (req, res) {
  try {

    let Category = req.query.category;
    let SubCategory = req.query.subCategory;
    let Id = req.query.authorId;
    let Tags = req.query.tags;
// applying filter on blog already present in mondodb subjected to condition ispublished true and isdeleted false

    if (!Category && !SubCategory && !Id && !Tags){
      let blog = await blogModel.find({ ispublished: true, isDeleted: false });
      return res.status(200).send({ status: true, Data: blog });
    }
// validate author id in mondo Db
    if (Id) {
      if (mongoose.Types.ObjectId.isValid(Id) == false) {
        return res.status(400).send({ status: false, Error: "AuthorId Invalid" });
      }
    }


    let division = await blogModel.find({
      $or: [
        { authorId: Id },
        { category: Category },
        { subCategory: SubCategory },
        { tags: Tags },
      ],
    });


    if (division.length === 0) {
      return res.status(404).send({ Error: "Not Found" })
    }

    if (division.length != 0) {
      var data = division.filter(
        (x) => x.ispublished === true && x.isDeleted === false
      );
    }
    console.log(data)
    if (data.length === 0) {
      return res.status(404).send({ Error: "Blog does not exist" })
    }
    else if (data) {
      return res.status(200).send({ status: true, Data: data });
    }
  }
  catch (err) {
    res
      .status(500)
      .send({
        status: false,
        Error: "Server not responding",
        error: err.message,
      });
  }
};



//-----------------------------------------------------------------------------------------//

const updateBlog = async function (req, res) {
  try {

    let authorLoggedIn = req["authorId"]
    let blogId = req.params.blogId;

    let Body = req.body;


    let arr = Object.keys(Body)

    if (arr.length == 0) return res.status(400).send({ staus: false, Error: "Invalid request. Please provide Details" })
  // using destructing method
    const { title, body, tags, subCategory } = Body;
    let blog = await blogModel
      .findOne({ _id: blogId })
      .select({ _id: 0, authorId: 1, isDeleted: 1 });

    if (blog == null) {
      res.status(404).send({ status: false, Error: "Blog does not exist." });
    }
    else if (blog.isDeleted === true) {
      res.status(404).send({ status: false, Error: "Blog does not exist." });
    }
    else if (authorLoggedIn == blog.authorId) {
      const updateBlogs = await blogModel
        .findOneAndUpdate(
          { _id: blogId },
          {
            title: title,
            body: body,
            $addToSet: { tags: tags, subCategory: subCategory },
            ispublished: Body.ispublished,
          },
          { new: true }
        )
        .populate("authorId");
      if (updateBlogs.ispublished === true) {
        const updateNew = await blogModel.findOneAndUpdate({ _id: updateBlogs._id },
          { $set: { publishedAt: new Date() }, },
          { new: true }
        )
        res.status(200).send({ status: true, Data: updateNew });
      }
      else {
        res.status(200).send({ status: true, Data: updateBlogs });
      }

    } else {
      res.status(401).send({ status: false, Error: "Not authorised" });
    }
  } catch (err) {
    res
      .status(500)
      .send({
        status: false,
        Error: "Server not responding",
        error: err.message,
      });
  }
};






//------------------------------------------------------------------------------------------//

const deleteBlog = async function (req, res) {
  try {


    let authorLoggedIn = req["authorId"]

    let blogId = req.params.blogId;



    const isValidObjectId = function (objectId) {
      return mongoose.Types.ObjectId.isValid(objectId)
    }

    if (isValidObjectId(blogId) == false) {
      res.status(400).send({ Error: "Please Provide valid Blog Id." });
    } else {
      let blog = await blogModel
        .findOne({ _id: blogId, isDeleted: false })
        .select({ authorId: 1, _id: 0 });

      if (blog == null) {
        res.status(404).send({ status: false, Error: "Blog does not exist." });
      }
      else if (authorLoggedIn == blog.authorId) {

        const deleteBlogs = await blogModel
          .findOneAndUpdate(
            { _id: req.params.blogId },
            { isDeleted: true, $set: { deletedAt: new Date() }, },
            { new: true }
          )
          .populate("authorId");
        res.status(200).send({ status: true, Data: deleteBlogs });
      } else {
        res.status(401).send({ status: false, Error: "Not authorised" });
      }
    }
  } catch (err) {
    res
      .status(500)
      .send({
        status: false,
        Error: "Server not responding",
        error: err.message,
      });
  }
};

//------------------------------------------------------------------------------------------//



const deleteBlog1 = async function (req, res) {
  try {

    let authorLoggedIn = req["authorId"]

    let Category = req.query.category;
    let SubCategory = req.query.subCategory;
    let Id = req.query.authorId;
    let Tags = req.query.tags;

    let division = await blogModel.find({
      $or: [
        { authorId: Id },
        { category: Category },
        { subCategory: SubCategory },
        { tags: Tags },
      ],
      isDeleted: false,
    })


    if (division.length == 0) {
      res.status(404).send({ status: false, Error: "Blog does not exist!" });
    } else {
      let NotAuth = []
      let Deleted = []

      for (let i = 0; i < division.length; i++) {

        if (authorLoggedIn != division[i].authorId) {



          NotAuth.push(division[i])

        } else {
          var deleteBlogs = await blogModel.updateOne(
            { _id: division[i]._id },
            { $set: { isDeleted: true, $set: { deletedAt: new Date() }, } },

            { new: true }
          );
          Deleted.push(deleteBlogs)
        }
      }

      if (Deleted.length == 0) {
        res.status(401).send({ status: false, Error: "Not authorised!" });
      } else {
        return res.status(200).send({ status: true, Data: Deleted });
      }
    }
  }
  catch (err) {
    res
      .status(500)
      .send({
        status: false,
        Error: "Server not responding",
        error: err.message,
      });
  }
}




//------------------------------------------------------------------------------------------//

module.exports.createBlog = createBlog;
module.exports.getBlog = getBlog;
module.exports.updateBlog = updateBlog;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteBlog1 = deleteBlog1;













 