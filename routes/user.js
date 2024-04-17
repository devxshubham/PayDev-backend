const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')

const {User, Account}  = require('../db')

const zod = require('zod');

const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config')

const { authMiddleware } = require('../middleware')



const userSignup = zod.object({
    email: zod.string().email().min(4).max(30),
	firstName: zod.string().max(30),
	lastName: zod.string().max(30),
	password: zod.string().min(6).max(30)
})
const userLogin = zod.object({
	email: zod.string().email().min(4).max(30),
	password: zod.string().min(6).max(30)
})
const updateBody = zod.object({
    password : zod.string().min(6).max(30).optional(),
    firstName : zod.string().max(30).optional(),
    lastName : zod.string().max(30).optional()
})

router.post('/signup', async(req, res) => {

    const { success } = userSignup.safeParse(req.body);

    if( !success ){
        return res.status(411).send({
            message: "Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({ email : req.body.email})

    if( existingUser ){
        return res.status(411).send({
            message: "Email already taken"
        })
    }

    const newUser = await User.create(req.body)
    
    const userId = newUser._id

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({
        userId : userId
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
            msg : "invalid input here"
        })
    }

    const user = await User.findOne( {email : req.body.email})

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
            msg : "incorrect email or password"
        })
    }
})
router.get('/', authMiddleware, async(req, res) => {

    const user = await User.findById(req.userId)

    res.status(200).json(user);
})
router.put('/', async(req, res) => {

    const { success} = updateBody.safeParse(req.body)
    if( !success ){
        return res.json({
            msg : "invalid input"
        })
    } 

    const userId = req.userId
    const newData = req.body

    const updated = await User.findOneAndUpdate({ _id : userId}, newData, {
        new : true
    });
    if( updated ) return res.json({ msg : "updated succefully"})
    else return res.json({ msg : "error while updating"})
})

router.get('/bulk', async(req, res) => {
    const filter = req.query.filter || ""

    // db.users.find( { _id: { $nin: [ObjectId("65f72a41c7342afe326916a0")] } })

    const users = await User.find({
        $or: [
            {
                firstName: {
                    "$regex": filter
                }
            },
            {
                lastName: {
                    "$regex": filter
                }
            }
        ]
    }, 'email firstName lastName _id')

    res.json({
        users : users
    })
})

module.exports = router