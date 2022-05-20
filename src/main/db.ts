import { ipcMain } from 'electron';

import { DataSource, DataSourceOptions } from 'typeorm';
import { DatabaseType } from '../typings';
import { OS, resolveOraclePath } from './util';

const oracledb = require('oracledb');
const logger = require('electron-log');

// 构建连接参数
const buildConnectOptions = (options: DataSourceOptions) => {
  let oracleLibDir;

  try {
    switch (options.type) {
      case DatabaseType.ORACLE:
        oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

        oracledb.initOracleClient({
          libDir: ((oracleLibDir = resolveOraclePath(OS.WIN64)), oracleLibDir),
        });

        return {
          serviceName: options.database,
          ...options,
        };
      default:
        return options;
    }
  } catch (error) {
    logger.info('[db pre connect]', error);
    return options;
  }
};

export const dbService = () => {
  let datasource: DataSource;

  // 初始化数据库
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

  // 执行 SQL
  ipcMain.on('execute', async (event, sqlStr) => {
    const result = await datasource.query(sqlStr);
    logger.info('[db execute]', result);
    event.reply('result', result);
  });

  // 关闭数据库
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
