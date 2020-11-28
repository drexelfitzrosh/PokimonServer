const { required } = require("joi");

const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
    const token = req.header('auth-token')
    if(!token) return res.status(401).json({errorMsg: 'access denied'})

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next()
    } catch (error) {
        return res.status(400).json({errorMsg: error})
    }
}