const { object, number, date } = require('yup');
const messageSchema = require('./messageSchema');
const userSchema = require('./userSchema');

const conversationSchema = object({
  id: number().integer().positive().required(),
  createdAt: date().required(),
  user: userSchema.required(),
  latestMessage: messageSchema.nullable()
});

module.exports = conversationSchema;
