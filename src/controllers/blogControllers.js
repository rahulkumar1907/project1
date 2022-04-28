const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");




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
      res.status(201).send({status:true, data: dataCreated });
    } else {
      res.status(400).send({status:false, msg: "Author does not exist!" });
    }
  } catch (err) {
    res.status(500).send({status:false, msg: "Server not responding.", error: err.message });
  }
};

//----------------------------------------------------------------------//

const getBlog = async function (req, res) {
  try {

    let paramCat = req.query.category;
    let paramSub = req.query.subCategory;
    let paramId = req.query.authorId;
    let paramTag = req.query.tags;

    let division = await blogModel.find({
      $or: [
        { authorId: paramId },
        { category: paramCat },
        { subCategory: paramSub },
        { tags: paramTag },
      ],
    });


    if (division.length != 0) {
      let data = division.filter(
        (x) => x.ispublished === true && x.isDeleted === false
      );

      if (data) {
        res.status(200).send({status:true, msg: data });
      } else {
        res.status(404).send({status:false, msg: "Blog does not exist!" });
      }
    }
    else {
      let blog = await blogModel.find({ ispublished: true, isDeleted: false });
      // console.log(blog)
      res.status(200).send({status:true, msg: blog });
    }
  } catch (err) {
    res.status(500).send({status:false, msg: "Server not responding", error: err.message });
  }
};

//------------------------------------------------------------//


const updateBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let Body = req.body;
    const { title, body, tags, subCategory } = Body;
    let blog = await blogModel.findOne({ _id: blogId });

    if (!blog) {
      return res
        .status(404)
        .send({ status: false, message: "Blog does not exist!" });
    }

    const updateBlogs = await blogModel.findOneAndUpdate(
      { _id: req.params.blogId },
      {
        title: title,
        body: body,
        $addToSet: { tags: tags, subCategory: subCategory },
        ispublished: true,
      },
      { new: true }
    );
    if ((updateBlog.ispublished = true)) {
      updateBlog.ispublished = new Date();
      console.log(updateBlogs);
      res
        .status(200)
        .send({ status: true, date: updateBlogs });
    }
  } catch (err) {
    res.status(500).send({status:false, msg: "Server not responding", error: err.message });
  }
};

//--------------------------------------------------------//

const deleteBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let blog = await blogModel.findOne({ _id: blogId, isDeleted: false });

    if (!blog) {
      res.status(404).send({ status: false, message: "Blog does not exist!" });
    } else {
      const deleteBlogs = await blogModel.findOneAndUpdate(
        { _id: req.params.blogId },
        { isDeleted: true },
        { new: true }
      );
      res.status(200).send({ status: true, msg: deleteBlogs });
    }
  } catch (err) {
    res.status(500).send({status:false, msg: "Server not responding", error: err.message });
  }
};

//--------------------------------------------------------//

const deleteBlog1 = async function (req, res) {
  try {
    let paramCat = req.query.category;
    let paramSub = req.query.subCategory;
    let paramId = req.query.authorId;
    let paramTag = req.query.tags;

    let division = await blogModel.find({
      $or: [
        { authorId: paramId },
        { category: paramCat },
        { subCategory: paramSub },
        { tags: paramTag },
      ], isDeleted: false
    });
    if (division.length == 0) {
      res.status(404).send({ status: false, message: "Blog does not exist!" });
    } else {
      for (let i = 0; i < division.length; i++) {
        var deleteBlogs = await blogModel.updateMany(
          { _id: division[i]._id },
          { $set: { isDeleted: true } },
          { new: true }
        );
      }
      res.status(200).send({ status: true, msg: deleteBlogs });
    }
  } catch (err) {
    res.status(500).send({status:false, msg: "Server not responding", error: err.message });
  }
};

//--------------------------------------------------------//

module.exports.createBlog = createBlog;
module.exports.getBlog = getBlog;
module.exports.updateBlog = updateBlog;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteBlog1 = deleteBlog1;
