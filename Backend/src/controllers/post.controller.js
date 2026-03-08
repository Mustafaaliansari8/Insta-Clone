const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const likeModel = require("../models/like.model");
const upload = multer({ storage: multer.memoryStorage() });

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function createPostController(req, res) {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "Error uploading file: " + err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    try {
      const file = await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), "file"),
        fileName: "Test",
        folder: "cohort-2-insta-clone-posts",
      });

      const post = await postModel.create({
        caption: req.body.caption,
        imgUrl: file.url,
        user: req.user.id,
      });

      res.status(201).json({
        message: "Post created successfully",
        post,
      });
    } catch (err) {
      res.status(500).json({ message: "Error creating post: " + err.message });
    }
  });
}

async function getPostController(req, res) {
  const userId = req.user.id;

  const posts = await postModel.find({ user: userId });

  res.status(200).json({
    message: "Posts fetched successfully",
    posts,
  });
}

async function getPostDetails(req, res) {
  const userId = req.user.id;

  console.log("Searching for posts with user ID:", userId);

  const posts = await postModel
    .find({ user: userId })
    .populate("user", "username profileImage");

  console.log("Found posts:", posts);

  if (!posts || posts.length === 0) {
    return res.status(404).json({
      message: "No posts found for this user.",
      searchedUserId: userId,
    });
  }

  return res.status(200).json({
    message: "Posts Fetched Successfully.",
    posts,
  });
}

async function likePostController(req, res) {
  const username = req.user.username;
  const postId = req.params.postId.trim();

  const post = await postModel.findById(postId);

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  const existingLike = await likeModel.findOne({
    post: postId,
    user: username,
  });

  if (existingLike) {
    return res.status(400).json({
      message: "You already liked this post",
    });
  }

  const like = await likeModel.create({
    post: postId,
    user: username,
  });

  res.status(200).json({
    message: "Post liked successfully",
    like
  });
}

module.exports = {
  createPostController,
  getPostController,
  getPostDetails,
  likePostController,
};
