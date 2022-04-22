const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const cors =require('cors')

//Configuracion de rotas
const authRoutes = require('./routes/auth')             //import routes.
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
const uri = 'mongodb://localhost:27017/appLenguajes'
//const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.c9it5.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`
//iniciar el servidor
const PORT = process.env.port || 3001

app.listen(PORT, () => {
    console.log(`Servidor Trabajando: ${PORT}`) //las `` sirven para mezclar con variables los string.
}) 

require('dotenv').config()

mongoose.connect(uri, options)
    .then(() => console.log('Conectado a la BD.'))
    .catch((e) => console.log('error ' + e)
)

//Forma de capturar el body en las petciones.
app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())              //Mandamos la info en formato jason.
app.use(cors(corsOptions))
app.get('/api/user', authRoutes)        //para registrar el usuario.
app.use('/api/dashboard', verifyToken, dashboardRoutes)
// route del middleware.
app.get('/', (req, res) => {
    res.json({
        estado: true,
        mensaje: 'Works!'
    })
})