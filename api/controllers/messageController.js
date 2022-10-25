const MessageFactory = require('../models/MessageFactory');

exports.getMessages = async (req, res) => {
  try {
    const { id, type } = req.query;
    let message;
    if (type === 'album') {
      message = new MessageFactory({
        albumId: id,
      }).create('album');
    } else if (type === 'artist') {
      message = new MessageFactory({
        artistId: id,
      }).create('artist');
    }
    const result = await message.getAll();
    if (result.isError) throw new Error(result.error.message);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
