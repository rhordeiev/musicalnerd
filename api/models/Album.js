const pool = require('../config/db/db');
const Review = require('./Review');

class Album {
  constructor({
    id = '',
    name = '',
    format = '',
    releaseDate = '',
    photo = '',
    genres = '',
    languages = '',
    credits = '',
    tracks = '',
    artistId = '',
  }) {
    this.id = id;
    this.name = name;
    this.photo = photo;
    this.format = format;
    this.releaseDate = releaseDate;
    this.genres = genres;
    this.languages = languages;
    this.credits = credits;
    this.tracks = tracks;
    this.artistId = artistId;
  }

  async create() {
    try {
      const result = await pool.query(`INSERT INTO album(
        name, format, release_date, photo, genres,
        languages, credits, tracks, artist_id)
        VALUES ('${this.name}', '${this.format}',
        '${this.releaseDate}', '${this.photo}', '${this.genres}',
        '${this.languages}', '${this.credits}', '${this.tracks}',
        '${this.artistId}') RETURNING id`);
      return { isError: false, result: result.rows[0] };
    } catch (error) {
      return { isError: true, error };
    }
  }

  async change() {
    try {
      if (this.photo === '') {
        await pool.query(`UPDATE album
        SET name='${this.name}', format='${this.format}', 
        release_date='${this.releaseDate}', genres='${this.genres}', 
        languages='${this.languages}', credits='${this.credits}', 
        tracks='${this.tracks}'
      WHERE id='${this.id}';`);
      } else {
        await pool.query(`UPDATE album
        SET name='${this.name}', format='${this.format}', 
        release_date='${this.releaseDate}', photo='${this.photo}', 
        genres='${this.genres}', languages='${this.languages}', 
        credits='${this.credits}', tracks='${this.tracks}'
      WHERE id='${this.id}';`);
      }
      return { isError: false };
    } catch (error) {
      return { isError: true, error };
    }
  }

  async delete() {
    try {
      const result = await pool.query(`DELETE FROM album
      WHERE id='${this.id}' RETURNING artist_id;`);
      return { isError: false, result: result.rows[0] };
    } catch (error) {
      return { isError: true, error };
    }
  }

  async findById() {
    try {
      const result = await pool.query(
        `SELECT album.id as album_id, album.name as album_name,
        album.format, album.release_date, album.photo as album_photo,
        album.genres as album_genres, album.languages, album.credits,
        album.tracks, album.artist_id, artist.name as artist_name
        FROM album
        JOIN artist ON artist.id=album.artist_id
        WHERE album.id='${this.id}'
        LIMIT 1`,
      );
      if (result.rowCount === 0) {
        throw new Error('ALBUM_NOT_FOUND');
      }
      return { isError: false, result: result.rows[0] };
    } catch (error) {
      return { isError: true, error };
    }
  }

  async getMark() {
    try {
      const result = await new Review({
        albumId: this.id,
      }).calculateAverageMarkByAlbum();
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
      const result = await new Review({
        albumId: this.id,
      }).calculateReactionsByAlbum();
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
        `SELECT id, name, photo FROM album
        WHERE name ~ '${this.name}'
        LIMIT ${limit} OFFSET ${offset}`,
      );
      if (result.rowCount === 0) {
        throw new Error('ALBUM_NOT_FOUND');
      }
      return { isError: false, result: result.rows };
    } catch (error) {
      return { isError: true, error };
    }
  }

  static async getPopular() {
    try {
      const count = await pool.query(
        `SELECT album.id, album.name, album.release_date, album.photo, COUNT(*) FROM album
        JOIN review ON album.id = review.album_id
        WHERE age(CURRENT_DATE, review.creation_date) < interval '7 days'
        GROUP BY album.id
        UNION SELECT album.id, album.name, album.release_date, album.photo, COUNT(*) * 0.5 FROM album
        JOIN review ON album.id = review.album_id
        JOIN review_like ON review.id = review_like.review_id
        WHERE age(CURRENT_DATE, review.creation_date) < interval '7 days'
        GROUP BY album.id`,
      );

      const albums = count.rows;
      const ids = [];

      albums.forEach((elem) => {
        ids.push(elem.id);
      });

      const uniqueIds = [...new Set(ids)];

      const albumsWithRating = [];

      for (let i = 0; i < uniqueIds.length; i += 1) {
        let sum = 0;
        for (let j = 0; j < albums.length; j += 1) {
          if (uniqueIds[i] === albums[j].id) {
            sum += parseFloat(albums[j].count, 10);
          }
        }
        let albumInfo = {};
        for (let j = 0; j < albums.length; j += 1) {
          if (uniqueIds[i] === albums[j].id) {
            albumInfo = {
              name: albums[j].name,
              release_date: albums[j].release_date,
              photo: albums[j].photo,
            };
          }
        }
        albumsWithRating.push({ id: uniqueIds[i], count: sum, ...albumInfo });
      }

      return { isError: false, result: albumsWithRating };
    } catch (error) {
      return { isError: true, error };
    }
  }

  static async getNearest() {
    try {
      const result = await pool.query(
        `SELECT id, name, release_date, photo
        FROM album
        WHERE age(release_date, CURRENT_DATE) < interval '7 days' 
        AND age(release_date, CURRENT_DATE) > interval '0 days' `,
      );

      return { isError: false, result: result.rows };
    } catch (error) {
      return { isError: true, error };
    }
  }
}

module.exports = Album;
