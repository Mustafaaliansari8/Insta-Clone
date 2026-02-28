const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require('../models/user.model');
async function loginController (req, res)  {
  const {username, email, password} = req.body

  const user = await userModel.findOne({
    $or: [
      {
        username : username
      },
      {
        email: email
      }]
  })

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    })
  }


  
  

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid password"
    })
  }

  const token = jwt.sign({
    id: user._id,
  },process.env.JWT_SECRET,{expiresIn:"1d"})

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  })

  res.status(200).json({
    message: "User logged in successfully",
    token: token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage
    }
  })
}



async function registerController (req, res)  {
  const {username, email, password, bio, profileImage} = req.body

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Username, email, and password are required"
    })
  }

  const isUserAlreadyExists = await userModel.findOne({
    $or: [
      {username},
      {email}
  ]}
    )

    if (isUserAlreadyExists) {
      return res.status(409).json({
        message: "User already exists" + (isUserAlreadyExists.email == email ? "Email already exists": "Username already exists")
      })
    }

    const hash = await bcrypt.hash(password, 10)

  const user = await userModel.create({
    username,
    email,
    password: hash,
    bio,
    profileImage
  })

  const token = jwt.sign({
    id: user._id,
  },process.env.JWT_SECRET,{expiresIn:"1d"})

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  })

  res.status(201).json({
    message: "User registered successfully",
    token: token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage
    }
  })

    
}

module.exports = {
  loginController,
  registerController
}