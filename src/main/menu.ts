import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
} from 'electron';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'Query Tools',
      submenu: [
        {
          label: '退出',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: '视图',
      submenu: [
        {
          label: '刷新',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: '切换全屏',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: '开发者工具',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: '切换全屏',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
      ],
    };
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: '窗口',
      submenu: [
        {
          label: '最小化',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        { label: '关闭', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
      ],
    };
    const subMenuHelp: MenuItemConstructorOptions = {
      label: '帮助',
      submenu: [
        {
          label: '关于作者',
          click() {
            shell.openExternal('https://www.yueluo.club');
          },
        },
        {
          label: '文档',
          click() {
            shell.openExternal('https://github.com/yw0525/query-tools');
          },
        },
      ],
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd;

    return [subMenuAbout, subMenuView, subMenuWindow, subMenuHelp];
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '文件',
        submenu: [
          {
            label: '退出',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            },
          },
        ],
      },
      {
        label: '视图',
        submenu:
          // process.env.NODE_ENV === 'development' ||
          // process.env.DEBUG_PROD === 'true'
          //   ?
          [
            {
              label: '刷新',
              accelerator: 'Ctrl+R',
              click: () => {
                this.mainWindow.webContents.reload();
              },
            },
            {
              label: '切换全屏',
              accelerator: 'F11',
              click: () => {
                this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
              },
            },
            {
              label: '开发者工具',
              accelerator: 'Alt+Ctrl+I',
              click: () => {
                this.mainWindow.webContents.toggleDevTools();
              },
            },
          ],
        // : [
        //     {
        //       label: '切换全屏',
        //       accelerator: 'F11',
        //       click: () => {
        //         this.mainWindow.setFullScreen(
        //           !this.mainWindow.isFullScreen()
        //         );
        //       },
        //     },
        //   ],
      },
      {
        label: '帮助',
        submenu: [
          {
            label: '关于作者',
            click() {
              shell.openExternal('https://www.yueluo.club');
            },
          },
          {
            label: '文档',
            click() {
              shell.openExternal('https://github.com/yw0525/query-tools');
            },
          },
        ],
      },
    ];

    return templateDefault;
  }
}
