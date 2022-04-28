const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorControllers")
const blogController = require("../controllers/blogControllers")
const middleWare = require("../middlewares/commonMiddleware")

router.post("/authors",authorController.createAuthor)
router.post("/blogs",middleWare.validateToken,blogController.createBlog)

router.get("/blogs",middleWare.validateToken,blogController.getBlog)

router.put("/blogs/:blogId",middleWare.validateToken,blogController.updateBlog)

router.delete("/blogs/:blogId",middleWare.validateToken,blogController.deleteBlog)
router.delete("/blogs",middleWare.validateToken,blogController.deleteBlog1)

router.post("/login", authorController.loginAuthor)


module.exports = router;