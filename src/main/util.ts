/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { URL } from 'url';
import path from 'path';

// 本地文件路径
export let resolveHtmlPath: (htmlFileName: string) => string;

export enum OS {
  WIN64 = 'win64',
  WIN32 = 'win32',
}

// 本地 oracle 客户端路径
export let resolveOraclePath: (os: OS) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;

  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };

  resolveOraclePath = (os: string) => {
    return path.resolve(__dirname, '../..', `lib/instantclient_11_2/${os}`);
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };

  resolveOraclePath = (os: string) => {
    return path.resolve(
      __dirname,
      '../..',
      `resources/lib/instantclient_11_2/${os}`
    );
  };
}
