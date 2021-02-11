const jwt = require("jsonwebtoken");
const User = require("../mongo/models/users");

const auth = async(req, res, next) => {
    try{
        const token = req.headers("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, "secrettoken");
        const user = await User.findOne({_id : decoded._id, "tokens.token" : token});

        if(!user){
            throw new Error("Please authenticate");
        }

        req.token = token;
        req.user = user;
        next();

    }catch(error){
        res.status(401).send({error : "Please authenticate"})
    }
}

module.exports = auth;