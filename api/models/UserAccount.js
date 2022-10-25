const userRoles = require('../helpers/userRoles');
const Account = require('./Account');
const Review = require('./Review');
const MessageFactory = require('./MessageFactory');

class UserAccount extends Account {
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
    this.userRole = userRoles.user;
  }

  async countReviews() {
    try {
      const reviewCount = await new Review({
        userLogin: this.login,
      }).reviewCountByUser();
      return { isError: false, reviewCount: reviewCount.result.review_count };
    } catch (error) {
      return { isError: true, error };
    }
  }

  async writeMessage(messageInfo) {
    try {
      let message;
      if (messageInfo.type === 'album') {
        message = new MessageFactory({
          userLogin: this.login,
          message: messageInfo.text,
          albumId: messageInfo.room,
        }).create('album');
      } else if (messageInfo.type === 'artist') {
        message = new MessageFactory({
          userLogin: this.login,
          message: messageInfo.text,
          artistId: messageInfo.room,
        }).create('artist');
      }
      const messageCreationResult = await message.create();
      if (messageCreationResult.isError) {
        throw new Error(messageCreationResult.error.message);
      }
      return { isError: false, result: messageCreationResult.result };
    } catch (error) {
      return { isError: true, error };
    }
  }

  static async deleteMessage(messageInfo) {
    try {
      let message;
      if (messageInfo.type === 'album') {
        message = new MessageFactory({
          id: messageInfo.id,
        }).create('album');
      } else if (messageInfo.type === 'artist') {
        message = new MessageFactory({
          id: messageInfo.id,
        }).create('artist');
      }
      const messageCreationResult = await message.delete();
      if (messageCreationResult.isError) {
        throw new Error(messageCreationResult.error.message);
      }
      return { isError: false };
    } catch (error) {
      return { isError: true, error };
    }
  }

  async likeReview(reviewId) {
    try {
      const result = await new Review({
        id: reviewId,
      }).addLike(this.login);
      if (result.isError) {
        throw new Error('NEW_USER_LIKE_ERROR');
      }
      return { isError: false };
    } catch (error) {
      return { isError: true, error };
    }
  }

  async dislikeReview(reviewId) {
    try {
      const result = await new Review({
        id: reviewId,
      }).removeLike(this.login);
      if (result.isError) {
        throw new Error('DELETE_USER_LIKE_ERROR');
      }
      return { isError: false };
    } catch (error) {
      return { isError: true, error };
    }
  }
}

module.exports = UserAccount;
