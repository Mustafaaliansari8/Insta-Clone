const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
  caption :{
    type: String,
    default:""
  },

  imgUrl:{
    type: String,
    required: [true, "imgUrl is required"]
  },
  user:{
    ref: "users",
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "user is required to create a post"]
  }

})


const postModel = mongoose.model("posts", postSchema);

module.exports = postModel;