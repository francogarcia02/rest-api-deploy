import express, { json } from 'express'
import cors from 'cors'
import { moviesRouter } from './routes/movies.js'
import  {corsMiddleWare}  from './middlewares/corsMiddleWare.js'

//Metodos normales: GET/HEAD/POST
//Metodos complejos: PUT/PATH/DELETE


//Formas de traer archivos json en ESModules

//Menos recomendada
//import fs from 'node:fs'
//const movies = JSON.parse(fs.readFileSync('./movies.json' ,'utf-8'))

//Buena forma (Creando un require)
//import { createRequire } from 'node:module'
//const require = createRequire(import.meta.url)//Crea un require con la informacion de la ruta acual
//const movies = require('./movies.json')

//Mejor forma
//import movies from './movies.json' with {type: 'json'}

const ACCEPTED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:8080' // Cambia esto al origen correcto
    // Agrega más orígenes si es necesario
]

const app = express()
app.use(corsMiddleWare()) //MIDLEWARE que acepta todas las peticiones(a veces no queremos aceptar todas)
app.use(json())
app.disable('x_powered_by')

// Middleware para manejar CORS




app.use((req, res, next) => {
    const origin = req.header('Origin')
    if (ACCEPTED_ORIGINS.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin)
    }
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
    next()
})



//manejar peticiones (RUTAS)
app.get('/', (req, res) => {
    console.log('entraste a /')
    res.send('<h1>Bienvenido</h1>')
    
})

app.use('/movies', moviesRouter)

app.options('/movies/:id', (req, res) => {
    res.sendStatus(200) // Responde con un 200 OK
})
//correr servidor
const port = process.env.PORT ?? 3000

app.listen(port, ()=>{
    console.log('servidor de express corriendo en el puerto: ',port)
})