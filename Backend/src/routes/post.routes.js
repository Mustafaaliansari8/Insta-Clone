const express = require("express");
const postRouter = express.Router()
const {createPostController, getPostController, getPostDetails, likePostController} = require("../controllers/post.controller")
const identifyUser = require("../middlewares/auth.middleware")


postRouter.post("/",identifyUser, createPostController)

postRouter.get("/",identifyUser, getPostController)

postRouter.get("/details/:postId",identifyUser, getPostDetails)

postRouter.post("/like/:postId",identifyUser, likePostController)

module.exports = postRouter;