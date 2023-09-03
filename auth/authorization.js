const bcrypt = require('bcrypt');
const User = require('../models/User');
require('dotenv').config();
const jwt = require('jsonwebtoken')

//signup controller
exports.signup = async(req,res) => {

    try {
        const {name, email, password, role} = req.body;

        if(!name || !email || !password || !role){
            res.status(400).json({
            success: false,
            message: 'All fields are requirred'
        })
    }

    const oldUser = await User.findOne({email});
    if(oldUser){
        res.status(400).json({
            success:false,
            message:'User already exist'
        })
    }

    //secure password
    let hashedPassword
    try {
        hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
        res.status(500).json({
            success:false,
            message: 'error in hashing password'
        })
    }

    const user = User.create({
        name,
        email,
        password:hashedPassword,
        role
    })

    res.status(200).json({
        success:true,
        message:"user created successfully"
    })
    } catch (error) {
        res.status(400).json({
            success:false,
            message: "user is not created, please try again later"
        })
        console.log(error.message);
    }
}

//login controller
exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if anything is missing
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please enter email and password',
        });
      }
  
      // Check for registered user
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'User is not registered',
        });
      }
  
      // Compare hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (passwordMatch) {
        const payload = {
          email: user.email,
          id: user._id,
          role: user.role,
        };
  
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: '2h',
        });
  
        const options = {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        };
  
       // user = user.toObject();
        user.token = token;
        user.password = undefined;
  
        console.log(token, options);

        res.cookie('token', token, options).json({
          success: true,
          token,
          user,
          message: 'User logged in successfully',
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Password does not match',
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        success: false,
        message: 'Log in error, please try again later',
      });
    }
  };
  

 