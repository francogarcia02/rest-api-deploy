import { Router } from "express";
import { MovieController } from "../controllers/movies.js";

export const createMoviesRouter = ({MovieModel}) =>{
    const moviesRouter = Router()

    const movieControler = new MovieController({movieModel: MovieModel})

    moviesRouter.get('/', movieControler.getAll)

    moviesRouter.get('/:id', movieControler.getById)

    moviesRouter.post('/', movieControler.create)

    moviesRouter.delete('/:id', movieControler.delete)

    moviesRouter.patch('/:id', movieControler.update)
    
    return moviesRouter
}