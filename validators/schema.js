const joi = require("joi");

const transfers = joi.object().keys({
  senderAccount: joi.number().required(),
  receiverAccount: joi.number().required(),
  deposit: joi.number().required(),
  transferDescription: joi.string(),
});

module.exports = transfers;
