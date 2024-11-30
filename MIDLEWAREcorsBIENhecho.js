const cors = require('cors')
const express = require('express')

const app = express()
app.use(cors({
    origin: (origin, callback)=>{
        const ACCEPTED_ORIGINS = [
            'ruta1',
            'ruta2'
        ]

        if(ACCEPTED_ORIGINS.includes(origin)){
            return callback(null, true)
        }

        if(!origin){
            return callback(null, true)
        }

        return callback(new Error('No permitido, error de CORS'))
    }
}))