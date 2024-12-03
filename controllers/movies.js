import { MovieModel } from "../models/mysql/movie.js"
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MovieController{
    static async getAll (req, res) {
    
        const { genre } = req.query
        const moviesFiltered = await MovieModel.getAll({genre})
    
        res.json(moviesFiltered)
    }

    static async getById (req, res) {
        const { id } = req.params
        const movie = await MovieModel.getById({id})
        if(movie){
            res.json(movie)
        }
        else{
            res.status(404).send('Pelicula no encontrada')
        }
    
    
        
    }

    static async create (req, res) {
        const result = validateMovie(req.body)
        if (result.error){
            return res.status(404).send(result.error)
        }
    
        const newMovie = await MovieModel.create(result.data)
        res.send(newMovie)
    }

    static async delete (req, res) {
        const { id } = req.params
        const movieIndex = await MovieModel.delete({id})
        if(movieIndex){
            return res.json({ "message": "Pelicula eliminada"})
        }
        return res.json({"message": "Pelicula no encontrada"})
    
    }

    static async update (req, res) {
        const { id } = req.params
        const result = validatePartialMovie(req.body)
    
        if(result.error){
            res.status(400).json({error: JSON.parse(result.error)})
        }
    
        const update = await MovieModel.update({id: id, input: result.data})
        res.status(200).json(update)
    }
}