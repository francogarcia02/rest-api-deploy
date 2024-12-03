import movies from '../movies.json' with {type: 'json'}
import {randomUUID} from 'node:crypto'

export class MovieModel {
    static getAll = async ({ genre }) => {
        let moviesFiltered = movies
        if(genre){
            return moviesFiltered = moviesFiltered.filter(movie => 
                movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
            )
        }
        return moviesFiltered
    }

    static async getById ({id}) {
        const movie = movies.find(mov => mov.id === id)
        return movie
    }

    static async create (input) {
        
        const newMovie = {
            id: randomUUID(),
            ...input
        }

        movies.push(newMovie)
        return newMovie
        
    }

    static async delete ({id}) {
        console.log(id)
        const movieIndex = movies.findIndex(movie => movie.id === id)
        if(movieIndex === -1){
            return false
        }
        movies.slice(movieIndex, 1)
        return true
        
        
    }

    static async update ({id, input}) {
        const movieIndex = movies.findIndex(movie => movie.id === id)
        
        if(movieIndex < 0){
            return false
        }

        const movieUpdate = {
            ...movies[movieIndex],
            ...input
        }
    
        movies[movieIndex] = movieUpdate
        return movieUpdate
    } 
}