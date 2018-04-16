import { combineReducers } from 'redux';

import AppState from '~/modules/App/AppState';
import MenuState from '~/modules/Menu/MenuState';

export default combineReducers({
  AppState,
  MenuState
});
