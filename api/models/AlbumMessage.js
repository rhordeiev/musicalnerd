const pool = require('../config/db/db');
const Message = require('./Message');

class AlbumMessage extends Message {
  constructor({ id = '', userLogin = '', albumId = '', message = '' }) {
    super({
      id,
      userLogin,
      message,
    });
    this.albumId = albumId;
  }

  async create() {
    try {
      const result = await pool.query(`INSERT INTO album_message(
        user_login, album_id, message)
        VALUES ('${this.userLogin}', '${this.albumId}',
         '${this.message}') RETURNING id`);
      return { isError: false, result: result.rows[0] };
    } catch (error) {
      return { isError: true, error };
    }
  }

  async getAll() {
    try {
      const result = await pool.query(
        `SELECT album_message.id, login, message, creation_time, avatar FROM album_message
        JOIN user_account ON album_message.user_login = user_account.login
        WHERE album_id='${this.albumId}'`,
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
      await pool.query(`DELETE FROM album_message
        WHERE id='${this.id}'`);
      return { isError: false };
    } catch (error) {
      return { isError: true, error };
    }
  }
}

module.exports = AlbumMessage;
