const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const createAccount = require("./validators/joi");
const transfer = require("./validators/schema");
const transfers = require("./validators/schema");

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose
  .connect("mongodb://127.0.0.1:27017/company", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    try {
      console.log("mongo connected");
    } catch (error) {
      console.log(error);
    }
  });
let accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);

let date = new Date().toLocaleString();
// var currentDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
// var currentTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

const schema = new mongoose.Schema({
  accountNumber: Number,
  fullName: String,
  balance: Number,
  createdAt: String,
});

const tansfer = new mongoose.Schema({
  reference: String,
  senderName: String,
  senderAccount: Number,
  amount: Number,
  receiverName: String,
  receiverAccount: Number,
  transferDescription: String,
  transactionTime: String,
});

const Balance = mongoose.model("Balance", schema);
const Transaction = mongoose.model("Transaction", tansfer);

app.post("/createAccount", (req, res) => {
  const { error, value } = createAccount.validate(req.body);
  if (error) {
    res.status(400).json(error);
  } else {
    try {
      const balance = new Balance({
        accountNumber: accountNumber,
        fullName: value.fullName,
        balance: value.firstDeposit,
        createdAt: `${date}`,
      });
      balance.save().then(() => {
        res.send("Account creation was successfull");
      });
      res
        .status(200)
        .send(
          `Thank you ${value.fullName} for chossing us. Your Account Number is ${accountNumber}`
        );
    } catch (error) {
      res.status(400).json(error);
    }
  }

  console.log("data created");
  res.send("Account Created");
});

app.get("/balances", async (req, res) => {
  try {
    const allBalances = await Balance.find({});
    console.log(allBalances);
    res.status(200).json(allBalances);
  } catch (error) {
    console.log(error);
  }
});

app.post("/transfer", async (req, res) => {
  const { error, value } = transfers.validate(req.body);
  let reference = `fg${Math.floor(
    100000 + Math.random() * 900000
  )}yxl${Math.floor(100000 + Math.random() * 900000)}`;
  let senderAccount = value.senderAccount;
  let amount = value.deposit;
  let receiverAccount = value.receiverAccount;
  let transferDescription = value.transferDescription;
  let transactionTime = Date();

  if (error) {
    return res.status(400).send(error);
  } else {
    try {
      const send = await Balance.findOne({ accountNumber: senderAccount });
      const receive = await Balance.findOne({ accountNumber: receiverAccount });

      console.log(send, receive);

      let senderBalance = send.balance;
      let senderName = send.fullName;

      let recieverBalance = receive.balance;
      let recieverName = receive.fullName;

      console.log(senderBalance, senderName);
      console.log(recieverBalance, recieverName);

      if (senderBalance >= amount) {
        recieverBalance = recieverBalance + amount;
        senderBalance = senderBalance - amount;

        console.log(recieverBalance, senderBalance);

        await Balance.updateOne(
          { accountNumber: senderAccount },
          { $set: { balance: senderBalance } }
        );
        await Balance.updateOne(
          { accountNumber: receiverAccount },
          { $set: { balance: recieverBalance } }
        );

        const transact = new Transaction({
          reference: reference,
          senderName: senderName,
          senderAccount: senderAccount,
          amount: amount,
          receiverName: recieverName,
          receiverAccount: receiverAccount,
          transferDescription: transferDescription,
          transactionTime: transactionTime,
        });
        transact.save().then(() => {
          res.send("Transaction Successful");
        });
      } else {
        console.log("insufficient Balance");
        res.send("insufficient Balance");
      }
    } catch (error) {
      res.send(error);
    }
  }
});

app.get("/balances/:accountNumber", async (req, res) => {
  try {
    // console.log(req.body)
    const singleBalance = await Balance.findOne({
      accountNumber: req.params.accountNumber,
    });
    res.send(singleBalance);
    console.log(singleBalance);
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log("Server is running at port 3000");
});
