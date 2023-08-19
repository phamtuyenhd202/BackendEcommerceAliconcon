const express = require('express')
const morgan = require('morgan')
const {default: helmet} = require('helmet')
const compression = require('compression')
const app = express()

//init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())


//init db



//init routers
app.get('/', (req, res, next)=>{
    const strcompression = 'hello emcommerce aliconcon'
    return res.status(200).json({
        message: 'hello ecommerce Aliconcon',
        metadata: strcompression.repeat(10000)
    })
})

//handling error


module.exports = app