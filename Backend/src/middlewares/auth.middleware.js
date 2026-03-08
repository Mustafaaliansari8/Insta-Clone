const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')

async function identifyUser(req, res, next){
   let token = req.cookies.token
  
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
  
    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }
  
    let decoded = null
  
    try{
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    }catch(err){
      return res.status(401).json({
        message: "Invalid Token"
      })
    }

    const user = await userModel.findById(decoded.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = {
      id: user._id,
      username: user.username
    }

    next()
}

module.exports = identifyUser