const bcrypt = require('bcryptjs');
const userRoles = require('../helpers/userRoles');
const AccountFactory = require('../models/AccountFactory');
const UserAccount = require('../models/UserAccount');
const { generateAccessToken } = require('../helpers/jwtFunctions');
const Account = require('../models/Account');
const Review = require('../models/Review');

exports.createUser = async (req, res) => {
  try {
    const enteredData = { ...req.body };
    const salt = bcrypt.genSaltSync(+process.env.BCRYPT_SALT);
    enteredData.password = bcrypt.hashSync(enteredData.password, salt);
    const user = new AccountFactory(enteredData).create(userRoles.user);
    const result = await user.create();
    if (result.isError) throw new Error(result.error.message);
    res.status(201).json(result.user);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.changeUser = async (req, res) => {
  try {
    const enteredData = { ...req.body };
    const salt = bcrypt.genSaltSync(+process.env.BCRYPT_SALT);
    enteredData.password = bcrypt.hashSync(enteredData.password, salt);
    const user = new AccountFactory(enteredData).create(userRoles.user);
    const result = await user.change(enteredData.enteredLogin);
    if (result.isError) throw new Error(result.error.message);
    res.status(201).json({ data: 'OK' });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { login } = req.params;
    const user = new AccountFactory({ login }).create(userRoles.user);
    const result = await user.delete();
    if (result.isError) throw new Error(result.error.message);
    res.status(201).json({ data: 'OK' });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const enteredData = { ...req.body };
    const user = new AccountFactory(enteredData).create(userRoles.user);
    const foundUser = await user.findByLogin(req.body.login);
    if (foundUser.isError) throw new Error(foundUser.error.message);
    const passwordEqual = await bcrypt.compare(
      enteredData.password,
      foundUser.result.password,
    );
    if (!passwordEqual) throw new Error('PASSWORD_NOT_MATCH');
    const expirationTime = 3600 * 1000;
    const token = generateAccessToken(req.body, expirationTime);
    foundUser.result.password = enteredData.password;
    res.status(200).json({ user: foundUser.result, token, expirationTime });
  } catch (error) {
    res.status(401).json(error.message);
  }
};

exports.findUser = async (req, res) => {
  try {
    const { login, role } = req.query;
    let user;
    if (role === 'user') {
      user = new AccountFactory({ login }).create(userRoles.user);
    } else if (role === 'moderator') {
      user = new AccountFactory({ login }).create(userRoles.moderator);
    }
    const foundUser = await user.findByLogin();
    let reviewCountResult = { result: null };
    if (foundUser.result.user_role === 'user') {
      reviewCountResult = await user.countReviews();
    }
    if (foundUser.isError) throw new Error(foundUser.error.message);
    res.status(200).json({
      name: foundUser.result.name,
      surname: foundUser.result.surname,
      gender: foundUser.result.gender,
      birthdate: foundUser.result.birthdate,
      country: foundUser.result.country,
      email: foundUser.result.email,
      additional_contact_info: foundUser.result.additional_contact_info,
      city: foundUser.result.city,
      user_role: foundUser.result.user_role,
      additional_info: foundUser.result.additional_info,
      avatar: foundUser.result.avatar,
      reviewCount: reviewCountResult.reviewCount,
    });
  } catch (error) {
    res.status(401).json(error.message);
  }
};

exports.writeMessage = async (req, res) => {
  try {
    const messageInfo = { ...req.body };
    const user = new AccountFactory({ login: messageInfo.userLogin }).create(
      userRoles.user,
    );
    const messageCreationResult = await user.writeMessage(messageInfo);
    if (messageCreationResult.isError) {
      throw new Error(messageCreationResult.error.message);
    }
    res.status(200).json({ result: messageCreationResult.result });
  } catch (error) {
    res.status(401).json(error.message);
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const messageInfo = { ...req.body };
    const messageCreationResult = UserAccount.deleteMessage(messageInfo);
    if (messageCreationResult.isError) {
      throw new Error(messageCreationResult.error.message);
    }
    res.status(200).json({ result: messageCreationResult });
  } catch (error) {
    res.status(401).json(error.message);
  }
};

exports.likeReview = async (req, res) => {
  try {
    const { id, userLogin } = req.params;
    const user = new AccountFactory({ login: userLogin }).create(
      userRoles.user,
    );
    const result = await user.likeReview(id);
    if (result.isError) throw new Error(result.error.message);
    res.status(201).json({ data: 'OK' });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.dislikeReview = async (req, res) => {
  try {
    const { id, userLogin } = req.params;
    const result = await new Review({ id }).removeLike(userLogin);
    if (result.isError) throw new Error(result.error.message);
    res.status(201).json({ data: 'OK' });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.search = async (req, res) => {
  try {
    const { type, value, limit, offset } = req.query;
    let searchResult;
    switch (type) {
      case 'album':
        searchResult = await Account.searchAlbums(value, limit, offset);
        searchResult = searchResult.result;
        break;
      case 'artist':
        searchResult = await Account.searchArtists(value, limit, offset);
        searchResult = searchResult.result;
        break;
      case 'user':
        searchResult = await Account.searchByName(value, limit, offset);
        break;
      default:
        searchResult = await Account.searchAlbums(value, limit, offset);
    }
    if (searchResult.isError) {
      throw new Error(searchResult.error.message);
    }
    res.status(200).json(searchResult);
  } catch (error) {
    res.status(401).json(error.message);
  }
};
