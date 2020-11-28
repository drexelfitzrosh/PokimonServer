const mongoose = require('mongoose')

const PokemonSchema = mongoose.Schema({
    number: {
        type:String,
    },
    abilities:{
        normal: [{
            type:String
        }],
        hidden: [{
            type: String
        }]
    },
    name:{
        type: String
    },
    species:{
        type: String
    },
    eggGroups:[{
        type: String
    }],
    gender:[{
        type: Number
    }],
    height:{
        type: String
    },
    weight:{
        type: String
    },
    family:{
        id:{
            type: Number
        },
        evolutionStage:{
            type: Number
        },
        evolutionLine:[
            {
                type: String
            }
        ]
    },
    starter:{
        type: Boolean
    },
    legendary:{
        type: Boolean
    },
    mythical:{
        type: Boolean
    },
    ultraBeast:{
        type: Boolean
    },
    mega:{
        type: Boolean
    },
    gen:{
        type: Number
    },
    sprite:{
        type: String
    },
    description:{
        type: String
    },


})

module.exports = mongoose.model('Pokemon', PokemonSchema)