const mongoose = require('mongoose')

const UserPokemonSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    pokemon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pokemon'
    },
})

module.exports = mongoose.model('UserPokemon', UserPokemonSchema)