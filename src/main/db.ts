import { ipcMain } from 'electron';

const logger = require('electron-log');
const { createDataSource } = require('query-tools/lib');

let datasource;

export const initDBService = () => {
  // 初始化数据库连接
  ipcMain.on('connect', async (event, options) => {
    logger.info('[db connect]', options);

    datasource = createDataSource(options);
    datasource
      .initialize()
      .then(() => {
        logger.info('[db connect]', 'success');
        event.reply('connected');
      })
      .catch((error) => {
        logger.info('[db connect]', 'failed', error);
        event.reply('disconnected');
      });
  });

  // 执行 SQL
  ipcMain.on('execute', async (event, sqlStr) => {
    const result = await datasource.query(sqlStr);
    event.reply('executeResult', result);
  });

  // 关闭连接
  ipcMain.on('close', async () => {
    await datasource.destroy();
  });
};

export default {};
