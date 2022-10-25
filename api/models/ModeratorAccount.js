const pool = require('../config/db/db');
const userRoles = require('../helpers/userRoles');
const Account = require('./Account');

class ModeratorAccount extends Account {
  constructor({
    login = '',
    password = '',
    name = '',
    surname = '',
    gender = '',
    birthDate = '',
    email = '',
    additionalContactInfo = '',
    country = '',
    city = '',
    additionalInfo = '',
    avatar = '',
  }) {
    super({
      login,
      password,
      name,
      surname,
      gender,
      birthDate,
      email,
      additionalContactInfo,
      country,
      city,
      additionalInfo,
      avatar,
    });
    this.userRole = userRoles.moderator;
  }
}

module.exports = ModeratorAccount;
