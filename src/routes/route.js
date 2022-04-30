const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorControllers")
const blogController = require("../controllers/blogControllers")
const middleWare = require("../middlewares/commonMiddleware")

router.post("/authors",authorController.createAuthor)
router.post("/blogs",middleWare.authentication,blogController.createBlog)

router.get("/blogs",middleWare.authentication,blogController.getBlog)

router.put("/blogs/:blogId",middleWare.authentication,middleWare.authorisation,blogController.updateBlog)

router.delete("/blogs/:blogId",middleWare.authentication,middleWare.authorisation,blogController.deleteBlog)
router.delete("/blogs",middleWare.authentication,middleWare.authorisation,blogController.deleteBlog1)

router.post("/login", authorController.loginAuthor)


module.exports = router;
