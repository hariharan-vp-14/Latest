const userModel = require('../models/usermodel');
const userService = require('../services/user.services')
const {validationResult} = require('express-validator')
const blackListTokenModel = require('../models/blacklistToken.model')



module.exports.registerUser = async(req,res,next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const{ fullname, email, password, confirmPassword, institution, address, designation, contact, totalNumberPhysical} = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingUser = await userModel.findOne({email});
    if(existingUser){
        return res.status(400).json({message: 'User already exists'});
    }

    const hashPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email,
        password:hashPassword,
        institution,
        address,
        designation,
        contact,
        totalNumberPhysical
    });

    const token = user.generateAuthToken();

    res.cookie('token', token);

    res.status(201).json({token,user});


}

module.exports.loginUser = async(req,res,next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()});
    }
    
    const {email,password} = req.body;

    const user = await userModel.findOne({email}).select('+password');

    if(!user){
        return res.status(401).json({message:'Invalid email or password'});
    }


    const isMatch = await user.comparePassword(password);

    if(!isMatch){
        return res.status(401).json({message:'Invalid email or password'})
    }

    if (user && isMatch) {
  const token = user.generateAuthToken();
  res.cookie('token', token);
  res.status(200).json({ token, user });

  
}
}

module.exports.getUserProfile = async(req,res,next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        res.status(200).json({ token, user: req.user });
    } else {
        const cookie = req.cookies.token;
        res.status(200).json({ cookie, user: req.user });
    }
}


module.exports.logoutUser = async(req,res,next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    await blackListTokenModel.create({token});
    res.status(200).json({message: 'Logged out'});

    
}