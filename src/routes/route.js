const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorControllers")
const blogController = require("../controllers/blogControllers")

router.post("/authors",authorController.createAuthor)
router.post("/blogs",blogController.createBlog)
router.post("/authors1",authorController.newAuthor)

router.get("/blogs",blogController.getBlog)

module.exports = router;