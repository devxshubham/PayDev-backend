const express = require('express')
const router = express.Router();
const {Account} = require('../db')
const {authMiddleware} = require('../middleware')

router.use(authMiddleware)

router.get('/balance', async(req, res) =>{
    const userId = req.userId

    const info = await Account.findOne( { userId : userId}, 'balance' )

    res.status(200).send(info)

})
router.get('/transfer', async(req, res) => {
    const senderId = req.userId
    const recieverId = req.body.to
    const amount = req.body.amount

    const sender = await Account.findOne({ senderId : userId })
    
    if(sender.balance < amount ){
        return res.status(400).json({
            msg : "Insufficient bank balance"
        })
    }
    

})

module.exports = router

