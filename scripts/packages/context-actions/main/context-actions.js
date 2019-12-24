const log = require('../../../main/logger');
/**
 * A class responsible for gathering information about registered context menu
 * actions and creating a configuration for opened windows.
 */
class ContextActions {
  /**
   * Registers application default actions on the window object.
   *
   * @param {Object} webContents A web contents object of the renderer process
   */
  registerDefaultActions(webContents) {
    log.debug('Registering window default context menu actions');
    this._addCloseTab(webContents);
    this._addCloseAllTabs(webContents);
    this._addCloseOtherTabs(webContents);
    this._addDuplicateTab(webContents);
  }
  /**
   * Adds default action to close request workspace tab.
   *
   * @param {Object} webContents
   */
  _addCloseTab(webContents) {
    webContents.send('register-context-action', {
      label: 'Close tab',
      selector: 'anypoint-tab > span.tab-name',
      action: 'request-panel-close-tab'
    });
  }
  /**
   * Adds default action to close all request workspace tab.
   *
   * @param {Object} webContents
   */
  _addCloseAllTabs(webContents) {
    webContents.send('register-context-action', {
      label: 'Close all tabs',
      selector: 'anypoint-tab > span.tab-name',
      action: 'request-panel-close-all-tabs'
    });
  }
  /**
   * Adds default action to close all request workspace tab.
   *
   * @param {Object} webContents
   */
  _addCloseOtherTabs(webContents) {
    webContents.send('register-context-action', {
      label: 'Close other tabs',
      selector: 'anypoint-tab > span.tab-name',
      action: 'request-panel-close-other-tabs'
    });
  }

  /**
   * Adds default action to close all request workspace tab.
   *
   * @param {Object} webContents
   */
  _addDuplicateTab(webContents) {
    webContents.send('register-context-action', {
      label: 'Duplicate tab',
      selector: 'anypoint-tab > span.tab-name',
      action: 'request-panel-duplicate-tab'
    });
  }
}
exports.ContextActions = ContextActions;
