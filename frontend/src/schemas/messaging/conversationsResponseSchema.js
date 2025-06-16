const { object, array, boolean } = require('yup');
const conversationSchema = require('./conversationSchema');

const conversationsResponseSchema = object({
  success: boolean().required(),
  conversations: array().of(conversationSchema).required()
});

module.exports = conversationsResponseSchema;
