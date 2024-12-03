import express, { json } from 'express'
import { createMoviesRouter } from './routes/movies.js'
import  {corsMiddleWare}  from './middlewares/corsMiddleWare.js'

export const createApp = ({MovieModel}) => {
    const app = express()
    app.use(corsMiddleWare()) 
    app.use(json())
    app.disable('x_powered_by')

    app.get('/', (req, res) => {
        console.log('entraste a /')
        res.send('<h1>Bienvenido</h1>')
        
    })
    app.use('/movies', createMoviesRouter({MovieModel}))

    const port = process.env.PORT ?? 3000
    app.listen(port, ()=>{
        console.log('servidor de express corriendo en el puerto: ',port)
    })
}