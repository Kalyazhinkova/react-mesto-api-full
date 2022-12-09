import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UnathorizedError } from '../errors/UnauthorizedError.js';
import { schemaEmail } from '../validators/users.js';

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        // eslint-disable-next-line no-useless-escape
        const urlCheck = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        return urlCheck.test(v);
      },
      message: 'Аватар задается в виде ссылки!',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    velidate: {
      validator: (value) => !schemaEmail.validate(value).error,
      message: () => 'Не верно формат email!',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findOneAndValidatePassword = function ({ email, password }) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnathorizedError('Пользователь с такими данными не найден');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnathorizedError('Неправильная почта или пароль');
          }
          // удаляем пароль из объекта пользователя и превращаем в объект
          const { password: removed, ...userWithoutPassword } = user.toObject();
          // const userWithoutPassword = user.toObject();
          // delete userWithoutPassword.password;
          return userWithoutPassword;
        });
    });
};

export const User = mongoose.model('User', userSchema);
