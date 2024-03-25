const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Account } = require("../db");
const { authMiddleware } = require("../middleware");

router.use(authMiddleware);

router.get("/balance", async (req, res) => {
  const userId = req.userId;

  const info = await Account.findOne({ userId: userId }, "balance");

  res.status(200).send(info);
});
router.post("/transfer", async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();
  const { amount, to } = req.body;

  try {
    const account = await Account.findOne({ userId: req.userId }).session(
      session
    );

    if (!account || account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Invalid account",
      });
    }

    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);
    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    // Commit the transaction
    await session.commitTransaction();
    res.json({
      message: "Transfer successful",
    });
  } catch (err) {
    await session.abortTransaction();
    res.json({
      message: "Something went wrong",
    });
  }
});

module.exports = router;
