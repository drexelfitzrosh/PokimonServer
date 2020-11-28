const express = require('express')
const Pokemon = require('../models/Pokemon')
const User = require('../models/User')
const UserPokemon = require('../Models/UserPokemon')
const auth = require('../utils/auth')
const {cloudinary} = require('../utils/cloudinary')
const axios = require('axios');


const router =express.Router()


router.post('/', async (req, res)=> {
    try {
        const {item, limit} = req.body
        const pok = async(num)=>{
            const pokemon = await axios.get(`https://pokeapi.glitch.me/v1/pokemon/${num}`)
            return pokemon
        }
        const getAll = async()=>{
            const pokemons = []
            for (let i = 1; i<100;i++){
                pokemons.push(pok(i))
            }
            return Promise.all(pokemons)
        }
        const fuck = await getAll()
        let allPokemon = []
        for (let i =0;i<fuck.length;i++){
            allPokemon.push(fuck[i].data)
        }

        const savePokemon = async(data)=>{
            const pokemon = new Pokemon(data)
            const res = await pokemon.save()
            console.log(res)
            return res
        }
        const saveAll = async(list)=>{
            const res = []
            for (let i = 1; i<list.length;i++){
                res.push(savePokemon(list[i][0]))
            }
            return Promise.all(res)
        }

        const response = await saveAll(allPokemon)
        
        return res.send(response)
    } catch (error) {
        console.error(error)
        return res.json({errorMsg: error})
    }
})

//add pokemon to user
router.post('/user/add', auth, async (req, res)=>{
    try {
        const field = {
            pokemon: req.body.pokemonId,
            user: req.user._id
        }

        const userPokemon = new UserPokemon(field)
        const data = await userPokemon.save()
        const user = await User.findById(req.user._id)
        if(!user){
            return res.json({errorMsg: 'no user'})
        }
        user.ownedPokemon.push(data)
        await user.save()
        //leveling
        const {level, experience} = user
        const reactLevel = level * 100
        const experienceGained = experience + 20
        console.log(reactLevel, experienceGained)
        const newLevel = reactLevel < experienceGained? level+1 : level
        await User.updateOne({_id: req.user._id}, {
            experience: experienceGained,
            level: newLevel
        })

        return res.json({msg: 'Sucessful', levelUp: reactLevel < experienceGained? `level up to ${newLevel}`: null})        
    } catch (error) {
        console.error(error)
        return res.json({errorMsg: error})
    }
})

//get all shop pokemon
router.get('/all', auth, async (req, res)=>{
    try {
        const data = await Pokemon.find()
        return res.json(data)        
    } catch (error) {
        console.error(error)
        return res.json({errorMsg: error})
    }
})

//get all user pokemon
router.get('/user/pokemon', auth, async (req, res)=>{
    try {
        const data = await UserPokemon.find({user: req.user._id})
        const getPokemon = async(id)=>{
            const pokemon = await Pokemon.findById(id)
            return pokemon
        }
        const getAll = async(list)=>{
            const res = []
            for (let i = 1; i<list.length;i++){
                res.push(getPokemon(list[i].pokemon))
            }
            return Promise.all(res)
        }

        const response = await getAll(data)
        return res.json(response)        
    } catch (error) {
        console.error(error)
        return res.json({errorMsg: error})
    }
})


// router.delete('/delete/:postId', auth, async (req, res)=>{
//     try {
//         const post = await Post.remove({_id: req.params.postId})
//         return res.json(post)
//     } catch (error) {
//         console.error(error)
//         return res.json({errorMsg: error})
//     }
// })

// router.get('/:postId',auth, async (req, res)=>{
//     try {
//         const post = await Post.findById(req.params.postId)
//         return res.json(post)
//     } catch (error) {
//         console.error(error)
//         return res.json({errorMsg: error})
//     }
// })

// router.post('/create', auth, async (req, res)=>{
//     try {
//         let imgUrl = ''
//         if (req.body.image){
//             const uploadResponsone = await cloudinary.uploader.upload(req.body.image,{
//                 upload_preset:'ml_default'
//             })
//             imgUrl = uploadResponsone.url
//         }
//         const field = {
//             title: req.body.title,
//             image: imgUrl,
//             creator: req.user._id
//         }

//         const post = new Post(field)
//         const data = await post.save()
//         const user = await User.findById(req.user._id)
//         if(!user){
//             return res.json({errorMsg: 'no user'})
//         }
//         user.createdPost.push(data)
//         await user.save()
//         return res.json(data)        
//     } catch (error) {
//         console.error(error)
//         return res.json({errorMsg: error})
//     }
// })

module.exports = router