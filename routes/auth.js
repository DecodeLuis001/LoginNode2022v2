const router = require('express').Router()
const User = require('../models/User')
const Joi = require('@hapi/joi')
//const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//Esquema para el registro.
const schemaRegister = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
})

router.post('/register', async (req, res) => {
    //Validar el usuario.
    const {error} = schemaRegister.validate(req.body)

    if(error){
        return res.status(400).json(
            {error: error.details[0].message}
        )
    }

    //Validamos que el correo ya existe.
    const isEmailExist = await User.findOne({
        email: req.body.email
    })

    if(isEmailExist){
        return res.status(400).json(
            {error: 'Correo ya existe'}
        )
    }

    //Se hace el hash de la contraseña.
    //const salt = await bcrypt.genSalt(10)
    //const password = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })

    try{
        const saveUser = await user.save()
        res.json({
            error: null,
            data: saveUser
        })
    } catch(error) {
        res.status(400).json({error})
    }
})

const schemaLogin = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
})

router.post('/login', async(req, res) => {
    try {
        const {error} = schemaLogin.validate(req.body)
        if(error){
            return res.status(400).json(
                {error: error.details[0].message}
            )
        }

        const user = await User.findOne({
            email: req.body.email
        })

        if( !user ){
            return res.status(400).json({
                error: 'Usuario no encontrado'
            })
        }

    //const validPassword = await bcrypt.compare(req.body.password, user.password)
    if( req.body.password != user.password ){
        return res.status(400).json({
            error: 'Contraseña incorrecta'
        })
    }

        //creacion del token 
        const token = jwt.sign({
            name: user.name,
            id: user._id
        }, process.env.TOKEN_SECRET)

        res.header('auth-token', token).json({
            error: null,
            data: {token}
        })  //se valida que el token sea correcto
    } catch (error) {
        console.log(error)
    }
})

module.exports = router