const jwt = require('jsonwebtoken')
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

    req.user = decoded

    next()
}

module.exports = identifyUser