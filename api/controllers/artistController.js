const Artist = require('../models/Artist');

exports.createArtist = async (req, res) => {
  try {
    const enteredData = { ...req.body };
    const result = await new Artist(enteredData).create();
    if (result.isError) throw new Error(result.error.message);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

exports.changeArtist = async (req, res) => {
  try {
    const enteredData = { ...req.body };
    const result = await new Artist(enteredData).change();
    if (result.isError) throw new Error(result.error.message);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.deleteArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await new Artist({ id }).delete();
    if (result.isError) throw new Error(result.error.message);
    res.status(201).json({ data: 'OK' });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.findArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const foundArtist = await new Artist({ id }).findById();
    if (foundArtist.isError) throw new Error(foundArtist.error.message);
    res.status(200).json(foundArtist.result);
  } catch (error) {
    res.status(401).json(error.message);
  }
};

exports.findArtistAlbums = async (req, res) => {
  try {
    const { id } = req.params;
    const foundArtist = await new Artist({ id }).findAlbumsById();
    if (foundArtist.isError) throw new Error(foundArtist.error.message);
    res.status(200).json(foundArtist.result);
  } catch (error) {
    res.status(401).json(error.message);
  }
};

exports.getMark = async (req, res) => {
  try {
    const { id } = req.params;
    const mark = await new Artist({ id }).getMark();
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
    const reactions = await new Artist({ id }).getReactions();
    if (reactions.isError) throw new Error(reactions.error.message);
    res.status(200).json(reactions.result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

exports.getPopular = async (req, res) => {
  try {
    const popularArtists = await Artist.getPopular();
    if (popularArtists.isError) throw new Error(popularArtists.error.message);
    res.status(200).json(popularArtists.result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};
