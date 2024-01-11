const user = require('../../Models/User.model');
const mongoose = require('mongoose');
const router = require('express').Router();
const roles = require('../../Utils/constants');
const { verifyToken } = require('../../Utils/tokenFunc');
const Item = require('../../Models/Items.model');
const items = require('../../Utils/items');

async function roleCheck(req, res, next){
    try {
        const decoded = verifyToken(req.cookies.token);
        const users = await user.find();
        (decoded.role=="admin") ? 
        res.status(200).json(users)
         : res.status(401).json({message : 'Access Denied!!'});
    } catch (error) {
        next(error);
    } 
} 

router.get('/admin', async(req, res, next)=> {
    const token = req.cookies.token;
    if(!token) return res.status(401).json({message: 'You need to Login First!!'});
    const decoded = verifyToken(token);
    if(!decoded){
            return res.status(401).json({message: 'Token not Valid!!'});
        }
    else{ 
        roleCheck(req, res, next);
    }
});

router.post('/admin/update', async(req, res, next)=>{
    const {id, role} = req.body;
    const decoded = verifyToken(req.cookies.token);
    const users = await user.find();
    if(!id || !role){
        return res.status(401).json({message: 'Invalid Request!!'});
    }
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(401).json({message: 'Invalid Request!!'});
    }
    const rolesArr = Object.values(roles);
    if(!rolesArr.includes(role)){
        return res.status(401).json({message: 'Invalid Request!!'});
    }
    if(decoded.id==id){
        return res.status(400).json({message: 'Ask another admin'});
    }
    const userRole = await user.findById(id);
    if(role==userRole.role){
        return res.status(200).json({message: 'Already a '+{role}});
    }
    else{
        const newRoleUser = await user.findByIdAndUpdate(id, {role: role}, {new: true, runValidators: true});
        return res.status(200).json({message: 'Role Changed Succesfully!!', users: await user.find()});
    }
});

module.exports = router;