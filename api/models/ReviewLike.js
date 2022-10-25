const pool = require('../config/db/db');

class ReviewLike {
  constructor({ userLogin = '', reviewId = '' }) {
    this.userLogin = userLogin;
    this.reviewId = reviewId;
  }

  async create() {
    try {
      await pool.query(`INSERT INTO review_like(
        user_login, review_id)
        VALUES ('${this.userLogin}', '${this.reviewId}')`);
      return { isError: false };
    } catch (error) {
      return { isError: true, error };
    }
  }

  async get() {
    try {
      const result = await pool.query(
        `SELECT * FROM review_like
        WHERE review_id='${this.reviewId}'`,
      );
      if (result.rowCount === 0) {
        throw new Error('LIKE_NOT_FOUND');
      }
      return { isError: false, result: result.rows };
    } catch (error) {
      return { isError: true, error };
    }
  }

  async remove() {
    try {
      await pool.query(`DELETE FROM review_like
      WHERE user_login='${this.userLogin}' AND
      review_id='${this.reviewId}'`);
      return { isError: false };
    } catch (error) {
      return { isError: true, error };
    }
  }
}

module.exports = ReviewLike;
