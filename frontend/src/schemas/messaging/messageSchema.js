const { object, number, string, boolean, date } = require('yup');

const messageSchema = object({
  id: number().integer().positive().required(),
  content: string().nullable(),
  mediaUrl: string().url().nullable(),
  createdAt: date().required(),
  isRead: boolean().required(),
  senderId: number().integer().positive().required(),
});

module.exports = messageSchema;
