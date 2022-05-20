import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import {
  FormControl,
  FormLabel,
  Input,
  Center,
  Button,
  ButtonGroup,
  Select,
  useToast,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { DATEBASE_CONNECTION_LIST } from './config';

import './App.css';

const { electron } = window;

const Main = () => {
  const toast = useToast();

  const handleConnect = (options, callback) => {
    electron.ipcRenderer.once('conn-status', (error) => {
      callback();

      electron.ipcRenderer.disconnect();

      if (error) {
        toast({
          position: 'top',
          title: '连接失败!',
          status: 'error',
          isClosable: true,
        });
        return;
      }

      toast({
        position: 'top',
        title: '连接成功!',
        status: 'success',
        isClosable: true,
      });
    });

    electron.ipcRenderer.connect(options);
  };

  return (
    <Center mt="20">
      <Formik
        initialValues={{
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          database: 'test',
          username: 'root',
          password: '123456',
        }}
        onSubmit={(values, actions) => {
          handleConnect(values, () => {
            actions.setSubmitting(false);
          });
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <FormControl width="80" mb="4" isRequired>
              <FormLabel htmlFor="type">数据库类型</FormLabel>
              <Select
                size="sm"
                id="type"
                placeholder="选择数据库类型"
                onChange={handleChange}
                value={values.type}
              >
                {DATEBASE_CONNECTION_LIST.map((type) => (
                  <option key={type.label} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl width="80" mb="4" isRequired>
              <FormLabel htmlFor="host">服务器地址</FormLabel>
              <Input
                size="sm"
                id="host"
                type="text"
                placeholder="输入服务器地址"
                onChange={handleChange}
                value={values.host}
              />
            </FormControl>
            <FormControl width="80" mb="4" isRequired>
              <FormLabel htmlFor="port">端口</FormLabel>
              <Input
                size="sm"
                id="port"
                type="number"
                placeholder="输入端口"
                onChange={handleChange}
                value={values.port}
              />
            </FormControl>
            <FormControl width="80" mb="4" isRequired>
              <FormLabel htmlFor="database">数据库名</FormLabel>
              <Input
                size="sm"
                id="database"
                type="text"
                placeholder="输入数据库名"
                onChange={handleChange}
                value={values.database}
              />
            </FormControl>
            <FormControl width="80" mb="4" isRequired>
              <FormLabel htmlFor="username">账户</FormLabel>
              <Input
                size="sm"
                id="username"
                type="text"
                placeholder="输入账户"
                onChange={handleChange}
                value={values.username}
              />
            </FormControl>
            <FormControl width="80" mb="4">
              <FormLabel htmlFor="password">密码</FormLabel>
              <Input
                size="sm"
                id="password"
                type="text"
                placeholder="输入密码"
                onChange={handleChange}
                value={values.password}
              />
            </FormControl>
            <ButtonGroup>
              <Button
                fontSize="small"
                mt={4}
                colorScheme="teal"
                type="submit"
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                正常连接
              </Button>
              <Button
                fontSize="sm"
                mt={4}
                colorScheme="gray"
                type="submit"
                disabled={isSubmitting}
              >
                免密连接
              </Button>
            </ButtonGroup>
          </Form>
        )}
      </Formik>
    </Center>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}
