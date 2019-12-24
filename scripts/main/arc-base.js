const log = require('./logger');
const EventEmitter = require('events');
/**
 * Base class for other classes containing utility functions.
 */
class ArcBase extends EventEmitter {
  /**
   * @constructor
   */
  constructor() {
    super();
    this._ipcRequestId = 0;
    this._promises = [];
    this._debouncers = [];
    this._ipcPromiseCallback = this._ipcPromiseCallback.bind(this);
  }
  /**
   * Finds an index of a debounce function by it's name.
   *
   * @param {String} name Name of the debouncer.
   * @return {Number} Index of the debouncer. `-1` if not found.
   */
  _debounceIndex(name) {
    return this._debouncers.findIndex((item) => item.name === name);
  }
  /**
   * Prohibits execution of a task for some `time`.
   *
   * The task is executed at the end of this time.
   *
   * ```
   * this.debounce('ajax-call', function() {
   *  this.makeAjaxCall();
   * }, 2000);
   * ```
   *
   * @param {String} name Name of the task
   * @param {Function} callback A function to call.
   * @param {Number} time Number of milliseconds after which the task
   * is executed.
   */
  debounce(name, callback, time) {
    if (!this._debouncers) {
      this._debouncers = [];
    }
    const index = this._debounceIndex(name);
    if (index !== -1) {
      return;
    }
    const cancelId = setTimeout(() => {
      const index = this._debounceIndex(name);
      this._debouncers.splice(index, 1);
      callback.call(this);
    }, time);

    this._debouncers.push({
      name: name,
      id: cancelId
    });
  }
  /**
   * Cancels previously set debounce timer.
   *
   * @param {String} name Name of the task
   */
  cancelDebounce(name) {
    const index = this._debounceIndex(name);
    if (index === -1) {
      return;
    }
    const debounce = this._debouncers[index];
    clearTimeout(debounce.id);
    this._debouncers.splice(index, 1);
  }
  /**
   * Generates ID for the next IPC call with a promise.
   *
   * @return {Number} ID of the IPC call
   */
  nextIpcRequestId() {
    return ++this._ipcRequestId;
  }
  /**
   * Appends new Promise object to the list of promises.
   *
   * @param {Number} id ID of the IPC call
   * @return {Promise} Generated Promise object.
   */
  appendPromise(id) {
    const p = new Promise((resolve, reject) => {
      const obj = {
        id,
        resolve,
        reject
      };
      this._promises.push(obj);
    });
    return p;
  }
  /**
   * Callback function for IPC main event.
   *
   * @param {String} e
   * @param {String} id Id if generated promise.
   * @param {Boolean} isError Determines if resolved is error.
   * @param {?Array} args Arguments from the main process.
   */
  _ipcPromiseCallback(e, id, isError, ...args) {
    log.debug('Received IPC response for id', id, ', is error? ', isError, args);
    const index = this._promises.findIndex((p) => p.id === id);
    if (index === -1) {
      log.error('IPC promise for id', id, ' not found');
      throw new Error('Promise not found');
    }
    const promise = this._promises[index];
    this._promises.splice(index, 1);
    if (isError) {
      log.debug('Rejecting IPC promise');
      if (args.length === 1) {
        promise.reject(...args);
      } else {
        promise.reject(args);
      }
    } else {
      log.debug('Resolving IPC promise');
      if (args.length === 1) {
        promise.resolve(...args);
      } else {
        promise.resolve(args);
      }
    }
  }
}
exports.ArcBase = ArcBase;
