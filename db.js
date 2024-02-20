const mongoose  = require('mongoose')
const { string } = require('zod')

mongoose.connect("mongodb://localhost:27017/paydev")
.then(()=>{
    console.log("CONNECTED TO MONGO")
})
.catch( (err) => {
    console.log( err, "error occured")
})

const Schema = mongoose.Schema
const userSchema = new Schema({
    username : {
        unique : true,
        type : String,
        required : true,
        lowercase : true,
        minLength : 4,
        maxLength : 30
    },
    firstName : {
        type : String,
        required : true,
        trim : true,
        maxLength : 30
    },
    lastName : {
        type : String,
        required : true,
        trim : true,
        maxLength : 30
    },
    password : {
        type : String,
        required : true,
        minLength : 6,
        maxLength : 30
    }
    
})

const User = mongoose.model('User', userSchema)


module.exports = {
    User,
}