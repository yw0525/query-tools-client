import { ipcMain } from 'electron';

export const initDBService = () => {
  ipcMain.on('connect', async (event, args) => {
    event.reply('connected', args);
  });
};

export default {};
