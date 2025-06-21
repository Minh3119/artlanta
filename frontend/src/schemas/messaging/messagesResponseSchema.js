const { object, array, boolean } = require('yup');
const messageSchema = require('./messageSchema');

const messagesResponseSchema = object({
  success: boolean().required(),
  messages: array().of(messageSchema).required()
});

module.exports = messagesResponseSchema;
