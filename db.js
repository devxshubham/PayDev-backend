const mongoose  = require('mongoose')

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
const AccountSchema = Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    balance : {
        type : Number,
        required : true,
    }
})

const User = mongoose.model('User', userSchema)
const Account = mongoose.model('Account', AccountSchema)

module.exports = {
    User,
    Account
}