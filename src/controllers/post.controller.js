const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function createPostController(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "User is not authorized" });
    }

    const file = await imagekit.files.upload({
      file: await toFile(Buffer.from(req.file.buffer), "file"),
      fileName: "Test",
      folder: "cohort-2-insta-clone-posts",
    });

    const post = await postModel.create({
      caption: req.body.caption,
      imgUrl: file.url,
      user: req.user.id
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating post" });
  }
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

module.exports = {
  createPostController,
  getPostController,
  getPostDetails,
};
