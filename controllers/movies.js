
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MovieController{
    constructor({movieModel}) {
        this.movieModel = movieModel
    }

    getAll = async (req, res) => {
    
        const { genre } = req.query
        const moviesFiltered = await this.movieModel.getAll({genre})
    
        res.json(moviesFiltered)
    }

    getById = async (req, res) => {
        const { id } = req.params
        const movie = await this.movieModel.getById({id})
        if(movie){
            res.json(movie)
        }
        else{
            res.status(404).send('Pelicula no encontrada')
        }
    
    
        
    }

    create = async (req, res) => {
        const result = validateMovie(req.body)
        if (result.error){
            return res.status(404).send(result.error)
        }
    
        const newMovie = await this.movieModel.create(result.data)
        res.send(newMovie)
    }

    delete = async (req, res) => {
        const { id } = req.params
        const movieIndex = await MovieModel.delete({id})
        if(movieIndex){
            return res.json({ "message": "Pelicula eliminada"})
        }
        return res.json({"message": "Pelicula no encontrada"})
    
    }

    update = async (req, res) => {
        const { id } = req.params
        const result = validatePartialMovie(req.body)
    
        if(result.error){
            res.status(400).json({error: JSON.parse(result.error)})
        }
    
        const update = await this.movieModel.update({id: id, input: result.data})
        res.status(200).json(update)
    }
}