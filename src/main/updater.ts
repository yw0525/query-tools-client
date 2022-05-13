/**
 * @file updater
 */

import { autoUpdater } from 'electron-updater';
import logger from 'electron-log';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';

    autoUpdater.logger = logger;

    autoUpdater.checkForUpdatesAndNotify();
  }
}
