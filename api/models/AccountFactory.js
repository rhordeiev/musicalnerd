const roles = require('../helpers/userRoles');
const UserAccount = require('./UserAccount');
const ModeratorAccount = require('./ModeratorAccount');

class AccountFactory {
  constructor(user = null) {
    this.user = user;
  }

  create(role) {
    switch (role) {
      case roles.user:
        return new UserAccount(this.user);
      case roles.moderator:
        return new ModeratorAccount(this.user);
      default:
        return new UserAccount(this.user);
    }
  }
}

module.exports = AccountFactory;
