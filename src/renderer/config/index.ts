import { DatabaseType } from '../../typings';

export const DATEBASE_CONNECTION_LIST = [
  {
    label: 'MySQL',
    value: DatabaseType.MYSQL,
  },
  {
    label: 'SQL Server',
    value: DatabaseType.SQL_SERVER,
  },
  {
    label: 'SQL Server 2000',
    value: DatabaseType.SQL_SERVER_2000,
  },
  {
    label: 'Oracle',
    value: DatabaseType.ORACLE,
  },
  {
    label: 'Sybase',
    value: DatabaseType.SYBASE,
  },
];

export default {};
