

export function mapStateToPropsSettings(state) {
  return {
    isSetSync: state.settingsReducer.isSetSync,
    frequenceSync: state.settingsReducer.frequenceSync,
  }
}


export function mapDispatchToPropsSettings(dispatch) {
  return {
    setSync: (sync) => dispatch({
      type: 'SET_SYNC',
      payload:  sync
    }),
  }
}