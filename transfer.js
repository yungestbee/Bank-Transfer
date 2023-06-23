const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const createAccount = require('./validators/joi');
const transfer = require('./validators/schema')

const app = express();

app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

mongoose.connect('mongodb://127.0.0.1:27017/company',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
.then(()=>{
    try {
        console.log("mongo connected")
        
    } catch (error) {
        console.log(error)
    }
})

var accountNumber = Math.floor(1000000000 + Math.random()*9000000000)

var date = new Date().toLocaleString();
// var currentDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
// var currentTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

var reference = `fg${Math.floor(100000 + Math.random()*900000)}yxl${Math.floor(100000 + Math.random()*900000)}`

const schema = new mongoose.Schema({
    accountNumber: Number,
    fullName: String,
    balance:Number,
    createdAt: String,
})

const Balance = mongoose.model("Balance", schema);
const Transaction = mongoose.model("Transaction", transfer)




app.post('/createAccount', (req, res) => {
   const { error, value} = createAccount.validate(req.body);
   if (error){
    res.status(400).json(error);
   }
   else{
    try{
        const balance = new Balance({
            accountNumber: accountNumber,
            fullName: value.fullName,
            balance: value.firstDeposit,
            createdAt: `${date}`
        });
        balance.save().then(()=>{
            res.send('Account creation was successfull')
        })
        res.status(200).send(`Thank you ${value.fullName} for chossing us. Your Account Number is ${accountNumber}`)

    } catch (error){
        res.status(400).json(error)
    }
   }
   
    console.log('data created')
    res.send('Account Created')
})

app.get('/balances', async (req,res)=>{
    try {
        const allBalances = await Balance.find({})
        res.status(200).json(allBalances)
        console.log(allBalances)
    } catch (error) {
        console.log(error)
    }
})

// app.post('/transfer', (req, res)=>{
//     app.get((req, res)=>{
//         res.
//     })
//     const { error, value} = transfer.validate(req.body);
//    if (error){
//     res.status(400).json(error);
//    }
//    else{
//     try{
//         const balance = new Balance({
//             accountNumber: accountNumber,
//             fullName: value.fullName,
//             balance: value.firstDeposit,
//             createdAt: `${date}`
//         });

//         const transaction = new Transaction({
//             reference: `${reference}`,
//             senderAccountNumber: ,
//             AccountNumber: accountNumber,
//             transferDescription: value.transferDescription,
//             amount: value.amount,
//             balance: value.firstDeposit,
//             createdAt: `${date}`


//         })

//         balance.save().then(()=>{
//             res.send('Account creation was successfull')
//         })


//         res.status(200).send(`Transaction Successful. Your Account Balance is ${balance}`)

//     } catch (error){
//         res.status(400).json(error)
//     }
//    }

//     })

    app.get('/balances:64959ad6b933c9b3c545cf02', async (res, req)=>{
        try {
            console.log(req.params)
            const singleBalance = await Balance.findById(req.params.accountNumber)
            res.status(200).json(singleBalance)
            console.log(singleBalance)
        } catch (error) {
            console.log(error)
        }
    })

app.listen(3000, () => {
    console.log("Server is running at port 3000");
  });
