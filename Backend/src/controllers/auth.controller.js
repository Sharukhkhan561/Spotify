const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');


async function registerUser(req,res){
    const {userName, password,email,role='user'}= req.body

    const isUserAlreadyExists = await userModel.findOne({
        $or:[
            {userName},
            {email}
        ]
    })

    if(isUserAlreadyExists){
        return res.status(409).json({
            message:"User already exists"
        })
    }
    const user = await userModel.create({
        userName,
        password,
        email,
        role
    })

    const token = jwt.sign({
        id:user._id,
        role:user.role
    },process.env.JWT_SECRET)
    
    res.cookie('token',token)

    res.status(201).json({
        message: "user register successfully",
        user:{
            id:user._id,
            userName: user.userName,
            email:user.email,
            role:user.role
        }
    })
}