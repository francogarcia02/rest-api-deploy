import mysql from 'mysql2/promise'

const config = {
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '',
    database: 'moviesdb'
}

const connection = await mysql.createConnection(config)

export class MovieModel {
    static getAll = async ({ genre }) => {
        const [movies] = await connection.query(
            'SELECT BIN_TO_UUID(id) AS id, title, director, year, duration, poster, rate FROM movie'
        )
        if(genre){
            const [genres] = await connection.query(
                'SELECT id, name FROM genre'
            )


            const [movie_genre] = await connection.query(
                'SELECT BIN_TO_UUID(movie_id) AS movie_id, genre_id FROM movie_genre'
            )
            const newArray = movie_genre.map(item => {
                const genreFilter = genres.find(genre=>genre.id == item.genre_id)
                return{
                    ...item,
                    genre_id: genreFilter.name
                }
            })

            let genresPerMovie = []
            let moviesWithGenres = movies.map(movie => {
                newArray.map(item => {
                    if(movie.id == item.movie_id){
                        genresPerMovie.push(item.genre_id)
                    }
                })
                const news = {
                    ...movie,
                    genre: genresPerMovie
                }
                genresPerMovie = []
                return news
            })

            return moviesWithGenres = moviesWithGenres.filter(movie => 
                movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
            )
            
        }

        

        return movies
    }

    static async getById ({id}) {
        const [movies] = await connection.query(
            `SELECT BIN_TO_UUID(id) AS id, title, director, year, duration, poster, rate FROM movie 
            WHERE id = UUID_TO_BIN(?);`,
            [id]
        )

        if(movies.length === 0){
            return null
        }

        return movies[0]
    }

    static async create (input) {
        const {
            genre: genreInput,
            title,
            year,
            director,
            duration,
            rate,
            poster
        } = input
        
        const [uuidResult] = await connection.query(
            'SELECT UUID() uuid;'
        )
        const [{uuid}] = uuidResult
        try {
            const result = await connection.query(
                `INSERT INTO movie (id, title, year, duration, director, poster, rate)
                VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`,
                [ title, year, duration, director, poster, rate]
            );
        } catch (error) {
            //NUNCA mostrarle esta informacion al usuario, puede contener informacion sensible
        }
        
        const [movies] = await connection.query(
            `SELECT BIN_TO_UUID(id) AS id, title, director, year, duration, poster, rate FROM movie
            WHERE id = UUID_TO_BIN(?);`,
            [uuid]
        )
        return movies[0]
    }

    static async delete ({id}) {

        const [result] = await connection.query(
            `DELETE FROM movie WHERE id = UUID_TO_BIN(?);`,
            [id]
        )

        if(result.affectedRows === 0){
            console.log(result)
            return false
        }
        console.log(result)
        return true
    }

    static async update({ id, input }) {
        let movie;
        try {
            const [result] = await connection.query(
                `SELECT * FROM movie WHERE id = UUID_TO_BIN(?);`,
                [id]
            );
            movie = result;
        } catch (error) {
            console.log('Error al buscar la película inicial:', error);
            return false; // Retorna false si no se puede obtener la película
        }
    
        // Verifica si la película existe antes de continuar
        if (!movie || movie.length === 0) {
            console.log('Película no encontrada');
            return 'Película no encontrada';
        }
    
        // Asigna valores por defecto si los campos de input son nulos o indefinidos
        const title = input.title ?? movie[0].title;
        const year = input.year ?? movie[0].year;
        const duration = input.duration ?? movie[0].duration;
        const director = input.director ?? movie[0].director;
        const poster = input.poster ?? movie[0].poster;
        const rate = input.rate ?? movie[0].rate;
    
        let result;
        try {
            const [updateResult] = await connection.query(
                `UPDATE movie
                 SET title = ?, year = ?, duration = ?, director = ?, poster = ?, rate = ?
                 WHERE id = UUID_TO_BIN(?);`,
                [title, year, duration, director, poster, rate, id]
            );
            result = updateResult;
        } catch (error) {
            console.log('Error al actualizar la película:', error);
            return false; // Retorna false si la actualización falla
        }
    
        let newMovie;
        try {
            const [selectResult] = await connection.query(
                `SELECT * FROM movie WHERE id = UUID_TO_BIN(?);`,
                [id]
            );
            newMovie = selectResult;
        } catch (error) {
            console.log('Error al buscar la película modificada:', error);
            return false; // Retorna false si la consulta para obtener la película modificada falla
        }
    
        if (result.affectedRows === 0) {
            console.log('No se realizaron cambios en la película');
            return 'No se realizaron cambios en la película';
        }
    
        if (!newMovie || newMovie.length === 0) {
            console.log('No se pudo encontrar la película después de la actualización');
            return 'No se pudo encontrar la película después de la actualización';
        }
    
        console.log(newMovie[0]);
        return newMovie[0];
    }
    
}