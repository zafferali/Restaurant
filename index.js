/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import store from './src/redux/store';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';

LogBox.ignoreLogs(['ReactImageView: Image source "null" doesn\'t exist'])

const Root = () => (
    <Provider store={store}>
      <App />
    </Provider>
  );
  
AppRegistry.registerComponent(appName, () => Root)
