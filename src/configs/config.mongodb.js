'use strict'

// level 0
// const config = {
//     app: {
//         port: 3000
//     },
//     db:{
//         host: 'localhost',
//         port: 27017,
//         name: 'ecommerce_aliconcon'
//     }
// }

// level 3

const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3056
    },
    db:{
        host: process.env.DEV_DB_HOST || '/127.0.0.1',//'localhost',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'ecommerce_aliconcon'
    }
}

const pro = {
    app: {
        port: process.env.POR_APP_PORT || 3000
    },
    db:{
        host: process.env.PRO_DB_HOST || 'localhost',
        port: process.env.PRO_DB_PORT || 27017,
        name: process.env.PRO_DB_NAME || 'ecommerce_aliconcon'
    }
}

const config = {dev, pro}
const env = process.env.NODE_ENV || 'dev'
module.exports = config[env]
    
