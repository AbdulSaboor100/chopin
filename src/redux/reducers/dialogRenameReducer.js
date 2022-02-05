const initialState = {
  isRenameVisible: false,
}

export default function dialogRenameReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_STATE_VISIBLE':
      return {
        isRenameVisible: action.payload
      }

    default:
      return state
  }
}