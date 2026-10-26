const userModel = require('../models/user.model');


async function registerUser(req,res){
    const {userName, password,email,role='user'}= req.body
}