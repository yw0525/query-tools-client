import { ipcMain } from 'electron';

const logger = require('electron-log');
const { createDataSource } = require('query-tools/lib');

export const dbService = () => {
  let datasource;

  // init database
  ipcMain.on('connect', async (event, options) => {
    logger.info('[db connect]', options);

    datasource = createDataSource(options);

    datasource
      .initialize()
      .then(() => {
        logger.info('[db connect]', 'success');
        event.reply('conn-status', true);
      })
      .catch((error) => {
        logger.info('[db connect]', 'failed', error);
        event.reply('conn-status', false);
      });
  });

  // execute sql
  ipcMain.on('execute', async (event, sqlStr) => {
    const result = await datasource.query(sqlStr);
    logger.info('[db execute]', result);
    event.reply('result', result);
  });

  // close database
  ipcMain.on('disconnect', async () => {
    await datasource.destroy();
  });
};

export default {};
