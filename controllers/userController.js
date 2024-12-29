const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const dotenv = require("dotenv").config();

//@dec register
//@route POST /api/user/register
//@access public
const register = asyncHandler(async(req, res) => {
    const {username, email, password} = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const userAvaliable = await User.findOne({ email });
    if(userAvaliable){
        res.status(400);
        throw new Error("User already Registered");
    }

    //Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    console.log(`User created ${user}`);
    if(user){
        res.status(200).json({_id: user.id, email: user.email});
    }else{
        res.status(400);
        throw new Error("User data was not valid"); 
    }

    res.json({message: "Register the user"});
});

//@dec login
//@route POST /api/user/login
//@access public
const login = asyncHandler(async(req,res) => {
    const {email, password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const user = await User.findOne({email});
    //compare passwoed with hashed password
    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
            },
        },
        process.env.ACCESS_TOKEN_SECERT,
        { expiresIn: "30m"}
        );
        res.status(200).json({ accessToken});
    }else{
        res.status(401);
        throw new Error("email or password is not valid");
    }
});

//@dec current
//@route POST /api/user/current
//@access private
const current = asyncHandler(async(req,res)=>{
    res.json(req.user);
}); 

module.exports = {register, login, current};