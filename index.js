const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const cors =require('cors')

//Configuracion de rutas.
const authRoutes = require('./routes/auth') 
const dashboardRoutes = require('./routes/dashboard')
const verifyToken = require('./routes/validate-token')
const options =     {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200
}
const app = express()
const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.c9it5.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`
const PORT = process.env.port || 3001

require('dotenv').config()

mongoose.connect(uri, options)
    .then(() => console.log('Conectado a la BD.'))
    .catch((e) => console.log('error ' + e)
)

//Forma de capturar el body en las petciones.
app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())
app.use(cors(corsOptions))
app.use('/api/user', authRoutes)        //para registrar el usuario.
app.use('/api/dashboard', verifyToken, dashboardRoutes)
// route del middleware.
app.get('/', (req, res) => {
    res.json({
        estado: true,
        mensaje: 'Works!'
    })
})

app.listen(PORT, () => {
    console.log(`Servidor Trabajando: ${PORT}`) //las `` sirven para mezclar con variables los string.
}) 