const mongoose = require('mongoose')

const connectString = `mongodb://127.0.0.1:27017/ecommerce_aliconcon`

mongoose.connect(connectString)
.then( _ => console.log(`Connected Mongodb Success`))
.catch( err => console.log(`Error Connect!!`))

if(1===1){
    mongoose.set('debug', true)
    mongoose.set('debug', {color: true})
}


module.exports = mongoose

