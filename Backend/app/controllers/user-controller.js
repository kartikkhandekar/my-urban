const User=require('../models/user-model')
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const {validationResult}=require('express-validator')
const { findOneAndUpdate } = require('../models/review-model')
const userCltr={}

userCltr.register=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body=req.body
    try{
        const salt = await bcryptjs.genSalt() 
        const hashPassword = await bcryptjs.hash(body.password, salt) 
        const user = new User(body)
        user.password = hashPassword
        await user.save() 
        res.status(201).json(user)
    }catch(err){
        res.json({errors:'somthing went wrong'})
    }
}

userCltr.login = async (req, res) => {
    const errors = validationResult(req) 
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()})
    }
    const body = req.body 
    try { 
        const user = await User.findOne({email: body.email }) 
        
        if(user) {
            const isAuth = await bcryptjs.compare(body.password, user.password)
            if(isAuth) {
              
                const tokenData = {
                    id: user._id,
                    role: user.role 
                }
                const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '7d'})
                return res.json({ token: token })
            }
            return res.status(404).json({ errors: 'invalid email / password '})
        }
        res.status(404).json({ errors: 'invalid email / password'})
    } catch(err) {
        res.status(500).json({ errors: 'something went wrong'})
    }
}

userCltr.update=async (req,res)=>{
    const errors = validationResult(req) 
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()})
    }
    try{
        const user=await User.findById(req.user.id)
        const body=req.body
        if( user.role == body.role) {
            const salt=await bcryptjs.genSalt()
            const hash=await bcryptjs.hash(body.password,salt)
            body.password=hash
            const update=await User.findOneAndUpdate({_id:req.user.id},body,{new:true})
            return res.status(200).json(update)
        }
        res.status(400).json({error:'You cannot update this record'})

    }catch(err){
        res.status(500).json({ errors: 'something went wrong'})

    }
}

userCltr.account = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        res.json(user)
    } catch(err) {
        res.status(500).json({ error: 'something went wrong'})
    }
}

module.exports=userCltr