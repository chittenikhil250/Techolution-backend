const items = require('../Models/Items.model');
const { verifyToken } = require('../Utils/tokenFunc');
const router = require('express').Router();


router.get('/items', async(req, res, next)=>{
    const role = verifyToken(req.cookies.token).role;
    if(role!='admin'){
        return res.status(401).json({message: 'Not Authorized'});
    }
    const item = await items.find();
    return res.status(200).json(item)
});


module.exports=router;