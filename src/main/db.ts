import { ipcMain } from 'electron';

import { DataSource, DataSourceOptions } from 'typeorm';
import { DatabaseType } from '../typings';
import { OS, resolveOraclePath } from './util';

const oracledb = require('oracledb');
const logger = require('electron-log');

// 构建连接配置
const buildConnectOptions = (options: DataSourceOptions) => {
  switch (options.type) {
    case DatabaseType.ORACLE:
      options.serviceName = options.database;
      oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
      oracledb.initOracleClient({ libDir: resolveOraclePath(OS.WIN64) });
      return options;
      break;
    default:
      return options;
  }
};

export const dbService = () => {
  let datasource: DataSource;

  // init database
  ipcMain.on('connect', async (event, options: DataSourceOptions) => {
    const datasourceOptions = buildConnectOptions(options);

    logger.info('[db connect]', datasourceOptions);

    datasource = new DataSource(datasourceOptions);

    datasource
      .initialize()
      .then(() => {
        logger.info('[db connect]', 'success');
        event.reply('conn-status');
      })
      .catch((error) => {
        logger.info('[db connect]', 'failed', error);
        event.reply('conn-status', error);
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
    try {
      if (datasource.isInitialized) {
        await datasource.destroy();
        logger.info('[db disconnect]', 'success');
      }
    } catch (error) {
      logger.info('[db disconnect]', 'failed', error);
    }
  });
};

export default {};
