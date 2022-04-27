const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorControllers")
const blogController = require("../controllers/blogControllers")

router.post("/authors",authorController.createAuthor)
router.post("/blogs",blogController.createBlog)

router.get("/blogs",blogController.getBlog)

router.put("/blogs/:blogId",blogController.updateBlog)


router.delete("/blogs/:blogId",blogController.deleteBlog)
router.delete("/blogs",blogController.deleteBlog1)
module.exports = router;

