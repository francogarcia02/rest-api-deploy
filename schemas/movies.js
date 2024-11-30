const z = require('zod')

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Tipo de dato invalido en el titulo',
        required_error: 'El titulo es requerido'
    }),
    year: z.number().int().min(1900).max(2024),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(0),
    poster: z.string().url(),
    genre: z.array(
        z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thryller', 'Sci-Fi', 'Ficcion'])
    )
})

function validateMovie (object)  {
    return movieSchema.safeParse(object)
}

function validatePartialMovie (object) {
    return  movieSchema.partial().safeParse(object)
}

module.exports = {
    validateMovie,
    validatePartialMovie
}