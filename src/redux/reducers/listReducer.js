
import firebase from 'firebase'

const initialState = {

  lists: [],
  lastIdSelected: ''
}



/**
 * Application reducer.
 * @param {Object} state
 */
export default function listReducer(state = initialState, action) {

  switch (action.type) {

    case 'SET_ID_SELECTED':
      return {
        lists: [...state.lists],
        lastIdSelected: action.payload,
      }

    case 'ADD_TO_LISTS': {
      if (action.payload.title == NaN | action.payload.title == undefined | action.payload.title == "") {
        action.payload.title="Liste"
      }
       
      return {
        lists: [action.payload, ...state.lists],
        lastIdSelected: state.lastIdSelected

      }
    }

    case 'LOAD_LISTS_CLOUD': {

      return {
        lists: [...action.payload.lists],
        lastIdSelected: state.lastIdSelected

      }
    }
    case 'SAVE_TO_CLOUD': {
      firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid)
        .collection("User").doc("user").update({ lists: [...state.lists] });
      return {
        lists: [...state.lists],
        lastIdSelected: state.lastIdSelected

      }
    }


    case 'DELETE_ITEM_LIST':
      var Tmp = state.lists;
      for (let i = 0; i < Tmp.length; i++) {
        if (Tmp[i].id == action.payload) {
          Tmp.splice(i, 1);
        }
      }
 

      return {
        lists: [...Tmp],
        lastIdSelected: state.lastIdSelected

      }

    case 'RENAME_ITEM_LIST':
      var Tmp = state.lists;
      for (let i = 0; i < Tmp.length; i++) {
        if (Tmp[i].id == state.lastIdSelected) {
          Tmp[i].title = action.payload;
        }
      }
      return {
        lists: [...Tmp],
        lastIdSelected: state.lastIdSelected

      }

    case 'ADD_TO_CART':

      action.payload.newItem["product_quantity"] = action.payload.quantity;
      let found = 0;
      var addItem = state.lists.filter(x => x.id == action.payload.id_list).map((y) => {


        for (let i = 0; i < y.cart.length; i++) {

          if (action.payload.newItem.id == y.cart[i].id) {
            found = 1;
            action.payload.newItem.quantity += action.payload.quantity;
            y.cart[i].product_quantity += action.payload.quantity;
          }

        }
        if (found == 0) {
          y.cart.push(action.payload.newItem);
          y.numberItems += 1;

        }

        return y;
      })
      var otherLists = state.lists.filter(x => x.id != action.payload.id_list)

      return {
        lists: [...addItem, ...otherLists],
        lastIdSelected: state.lastIdSelected

      };

    case 'DELETE_ITEM_CART': {

      var Tmp = state.lists;
      for (let i = 0; i < Tmp.length; i++) {
        if (Tmp[i].id == state.lastIdSelected) {

          for (let j = 0; j < Tmp[i].cart.length; j++){
            if (Tmp[i].cart[j].id == action.payload.id) {              
              if (Tmp[i].cart[j].isSelected) {
                Tmp[i].cart = Tmp[i].cart.filter(x => x.id != action.payload.id);
                Tmp[i].numberItems -= 1;
                Tmp[i].numberChecked -= 1;


              }
              else {
                if (Tmp[i].cart[j].product_quantity > 1) {
                  Tmp[i].cart[j].product_quantity -= 1;
                }
                else {

                  Tmp[i].cart = Tmp[i].cart.filter(x => x.id != action.payload.id);
                  Tmp[i].numberItems -= 1;

                }
              }
             
            }
          }

          Tmp[i].cart.numberItems -= 1;


        }
      }


      return {
        lists: [...Tmp],
        lastIdSelected: state.lastIdSelected

      }
    }
    case 'CHECK_UNCHECK_ITEM': {

      var Tmp = state.lists;
      for (let i = 0; i < Tmp.length; i++) {
        if (Tmp[i].id == state.lastIdSelected) {

          for (let k = 0; k < Tmp[i].cart.length; k++) {

            if (Tmp[i].cart[k].id == action.payload.item.id) {

              if (action.payload.item.isSelected == false) {

                Tmp[i].cart[k].isSelected = true;
                Tmp[i].numberChecked += 1; 
              }

              else {
                Tmp[i].cart[k].isSelected = false;
                Tmp[i].numberChecked -= 1;


              }
            }
          }
        }
      }


      return {
        lists: [...Tmp],
        lastIdSelected: state.lastIdSelected
      }
    }
    case 'SWAP_LISTS':
      var Tmp = [...state.lists];
      var index;
      for (let i = 0; i < Tmp.length; i++) {
        if (Tmp[i].id == state.lastIdSelected) {
          index = i;
        }
      }
      var nbMove = action.payload;
      if (index + action.payload < 0) {
        nbMove = -index;
      }
      if (index + action.payload >= Tmp.length) {
        nbMove = Tmp.length - 1 - index;
      }
      var save = Tmp[index];
      if (nbMove >= 0) {
        for (let i = index; i < index + nbMove; i++) {
          Tmp[i] = Tmp[i + 1];
        }
      }
      else {
        for (let i = index; i > index + nbMove; i--) {
          Tmp[i] = Tmp[i - 1];
        }
      }
      Tmp[index + nbMove] = save;

      return {
        lists: [...Tmp],
        lastIdSelected: state.lastIdSelected
      }

    default:
      return state


  }
}