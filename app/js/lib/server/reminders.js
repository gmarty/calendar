'use strict';

const p = Object.freeze({
  api: Symbol('api'),
  settings: Symbol('settings'),
});

export default class Reminders {
  constructor(api, settings) {
    this[p.api] = api;
    this[p.settings] = settings;

    Object.seal(this);
  }

  /**
   * Retrieves the list of the reminders.
   *
   * @return {Promise<Array>} A promise that resolves with an array of objects.
   */
  getAll() {
    return this[p.api].get('reminders');
  }

  /**
   * Gets a reminder given its id.
   *
   * @param {string} id Id of the reminder to retrieve.
   * @return {Promise}
   */
  get(id) {
    return this[p.api].get(`reminders/${id}`);
  }

  /**
   * Create a new reminder.
   *
   * @param {Object} body
   * @returns {Promise}
   */
  set(body) {
    return this[p.api].post(`reminders`, body);
  }
}
