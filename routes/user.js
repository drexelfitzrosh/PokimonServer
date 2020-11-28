const express = require('express')
const User = require('../models/User')
const argon2 = require('argon2')
const Joi = require('joi')
const {registerValidation, loginValidation} = require('../utils/validation')
const jwt = require('jsonwebtoken');
const auth = require('../utils/auth')

const schema = Joi.object({
    name: Joi.string().min(6).max(55).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required()
})

const router =express.Router()

router.post('/register', async (req, res)=>{
    const validation = await registerValidation(req.body)
    if(validation.error){
        return res.status(400).send({errorMsg: validation.message})
    }
    const {name, email, password} = validation.data

    try {
        const existingEmail = await User.findOne({email: email})
        if(existingEmail){
            return res.status(400).send({errorMsg: "email already in use"}) 
        }

        const hashPassword = await argon2.hash(password)
        const user = new User({
            name: name,
            email: email,
            password: hashPassword,
            level: 1,
            experience:0
        })   

        const data = await user.save()
        return res.json({...data._doc, password:null})

    } catch (error) {
        console.error(error)
        res.status(400).send({msg: error})
    }
})

router.post('/login', async (req, res)=>{
    const validation = await loginValidation(req.body)
    console.log('validation', validation)
    if(validation.error){
        return res.status(400).send({errorMsg: validation.message})
    }
    const {email, password} = validation.data

    try {
        const user = await User.findOne({email: email})
        console.log(user)
        if(!user){
            return res.status(400).send({errorMsg: "email does not exist"}) 
        }

        const validatePassword = await argon2.verify(user.password, password)
        if (!validatePassword){
            return res.status(400).send({errorMsg: "wrong password"}) 
        }

        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
        return res.header('auth-token', token).send(token)

    } catch (error) {
        console.error(error)
        res.status(400).send({msg: error})
    }
})

router.post('/logout', auth, async (req, res)=>{

    try {
        const token = jwt.sign({exp:1, data: ''},'')
        return res.header('auth-token', token).json({msg: 'sucessful'})

    } catch (error) {
        console.error(error)
        res.status(400).send({msg: error})
    }
})

module.exports = router