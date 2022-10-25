const pool = require('../config/db/db');
const Review = require('./Review');

class Artist {
  constructor({
    id = '',
    name = '',
    photo = '',
    genres = '',
    links = '',
    info = '',
  }) {
    this.id = id;
    this.name = name;
    this.photo = photo;
    this.genres = genres;
    this.links = links;
    this.info = info;
  }

  async create() {
    try {
      const result = await pool.query(`INSERT INTO artist(
        name, photo, genres, links, info)
        VALUES ('${this.name}', '${this.photo}', '${this.genres}',
        '${this.links}', '${this.info}') RETURNING id`);
      return { isError: false, result: result.rows[0] };
    } catch (error) {
      return { isError: true, error };
    }
  }

  async change() {
    try {
      if (this.photo === '') {
        await pool.query(`UPDATE artist
      SET name='${this.name}', genres='${this.genres}', 
      links='${this.links}', info='${this.info}'
      WHERE id='${this.id}';`);
      } else {
        await pool.query(`UPDATE artist
      SET name='${this.name}', photo='${this.photo}', 
      genres='${this.genres}', links='${this.links}', 
      info='${this.info}'
      WHERE id='${this.id}';`);
      }
      return { isError: false };
    } catch (error) {
      return { isError: true, error };
    }
  }

  async delete() {
    try {
      await pool.query(`DELETE FROM artist
      WHERE id='${this.id}';`);
      return { isError: false };
    } catch (error) {
      return { isError: true, error };
    }
  }

  async findById() {
    try {
      const result = await pool.query(
        `SELECT * FROM artist WHERE id='${this.id}' LIMIT 1`,
      );
      const reviewCount = await Review.reviewCountByArtist(this.id);
      result.rows[0].reviewCount = reviewCount.result.review_count;
      if (result.rowCount === 0) {
        throw new Error('ARTIST_NOT_FOUND');
      }
      return { isError: false, result: result.rows[0] };
    } catch (error) {
      return { isError: true, error };
    }
  }

  async findAlbumsById() {
    try {
      const result = await pool.query(
        `SELECT album.id, album.name, album.release_date, album.photo FROM album
        JOIN artist ON artist.id=album.artist_id
        WHERE artist.id='${this.id}'
        ORDER BY album.release_date DESC`,
      );
      if (result.rowCount === 0) {
        throw new Error('ARTIST_NOT_FOUND');
      }
      return { isError: false, result: result.rows };
    } catch (error) {
      return { isError: true, error };
    }
  }

  async getMark() {
    try {
      const result = await Review.calculateAverageMarkByArtist(this.id);
      if (result.rowCount === 0) {
        throw new Error('MARK_NOT_FOUND');
      }
      return { isError: false, result };
    } catch (error) {
      return { isError: true, error };
    }
  }

  async getReactions() {
    try {
      const result = await Review.calculateReactionsByArtist(this.id);
      if (!result.result) {
        throw new Error('REACTIONS_NOT_FOUND');
      }
      return { isError: false, result };
    } catch (error) {
      return { isError: true, error };
    }
  }

  async searchByName(limit, offset) {
    try {
      const result = await pool.query(
        `SELECT id, name, photo FROM artist
        WHERE name ~ '${this.name}'
        LIMIT ${limit} OFFSET ${offset}`,
      );
      if (result.rowCount === 0) {
        throw new Error('ARTIST_NOT_FOUND');
      }
      return { isError: false, result: result.rows };
    } catch (error) {
      return { isError: true, error };
    }
  }

  static async getPopular() {
    try {
      const count = await pool.query(
        `SELECT artist.id, artist.name, artist.photo, COUNT(*) FROM album
        JOIN review ON album.id = review.album_id
        JOIN artist ON artist.id = album.artist_id
        WHERE age(CURRENT_DATE, review.creation_date) < interval '7 days'
        GROUP BY artist.id
        UNION SELECT artist.id, artist.name, artist.photo, COUNT(*) * 0.5 FROM album
        JOIN review ON album.id = review.album_id
        JOIN artist ON artist.id = album.artist_id
        JOIN review_like ON review.id = review_like.review_id
        WHERE age(CURRENT_DATE, review.creation_date) < interval '7 days'
        GROUP BY artist.id`,
      );

      const artists = count.rows;
      const ids = [];

      artists.forEach((elem) => {
        ids.push(elem.id);
      });

      const uniqueIds = [...new Set(ids)];

      const albumsWithRating = [];

      for (let i = 0; i < uniqueIds.length; i += 1) {
        let sum = 0;
        for (let j = 0; j < artists.length; j += 1) {
          if (uniqueIds[i] === artists[j].id) {
            sum += parseFloat(artists[j].count, 10);
          }
        }
        let artistInfo = {};
        for (let j = 0; j < artists.length; j += 1) {
          if (uniqueIds[i] === artists[j].id) {
            artistInfo = {
              name: artists[j].name,
              photo: artists[j].photo,
            };
          }
        }
        albumsWithRating.push({ id: uniqueIds[i], count: sum, ...artistInfo });
      }

      return { isError: false, result: albumsWithRating };
    } catch (error) {
      return { isError: true, error };
    }
  }
}

module.exports = Artist;
