const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name: {
        type:String,
        required:true,
        min: 6,
        max: 34
    },
    email: {
        type:String,
        required:true
    },
    password:{
        type: String,
        required: true,
        min:6
    },
    level:{
        type: Number,
        required: true,
    },
    experience:{
        type: Number,
        required: true,
    },
    ownedPokemon: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserPokemon'
        }
    ],
})

module.exports = mongoose.model('User', UserSchema)