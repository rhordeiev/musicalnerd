const Album = require('../models/Album');

exports.createAlbum = async (req, res) => {
  try {
    const enteredData = { ...req.body };
    const result = await new Album(enteredData).create();
    if (result.isError) throw new Error(result.error.message);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.changeAlbum = async (req, res) => {
  try {
    const enteredData = { ...req.body };
    const result = await new Album(enteredData).change();
    if (result.isError) throw new Error(result.error.message);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await new Album({ id }).delete();
    if (result.isError) throw new Error(result.error.message);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.findAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const foundAlbum = await new Album({ id }).findById();
    if (foundAlbum.isError) throw new Error(foundAlbum.error.message);
    res.status(200).json(foundAlbum.result);
  } catch (error) {
    res.status(401).json(error.message);
  }
};

exports.getMark = async (req, res) => {
  try {
    const { id } = req.params;
    const mark = await new Album({ id }).getMark();
    if (mark.isError) throw new Error(mark.error.message);
    res.status(200).json(mark.result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

exports.getReactions = async (req, res) => {
  try {
    const { id } = req.params;
    const reactions = await new Album({ id }).getReactions();
    if (reactions.isError) throw new Error(reactions.error.message);
    res.status(200).json(reactions.result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

exports.getPopular = async (req, res) => {
  try {
    const popularAlbums = await Album.getPopular();
    if (popularAlbums.isError) throw new Error(popularAlbums.error.message);
    res.status(200).json(popularAlbums.result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

exports.getNearest = async (req, res) => {
  try {
    const nearestAlbums = await Album.getNearest();
    if (nearestAlbums.isError) throw new Error(nearestAlbums.error.message);
    res.status(200).json(nearestAlbums.result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};
