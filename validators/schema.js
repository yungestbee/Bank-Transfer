const joi = require('joi');

const transfer= joi.object().keys({
   
    senderAccount: joi.number().required(),
    recieverAccount: joi.number().required(),
    amount: joi.number().required(),
    transferDescription: joi.string()
})


module.exports = transfer