import firebase from 'firebase';

export function mapStateToProps(state) {
  return {
    lists: state.listReducer.lists,
    lastIdSelected: state.listReducer.lastIdSelected,
    cart: state.listReducer.cart,
    gardeManger: state.gardeMangerReducer.gardeManger,
    isRenameVisible: state.dialogRenameReducer.isRenameVisible,
  };
}


export function fetchUser() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('User')
      .doc('user')
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          dispatch({ type: 'LOAD_LISTS_CLOUD', payload: snapshot.data() });
          dispatch({ type: 'LOAD_LISTS_CLOUD_GM', payload: snapshot.data() });

        } else {
        }
      });
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    loadListsFromCloud: () => dispatch(fetchUser()),
    saveToCloud: (isSetSync) =>
      dispatch({
        type: 'SAVE_TO_CLOUD',
        payload: isSetSync,
      }),
    saveToCloudGm: (isSetSync) =>
      dispatch({
        type: 'SAVE_TO_CLOUD_GM',
        payload: isSetSync,
      }),
    addToLists: (newItem) =>
      dispatch({
        type: 'ADD_TO_LISTS',
        payload: newItem,
      }),
    removeToLists: (id) =>
      dispatch({
        type: 'DELETE_ITEM_LIST',
        payload: id,
      }),
    renameToLists: (text) =>
      dispatch({
        type: 'RENAME_ITEM_LIST',
        payload: text,
      }),
    addToCart: (newItem, id_list, quantity) =>
      dispatch({
        type: 'ADD_TO_CART',
        payload: { newItem, id_list, quantity },
      }),
    deleteItemCart: (id, id_list) =>
      dispatch({
        type: 'DELETE_ITEM_CART',
        payload: { id, id_list },
      }),
    addToGardeManger: (newItem) =>
      dispatch({
        type: 'ADD_TO_GARDEMANGER',
        payload: { newItem },
      }),
    setGardeManger: (items) =>
      dispatch({
        type: 'SET_GARDEMANGER',
        payload: items,
      }),
    deleteGardeManger: (id) =>
      dispatch({
        type: 'DELETE_GARDEMANGER',
        payload: { id },
      }),
    setIdSelected: (id) =>
      dispatch({
        type: 'SET_ID_SELECTED',
        payload: id,
      }),
    setDialogRenameVisible: (stateVisible) =>
      dispatch({
        type: 'SET_STATE_VISIBLE',
        payload: stateVisible,
      }),
    swapLists: (infoMove) =>
      dispatch({
        type: 'SWAP_LISTS',
        payload: infoMove,
      }),
    checkUncheckItem: (item, value) =>
      dispatch({
        type: 'CHECK_UNCHECK_ITEM',
        payload: { item, value },
      }),
  };
}
