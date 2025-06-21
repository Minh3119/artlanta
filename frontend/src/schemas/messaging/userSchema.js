const { object, number, string, boolean, date } = require('yup');

const userSchema = object({
  id: number().integer().positive().required(),
  username: string().required(),
  fullName: string().nullable(),
  bio: string().nullable(),
  avatarURL: string().url().default('https://upload.wikimedia.org/wikipedia/commons/3/38/Solid_white_bordered.png'),
  gender: boolean().default(false),
  location: string().nullable(),
  role: string().oneOf(['CLIENT', 'ARTIST', 'ADMIN', 'STAFF']).default('CLIENT'),
  status: string().oneOf(['ACTIVE', 'BANNED', 'DEACTIVATED']).default('ACTIVE'),
  language: string().oneOf(['en', 'vn']).default('vn'),
  isPrivate: boolean().default(false),
  isFlagged: boolean().default(false),
  createdAt: date(),
  lastLogin: date().nullable()
});

module.exports = userSchema;
