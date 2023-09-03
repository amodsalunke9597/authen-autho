const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = async (req, res, next) => {
    try {
        const token = req.body.token;

        if(!token){
            res.status(400).json({
                success: false,
                message: 'no token found'
            })
        }

        //decode token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);

            req.user = decode;
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'invalid token'
            })
        }
        next();
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'something went wrong while decoding token'
        })
    }
}

const isStudent = async(req,res,next) => {
    try {
        if(req.user.role != 'student'){
            res.status(401).json({
                success: false,
                message: 'This route is defined to registered student'
            })
        }
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'User role is not matching'
        })
    }
}

const isAdmin = async(req,res,next) =>{
    try {
        if(req.user.role != 'admin'){
            res.status(401).json({
                success: false,
                message: 'This route is defined to registered admin'
            })
        }
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'User role is not matching'
        })
    }
}

module.exports = {
    isStudent,
    isAdmin,
    auth
  }