const { decode } = require('jsonwebtoken');
const router = require('express').Router();
const {verifyToken} = require('../../Utils/tokenFunc');

router.get('/profile', (req, res)=>{
    const token = req.cookies.token;
    if(!token) return res.status(401).json({message: 'You need to Login First'});
    const decoded = verifyToken(token);
    if(!decoded){
        return res.status(401).json({message: 'Token Not Valid!!'});
    }else{
        return res.status(200).json(decoded);
    }
});


module.exports = router;