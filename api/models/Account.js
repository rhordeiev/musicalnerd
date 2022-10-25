const pool = require('../config/db/db');
const Album = require('./Album');
const Artist = require('./Artist');

class Account {
  constructor({
    login = '',
    password = '',
    name = '',
    surname = '',
    gender = '',
    birthDate = '',
    email = '',
    additionalContactInfo = '',
    country = '',
    city = '',
    additionalInfo = '',
    avatar = '',
  }) {
    this.login = login;
    this.password = password;
    this.name = name;
    this.surname = surname;
    this.gender = gender;
    this.birthDate = birthDate;
    this.email = email;
    this.additionalContactInfo = additionalContactInfo;
    this.country = country;
    this.city = city;
    this.country = country;
    this.additionalInfo = additionalInfo;
    this.avatar = avatar;
  }

  async userExists() {
    try {
      const result = await pool.query(
        `SELECT COUNT(*) as count FROM user_account WHERE login='${this.login}'`,
      );
      const userCount = parseInt(result.rows[0].count, 10);
      if (userCount === 0) {
        return false;
      }
      return true;
    } catch (error) {
      return error;
    }
  }

  async create() {
    try {
      const userExists = await this.userExists(this.login);
      if (userExists) throw new Error('Користувач з таким логіном вже існує');
      const result = await pool.query(`INSERT INTO user_account(
        login, password, name, surname, gender, birthdate,
        email, additional_contact_info, country, city,
        additional_info, avatar, user_role)
        VALUES ('${this.login}', '${this.password}', '${this.name}',
        '${this.surname}', '${this.gender}', '${this.birthDate}',
        '${this.email}', '${this.additionalContactInfo}', '${this.country}',
        '${this.city}', '${this.additionalInfo}', '${this.avatar}',
        '${this.userRole}') RETURNING *`);
      return { isError: false, user: result.rows[0] };
    } catch (error) {
      return { isError: true, error };
    }
  }

  async change(enteredLogin) {
    try {
      if (enteredLogin !== this.login) {
        const userExists = await this.userExists(this.login);
        if (userExists) throw new Error('Користувач з таким логіном вже існує');
      }
      await pool.query(`UPDATE user_account
        SET login='${this.login}', password='${this.password}', 
        name='${this.name}', surname='${this.surname}', gender='${this.gender}', 
        birthdate='${this.birthDate}', email='${this.email}', 
        additional_contact_info='${this.additionalContactInfo}', 
        country='${this.country}', city='${this.city}', 
        additional_info='${this.additionalInfo}', avatar='${this.avatar}'
      WHERE login='${enteredLogin}';`);
      return { isError: false };
    } catch (error) {
      return { isError: true, error };
    }
  }

  async delete() {
    try {
      await pool.query(`DELETE FROM user_account
      WHERE login='${this.login}';`);
      return { isError: false };
    } catch (error) {
      return { isError: true, error };
    }
  }

  async findByLogin() {
    try {
      const result = await pool.query(
        `SELECT * FROM user_account WHERE login='${this.login}' LIMIT 1`,
      );
      if (result.rowCount === 0) {
        throw new Error('USER_NOT_FOUND');
      }
      return { isError: false, result: result.rows[0] };
    } catch (error) {
      return { isError: true, error };
    }
  }

  static async searchAlbums(name, limit, offset) {
    try {
      const result = await new Album({ name }).searchByName(limit, offset);
      if (result.isError) {
        throw new Error(result.error.message);
      }
      return { isError: false, result };
    } catch (error) {
      return { isError: true, error };
    }
  }

  static async searchArtists(name, limit, offset) {
    try {
      const result = await new Artist({ name }).searchByName(limit, offset);
      if (result.isError) {
        throw new Error(result.error.message);
      }
      return { isError: false, result };
    } catch (error) {
      return { isError: true, error };
    }
  }

  static async searchByName(login, limit, offset) {
    try {
      const result = await pool.query(
        `SELECT login, avatar FROM user_account
        WHERE login ~ '${login}' AND user_role = 'user'
        LIMIT ${limit} OFFSET ${offset}`,
      );
      if (result.rowCount === 0) {
        throw new Error('USER_NOT_FOUND');
      }
      return { isError: false, result: result.rows };
    } catch (error) {
      return { isError: true, error };
    }
  }
}

module.exports = Account;
