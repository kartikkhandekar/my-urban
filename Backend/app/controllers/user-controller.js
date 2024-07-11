const User=require('../models/user-model')
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const {validationResult}=require('express-validator')
const sendOTPEmail=require('../utils/mail')
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
        res.status(404).json({error:'You cannot update this record'})

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


userCltr.forgotPassword=async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const body = req.body
    try {
      const user = await User.findOne({email:body.email});
      if (!user) {
        return res.status(404).json({ message: 'No user found registered with this email' })
      }
      const otp = await sendOTPEmail(body.email,user.username)
      console.log(otp)
      user.resetPasswordToken = otp
      user.resetPasswordExpires = Date.now() + 10 * 60 * 1000
      await user.save()
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }
  

userCltr.resetPassword=async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { email, otp, newPassword } = req.body
    try {
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      if (user.resetPasswordToken !== otp || user.resetPasswordExpires < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired OTP' })
      }
      const salt=await bcryptjs.genSalt()
      const hashedPassword = await bcryptjs.hash(newPassword,salt)
      user.password = hashedPassword
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
      await user.save()
      res.status(200).json({ message: 'Password reset successful' })
    } catch (error) {
        console.log(error)
      res.status(500).json({ message: 'Server error' })
    }
  }

  userCltr.checkEmail=async(req,res)=>{
    const email=req.query.email
    const user=await User.findOne({email:email})
    if(user){
       res.json({'is_email_registered':true})
    }else{
       res.json({'is_email_registered':false})
    }
 }
module.exports=userCltr