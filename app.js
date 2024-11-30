const express = require('express')
const crypto = require('node:crypto')
const movies = require('./movies.json')
const cors = require('cors')
const z = require('zod')
const { validateMovie, validatePartialMovie } = require('./schemas/movies.js')

//Metodos normales: GET/HEAD/POST
//Metodos complejos: PUT/PATH/DELETE


const app = express()
app.use(cors()) //MIDLEWARE que acepta todas las peticiones(a veces no queremos aceptar todas)
app.use(express.json())
app.disable('x_powered_by')

// Middleware para manejar CORS

const ACCEPTED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:8080' // Cambia esto al origen correcto
    // Agrega más orígenes si es necesario
]
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

const ACEPTED_ORIGINS = [
    'Origen1',
    'Origen2'
] //origenes que deben ser aceptados para evitar el error de CORS

app.get('/movies', (req, res) => {
    const origin = req.header('origin') //Origen que viene del request
    if(ACEPTED_ORIGINS.includes(origin)){
        res.header('Access-Control-Allow-Origin', origin) // acepta si origin esta en la lista
    }

    res.header('Access-Control-Allow-Origin', '*')

    let moviesFiltered = movies
    const { genre } = req.query
    
    if(genre){
        moviesFiltered = moviesFiltered.filter(movie => 
            movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )
    }

    res.json(moviesFiltered)
})

app.get('/movies/:id', (req, res) => {
    const { id } = req.params
    const movie = movies.find(mov => mov.id === id)
    if(movie){return res.json(movie)}

    res.status(404).send('Pelicula no encontrada')
})

app.post('/movies', (req, res) => {


    const result = validateMovie(req.body)

    const newMovie = {
        id: crypto.randomUUID(),
        ...result.data
    }

    
    if (result.error){
        res.status(400).json({error: result.error})
    }
    console.log(result)
    movies.push(newMovie) //Esto no es REST porque guarda el estado de la app en memoria
    res.status(201).send(newMovie)
    
    
})

app.patch('/movies/:id', (req, res) => {
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)
    const result = validatePartialMovie(req.body)

    if(result.error){
        res.status(400).json({error: JSON.parse(result.error)})
    }

    if(movieIndex < 0){
        res.status(404).send('Pelicula no encontrada')
    }

    const movieUpdate = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = movieUpdate
    res.status(200).json(movieUpdate)
})

app.delete('/movies/:id', (req, res) => {
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id) // Cambiar a findIndex

    if (movieIndex === -1) {
        return res.status(404).send('Pelicula no encontrada') // Agregar return
    }

    movies.splice(movieIndex, 1)

    return res.json({ "message": "Pelicula eliminada" })

})

app.options('/movies/:id', (req, res) => {
    res.sendStatus(200) // Responde con un 200 OK
})
//correr servidor
const port = process.env.PORT ?? 3000

app.listen(port, ()=>{
    console.log('servidor de express corriendo en el puerto: ',port)
})