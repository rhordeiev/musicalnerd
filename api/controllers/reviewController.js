const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  try {
    const enteredData = { ...req.body };
    const result = await new Review(enteredData).create();
    if (result.isError) throw new Error(result.error.message);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.changeReview = async (req, res) => {
  try {
    const enteredData = { ...req.body };
    const result = await new Review(enteredData).change();
    if (result.isError) throw new Error(result.error.message);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await new Review({ id }).delete();
    if (result.isError) throw new Error(result.error.message);
    res.status(201).json({ data: 'OK' });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.getReview = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await new Review({ id }).getReviewById();
    if (result.isError) throw new Error(result.error.message);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.findReviews = async (req, res) => {
  try {
    const { id, type, offset, filterColumn, filterValue, sort, direction } =
      req.query;
    let foundReview;
    if (type === 'album') {
      foundReview = await new Review({ albumId: id }).findReviewsByAlbum(
        offset,
        filterColumn,
        filterValue,
        sort,
        direction,
      );
    } else {
      foundReview = await new Review({ userLogin: id }).findReviewsByUser(
        offset,
        filterColumn,
        filterValue,
        sort,
        direction,
      );
    }
    if (foundReview.isError) throw new Error(foundReview.error.message);
    res.status(200).json(foundReview.result);
  } catch (error) {
    res.status(401).json(error.message);
  }
};

exports.getLikes = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await new Review({ id }).getLikes();
    if (result.isError) throw new Error(result.error.message);
    res.status(201).json(result.likes);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
