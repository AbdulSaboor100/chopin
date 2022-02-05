import 'localstorage-polyfill';
import { createStore, applyMiddleware } from 'redux';
import thunk from "redux-thunk"
import rootReducer from '../reducers/index'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persistStore, persistReducer } from 'redux-persist'


const persistConfig = {
  key: 'root',
  storage: AsyncStorage
};


const persistedReducer = persistReducer(persistConfig, rootReducer);
  export const store = createStore(persistedReducer,applyMiddleware(thunk));
  export const persistor = persistStore(store);


/**
 * Function that saves data to local storage
 * @param {Object} state 
 */
export function saveToLocalStorage(state) {
  try {
    // localStorage.removeItem("persistantState")
    const serialisedState = JSON.stringify(state);
    localStorage.setItem("persistantState", serialisedState);
    //  AsyncStorage.removeItem("persist:root" , (error)=>{
    //   console.log(error,"removing error");
    // })

    //  AsyncStorage.getItem("persist:root", (error , result)=>{
    //   let item = JSON.parse(result)
    //   let data = JSON.parse(item.listReducer);
    //   console.log(data,"parse full data");
    // })

  } catch (e) {
    console.warn(e);
  }
}

// load string from localStarage and convert into an Object
// invalid output must be undefined
/**
 * load string from localStarage and convert into an Object
 * invalid output must be undefined
 * @returns storedData
 */
export function loadFromLocalStorage() {
  try {
    const serialisedState = localStorage.getItem("persistantState");
    if (serialisedState === null) return undefined;
    return JSON.parse(serialisedState);
  } catch (e) {
    console.warn(e);
    return undefined;
  }
}



/**
 * constant that loads data from local storage into the reducer
 * it is mainly used in the provider wrapper in App.js in order 
 * to pass the reducer to the general props
 * @param  {Objecct} rootReducer
 * @param  {Method} loadFromLocalStorage(
 */
//export const store = createStore(rootReducer, applyMiddleware(thunk));
/*
* This is a change listener. 
* It will be called any time an action is dispatched
*  and the data will be stored as a result.
*/
store.subscribe(() => saveToLocalStorage(store.getState()));

// this log is used to show the state of the store object
