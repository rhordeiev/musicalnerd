class Message {
  constructor({ id = '', userLogin = '', message = '' }) {
    this.id = id;
    this.userLogin = userLogin;
    this.message = message;
  }
}

module.exports = Message;
