const AlbumMessage = require('./AlbumMessage');
const ArtistMessage = require('./ArtistMessage');

class MessageFactory {
  constructor(message = null) {
    this.message = message;
  }

  create(type) {
    switch (type) {
      case 'album':
        return new AlbumMessage(this.message);
      case 'artist':
        return new ArtistMessage(this.message);
      default:
        return new AlbumMessage(this.message);
    }
  }
}

module.exports = MessageFactory;
