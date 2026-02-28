const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [ true, "Username is required"],
        unique: [ true, "Username already exists"]
    },
        email: {
            type: String,
            required: [ true, "Email is required"],
            unique: [ true, "Email already exists"]
        },
        password: {
          type: String,
          required: [ true, "Password is required"]
        },
        bio : String,
        profileImage:{
          type: String,
          default: "https://ik.imagekit.io/SazidPasha87/instagram-default-user-profile-pic-flip-flops-v0-g983oflfeg4d12.jpg?updatedAt=1770910988621"
        }
        
    });


    const userModel = mongoose.model("users", userSchema);

    module.exports = userModel;