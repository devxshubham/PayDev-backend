const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("CONNECTED TO MONGO");
  })
  .catch((err) => {
    console.log(err, "error occured");
  });

const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: {
    unique: true,
    type: String,
    required: true,
    lowercase: true,
    minLength: 4,
    maxLength: 30,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 30,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 30,
  },
});
const AccountSchema = Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

const User = new mongoose.model("User", userSchema);
const Account = new mongoose.model("Account", AccountSchema);

module.exports = {
  User,
  Account,
};
