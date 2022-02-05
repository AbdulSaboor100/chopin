import firebase, { firestore } from 'firebase'

const initialState = {
  gardeManger: [],
};

export default function gardeMangerReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_TO_GARDEMANGER':
      let stock = state.gardeManger
      let found = 0;
      for (let i = 0; i < stock.length; i++) {
        if (stock[i].id == action.payload.newItem.id) {
          found = 1;
          stock[i].product_quantity += action.payload.newItem.product_quantity;
        }
      }
      if (found == 1) {
        return {
          gardeManger: [...stock],
        };
      }
      let it = action.payload.newItem
      return {
        gardeManger: [it, ...stock],
      };

    case 'SET_GARDEMANGER':
      firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid)
        .collection("User").doc("user").update({ gardeManger: [...state.gardeManger] });
      return {
        gardeManger: action.payload,
      };

    case 'DELETE_GARDEMANGER': {
      let v = state.cart;
      return {
        gardeManger: [...v],
      };
    }


    case 'SAVE_TO_CLOUD_GM': {
      firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid)
        .collection("User").doc("user").update({ gardeManger: [...state.gardeManger] });
      return {
        gardeManger: [...state.gardeManger],

      }
    }
    case 'LOAD_LISTS_CLOUD_GM': {

      return {
        gardeManger: [...action.payload.gardeManger],


      }
    }
    default:
      return state;
  }
}
