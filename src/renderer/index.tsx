import { render } from 'react-dom';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import App from './App';

render(
  <ChakraProvider>
    <CSSReset />
    <App />
  </ChakraProvider>,
  document.getElementById('root')
);
