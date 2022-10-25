const pool = require('../config/db/db');
const ReviewLike = require('./ReviewLike');

class Review {
  constructor({
    id = '',
    header = '',
    mark = null,
    reaction = 'good',
    text = '',
    albumId = '',
    userLogin = '',
  }) {
    this.id = id;
    this.header = header;
    this.mark = mark;
    this.reaction = reaction;
    this.text = text;
    this.albumId = albumId;
    this.userLogin = userLogin;
  }

  async create() {
    try {
      const result = await pool.query(`INSERT INTO review(
        header,${this.mark ? ' mark,' : ''} reaction,
        text, album_id, user_login)
        VALUES ('${this.header}'${this.mark ? `, '${this.mark}'` : ''},
        '${this.reaction}', '${this.text}', '${this.albumId}',
        '${this.userLogin}') RETURNING id`);
      return { isError: false, result: result.rows[0] };
    } catch (error) {
      return { isError: true, error };
    }
  }

  async change() {
    try {
      await pool.query(`UPDATE review
      SET header='${this.header}', mark='${this.mark}', 
      text='${this.text}', reaction='${this.reaction}'
      WHERE id='${this.id}';`);
      return { isError: false };
    } catch (error) {
      console.log(error);
      return { isError: true, error };
    }
  }

  async delete() {
    try {
      await pool.query(`DELETE FROM review
      WHERE id='${this.id}';`);
      return { isError: false };
    } catch (error) {
      console.log(error);
      return { isError: true, error };
    }
  }

  async getReviewById() {
    try {
      const result = await pool.query(
        `SELECT user_account.login, user_account.avatar,
        review.header, review.text, review.mark, review.reaction
        FROM review
        JOIN user_account ON review.user_login = user_account.login
        WHERE review.id='${this.id}'`,
      );
      if (result.rowCount === 0) {
        throw new Error('REVIEW_NOT_FOUND');
      }
      return { isError: false, result: result.rows[0] };
    } catch (error) {
      console.log(error);
      return { isError: true, error };
    }
  }

  async findReviewsByAlbum(offset, filterColumn, filterValue, sort, direction) {
    try {
      const result = await pool.query(
        `SELECT review.header, review.mark, review.creation_date,
        artist.id AS artist_id, review.album_id, artist.name AS artist_name,
        album.name AS album_name, review.user_login, review.id, review.reaction,
        SUM(CASE WHEN review_like.review_id = review.id THEN 1 ELSE 0 END) AS like_count
        FROM review
        JOIN album ON album.id=album_id
        JOIN artist ON artist.id=album.artist_id
        JOIN user_account ON user_account.login = review.user_login
        LEFT JOIN review_like ON review_like.review_id = review.id
        WHERE album_id='${this.albumId}' ${
          filterColumn === 'none'
            ? ''
            : `AND ${filterColumn} = '${filterValue}'`
        } 
        GROUP BY review.id, artist.id, album.id
        ${sort === 'none' ? '' : `ORDER BY ${sort} ${direction} NULLS LAST`}
        LIMIT 3 OFFSET ${offset}`,
      );
      if (result.rowCount === 0) {
        throw new Error('REVIEW_NOT_FOUND');
      }
      return { isError: false, result: result.rows };
    } catch (error) {
      console.log(error);
      return { isError: true, error };
    }
  }

  async findReviewsByUser(offset, filterColumn, filterValue, sort, direction) {
    try {
      const result = await pool.query(
        `SELECT review.header, review.mark, review.creation_date,
        artist.id AS artist_id, review.album_id, artist.name AS artist_name,
        album.name AS album_name, review.user_login, review.id, review.reaction,
        SUM(CASE WHEN review_like.review_id = review.id THEN 1 ELSE 0 END) AS like_count
        FROM review
        JOIN album ON album.id=album_id
        JOIN artist ON artist.id=album.artist_id
        JOIN user_account ON user_account.login = review.user_login
        LEFT JOIN review_like ON review_like.review_id = review.id
        WHERE review.user_login='${this.userLogin}' ${
          filterColumn === 'none'
            ? ''
            : `AND ${filterColumn} = '${filterValue}'`
        } 
        GROUP BY review.id, artist.id, album.id
        ${sort === 'none' ? '' : `ORDER BY ${sort} ${direction} NULLS LAST`}
        LIMIT 3 OFFSET ${offset}`,
      );
      if (result.rowCount === 0) {
        throw new Error('REVIEW_NOT_FOUND');
      }
      return { isError: false, result: result.rows };
    } catch (error) {
      console.log(error);
      return { isError: true, error };
    }
  }

  async calculateAverageMarkByAlbum() {
    try {
      const result = await pool.query(
        `SELECT SUM(mark)/COUNT(*) as average_album_mark,
         COUNT(*) as album_mark_count FROM review
         WHERE album_id='${this.albumId}'
         AND mark IS NOT NULL`,
      );
      if (result.rowCount === 0) {
        throw new Error('REVIEW_NOT_FOUND');
      }
      return { isError: false, result: result.rows[0] };
    } catch (error) {
      console.log(error);
      return { isError: true, error };
    }
  }

  static async calculateAverageMarkByArtist(artistId) {
    try {
      const result = await pool.query(
        `SELECT SUM(mark)/COUNT(*) as average_artist_mark,
        COUNT(*) as artist_mark_count FROM review
        JOIN album ON album.id=album_id
        JOIN artist ON artist.id=album.artist_id
        WHERE artist.id='${artistId}'
        AND mark IS NOT NULL`,
      );
      if (result.rowCount === 0) {
        throw new Error('REVIEW_NOT_FOUND');
      }
      return { isError: false, result: result.rows[0] };
    } catch (error) {
      console.log(error);
      return { isError: true, error };
    }
  }

  async reviewCountByAlbum() {
    try {
      const result = await pool.query(
        `SELECT COUNT(*) as review_count FROM review
        WHERE album_id='${this.albumId}'`,
      );
      if (result.rowCount === 0) {
        throw new Error('REVIEW_NOT_COUNTED');
      }
      return { isError: false, result: result.rows[0] };
    } catch (error) {
      console.log(error);
      return { isError: true, error };
    }
  }

  async reviewCountByUser() {
    try {
      const result = await pool.query(
        `SELECT COUNT(*) as review_count FROM review
        WHERE user_login='${this.userLogin}'`,
      );
      if (result.rowCount === 0) {
        throw new Error('REVIEW_NOT_COUNTED');
      }
      return { isError: false, result: result.rows[0] };
    } catch (error) {
      console.log(error);
      return { isError: true, error };
    }
  }

  static async reviewCountByArtist(artistId) {
    try {
      const result = await pool.query(
        `SELECT COUNT(*) as review_count FROM review
        JOIN album ON album.id=album_id
        JOIN artist ON artist.id=album.artist_id
        WHERE artist.id='${artistId}'`,
      );
      if (result.rowCount === 0) {
        throw new Error('REVIEW_NOT_COUNTED');
      }
      return { isError: false, result: result.rows[0] };
    } catch (error) {
      console.log(error);
      return { isError: true, error };
    }
  }

  async reactionCountByAlbum(type) {
    try {
      const result = await pool.query(
        `SELECT COUNT(*) as reaction_count FROM review
        WHERE album_id='${this.albumId}'
        AND reaction='${type}'`,
      );
      if (result.rowCount === 0) {
        throw new Error('REACTION_NOT_COUNTED');
      }
      return { isError: false, result: result.rows[0] };
    } catch (error) {
      console.log(error);
      return { isError: true, error };
    }
  }

  static async reactionCountByArtist(type, artistId) {
    try {
      const result = await pool.query(
        `SELECT COUNT(*) as reaction_count FROM review
        JOIN album ON album.id=album_id
        JOIN artist ON artist.id=album.artist_id
        WHERE artist.id='${artistId}'
        AND reaction='${type}'`,
      );
      if (result.rowCount === 0) {
        throw new Error('REACTION_NOT_COUNTED');
      }
      return { isError: false, result: result.rows[0] };
    } catch (error) {
      console.log(error);
      return { isError: true, error };
    }
  }

  async calculateReactionsByAlbum() {
    try {
      const goodReactionCount = (await this.reactionCountByAlbum('good')).result
        .reaction_count;
      const mehReactionCount = (await this.reactionCountByAlbum('meh')).result
        .reaction_count;
      const badReactionCount = (await this.reactionCountByAlbum('bad')).result
        .reaction_count;
      const reviewCount = (await this.reviewCountByAlbum()).result.review_count;

      if (
        goodReactionCount.isError ||
        mehReactionCount.isError ||
        badReactionCount.isError
      ) {
        throw new Error(
          goodReactionCount.error ||
            mehReactionCount.error ||
            badReactionCount.error,
        );
      }
      if (reviewCount.isError) {
        throw new Error(reviewCount.error);
      }

      const goodReactionPercentage = (goodReactionCount / reviewCount) * 100;
      const mehReactionPercentage = (mehReactionCount / reviewCount) * 100;
      const badReactionPercentage = (badReactionCount / reviewCount) * 100;

      return {
        isError: false,
        result: {
          goodReactionPercentage,
          mehReactionPercentage,
          badReactionPercentage,
        },
      };
    } catch (error) {
      console.log(error);
      return { isError: true, error };
    }
  }

  static async calculateReactionsByArtist(artistId) {
    try {
      const goodReactionCount = (
        await this.reactionCountByArtist('good', artistId)
      ).result.reaction_count;
      const mehReactionCount = (
        await this.reactionCountByArtist('meh', artistId)
      ).result.reaction_count;
      const badReactionCount = (
        await this.reactionCountByArtist('bad', artistId)
      ).result.reaction_count;
      const reviewCount = (await this.reviewCountByArtist(artistId)).result
        .review_count;

      if (
        goodReactionCount.isError ||
        mehReactionCount.isError ||
        badReactionCount.isError
      ) {
        throw new Error(
          goodReactionCount.error ||
            mehReactionCount.error ||
            badReactionCount.error,
        );
      }
      if (reviewCount.isError) {
        throw new Error(reviewCount.error);
      }

      const goodReactionPercentage = (goodReactionCount / reviewCount) * 100;
      const mehReactionPercentage = (mehReactionCount / reviewCount) * 100;
      const badReactionPercentage = (badReactionCount / reviewCount) * 100;

      return {
        isError: false,
        result: {
          goodReactionPercentage,
          mehReactionPercentage,
          badReactionPercentage,
        },
      };
    } catch (error) {
      console.log(error);
      return { isError: true, error };
    }
  }

  async addLike(userLogin) {
    try {
      console.log({
        userLogin,
        reviewId: this.id,
      });
      const result = await new ReviewLike({
        userLogin,
        reviewId: this.id,
      }).create();
      if (result.isError) {
        throw new Error('NEW_LIKE_ERROR');
      }
      return { isError: false };
    } catch (error) {
      console.log(error);
      return { isError: true, error };
    }
  }

  async getLikes() {
    try {
      const result = await new ReviewLike({
        reviewId: this.id,
      }).get();
      if (result.isError) {
        throw new Error('LIKES_NOT_RECEIVED');
      }
      return { isError: false, likes: result };
    } catch (error) {
      console.log(error);
      return { isError: true, error };
    }
  }

  async removeLike(userLogin) {
    try {
      const result = await new ReviewLike({
        userLogin,
        reviewId: this.id,
      }).remove();
      if (result.isError) {
        throw new Error('REMOVE_LIKE_ERROR');
      }
      return { isError: false };
    } catch (error) {
      console.log(error);
      return { isError: true, error };
    }
  }
}

module.exports = Review;
