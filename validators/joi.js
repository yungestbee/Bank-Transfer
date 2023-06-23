const joi = require('joi');

// const schema= joi.object().keys({
   
//     senderAccount: joi.number().required(),
//     recieverAccount: joi.number().required(),
//     amount: joi.number().required(),
//     transferDescription: joi.string()
// })

const  createAccount= joi.object({
    fullName: joi.string().required(),
    firstDeposit: joi.number().required(),
})

module.exports = createAccount