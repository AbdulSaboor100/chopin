import {combineReducers} from 'redux';
import listReducer from './listReducer';
import settingsReducer from './settingsReducer';
import gardeMangerReducer from './gardeMangerReducer';

import dialogRenameReducer from './dialogRenameReducer';

export default combineReducers({
  listReducer,
  dialogRenameReducer,
  settingsReducer,
  gardeMangerReducer,
});
