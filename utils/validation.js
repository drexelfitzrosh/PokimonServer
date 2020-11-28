const Joi = require('joi')


const registerValidation = async (data) => {
    try {
        const schema = Joi.object({
            name: Joi.string().min(6).max(55).required(),
            email: Joi.string().required().email(),
            password: Joi.string().min(6).required()
        })
        const res = await schema.validateAsync(data)
        return {error: false, data: res}
    } catch (error) {
        return {error: true, message: error.details[0].message}
    }
}

const loginValidation = async (data) => {
    try {
        const schema = Joi.object({
            email: Joi.string().required().email(),
            password: Joi.string().min(6).required()
        })
        const res = await schema.validateAsync(data)
        return {error: false, data: res}
    } catch (error) {
        return {error: true, message: error.details[0].message}
    }
}



module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation