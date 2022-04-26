const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorControllers")
const blogController = require("../controllers/blogControllers")

router.post("/authors",authorController.createAuthor)
router.post("/blogs",blogController.createBlog)


router.get("/blogs",blogController.getBlog)
router.get("/blogs1",blogController.getBlog1)
module.exports = router;