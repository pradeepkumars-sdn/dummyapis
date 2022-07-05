const jwt = require('jsonwebtoken')


module.exports = function(req, res, next){

    var token = req.header("token", token);
    console.log(token)
    if(!token){
        res.status(401).json({message:"Authentication Failed - Token Not Provided"})
    }

    try {
        const decoded = jwt.verify(JSON.parse(token), process.env.SECRETKEY);
        console.log("decoded", decoded)
        console.log("req.user", req.user)

        req.user = decoded.user;
        next();
      } catch (e) {
        console.error(e);
        res.status(500).send({ message: "Invalid Token" });
      
      }

    
}