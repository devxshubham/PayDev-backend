const express = require('express')
const router = express.Router();

const {User}  = require('../db')

const zod = require('zod');

const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config')

const { authMiddleware } = require('../middleware')

router.use(authMiddleware)


const userSignup = zod.object({
    username: zod.string().email().min(4).max(30),
	firstName: zod.string().max(30),
	lastName: zod.string().max(30),
	password: zod.string().min(6).max(30)
})
const userLogin = zod.object({
	username: zod.string().email().min(4).max(30),
	password: zod.string().min(6).max(30)
})

router.post('/signup', async(req, res) => {

    const { success } = userSignup.safeParse(req.body);

    if( !success ){
        return res.status(411).send({
            message: "Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({ username : req.body.username})
    console.log(existingUser)
    if( existingUser ){
        return res.status(411).send({
            message: "Email already taken"
        })
    }

    const newUser = await User.create(req.body)
    
    const userid = newUser._id

    const token = jwt.sign({
        userId : userid
    },JWT_SECRET)

    res.json({
        message: "User created successfully",
        token: token
    })

})

router.post('/signin', async(req, res) => {

    const { success} = userLogin.safeParse(req.body)
    if( !success ){
        return res.json({
            msg : "invalid input"
        })
    }

    const user = await User.findOne( {username : req.body.username})

    if( user == null ) return res.json({
        msg : "cannot find user"
    })
    if( user.password == req.body.password ){
        const token = jwt.sign({
            userId : user._id
        },JWT_SECRET)
        return res.json({
            token : token
        })
    }
    else{
        return res.status(411).json({
            msg : "incorrect username or password"
        })
    }
})
router.put('/', async(req, res) => {
    const userId = req.userId
    const newData = req.body
    console.log(newData)

    const updated = await User.findOneAndUpdate({ _id : userId}, newData, {
        new : true
    });
    console.log(updated)
    return res.send(updated)
})

module.exports = router