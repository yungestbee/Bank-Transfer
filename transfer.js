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


app.post("/transfer", async (req,res)=>{

    const {error, value}=transfer.validate(req.body);

    if(error){

        return res.status(400).send(error)}
        var deposit= value.amount;
        var senderAccount= value.senderAccount;
        var transferDescription= value.transferDescription;
        var receiverAccount= value.receiverAccount;
        var senderBalance, receiverBalance=0;
        let SenderName, ReceiverName ;
try {

    const senderAcct= await Balance.find({accountNumber:senderAcctNo}, ('Fullname Balance -_id')).exec();
    const recieverAcct= await Balance.find({accountNumber:receiverAccount}, ('Fullname Balance -_id')).exec();

    // fetching the balance

    senderAcct.forEach(item=>{
         senderBalance=(item.balance);
         SenderName= item.fullName;

        })

     recieverAcct.forEach(item=>{
        ReceiverName = item.fullName;
        receiverBalance = item.balance;

    })

    if(senderBalance >= deposit){
        senderBalance -=deposit;
        receiverBalance +=deposit;

        await Balance.updateOne({accountNumber:senderAcctNo},{$set: {Balance: senderBalance}})
        await Balance.updateOne({accountNumber:receiverAccount},{$set:{Balance: receiverBalance}})


        const trans= new transaction({

            reference: `${reference}`,
            senderName:SenderName,
            senderAccount: senderAcctNo,
            amount: deposit,
            receiverName:ReceiverName,
            receiverAccount: receiverAccount,
            transferDescription: transferDescription,
            createAt:Date().toLocaleString

        })

        trans.save().then(()=>{

            console.log("Transfer done");

        })

        res.status(200).send(`Transfer done succesfully.`)

    }

    else{

        res.send('Insufficient Balance')

        }

   

        }

        catch (error) {

            console.error(error);

        }

})





    app.get('/balances/:accountNumber', async (req, res)=>{
        try {
            // console.log(req.body)
            const singleBalance = await Balance.findOne({accountNumber:req.body.accountNumber})
            res.send(singleBalance)
            console.log(singleBalance)

        } catch (error) {
            console.log(error)
        }
    })

    // app.get("/balance/:accountNumber", async (req, res) => {
    //     try {
      
    //       const perBalance = await Balance.findOne({
      
    //         accountNumber: req.body.accountNumber,
      
    //       });
      
    //       res.send(perBalance);
      
    //     } catch (error) {}
      
    //   })

app.listen(3000, () => {
    console.log("Server is running at port 3000");
  });
