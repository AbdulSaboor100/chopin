const initialState = {
  isSetSync: true,
}

export default function settingsReducer(state = initialState, action) {

  switch (action.type) {
    case 'SET_SYNC':
      {   
        if (state.isSetSync == true) {
          return {
            isSetSync: false
          }
        }
        return {
          isSetSync: true,
        }
      }

    default:
      return state
  }
}