const pool = require('../config/db/db');
const Message = require('./Message');

class ArtistMessage extends Message {
  constructor({ id = '', userLogin = '', artistId = '', message = '' }) {
    super({
      id,
      userLogin,
      message,
    });
    this.artistId = artistId;
  }

  async create() {
    try {
      const result = await pool.query(`INSERT INTO artist_message(
        user_login, artist_id, message)
        VALUES ('${this.userLogin}', '${this.artistId}',
         '${this.message}') RETURNING id`);
      return { isError: false, result: result.rows[0] };
    } catch (error) {
      return { isError: true, error };
    }
  }

  async getAll() {
    try {
      const result = await pool.query(
        `SELECT artist_message.id, login, message, creation_time, avatar FROM artist_message
        JOIN user_account ON artist_message.user_login = user_account.login
        WHERE artist_id='${this.artistId}'`,
      );
      if (result.rowCount === 0) {
        throw new Error('MESSAGES_NOT_FOUND');
      }
      return { isError: false, result: result.rows };
    } catch (error) {
      return { isError: true, error };
    }
  }

  async delete() {
    try {
      await pool.query(`DELETE FROM artist_message
        WHERE id='${this.id}'`);
      return { isError: false };
    } catch (error) {
      return { isError: true, error };
    }
  }
}

module.exports = ArtistMessage;
