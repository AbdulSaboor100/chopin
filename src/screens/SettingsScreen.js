import React from 'react';
import {StyleSheet} from 'react-native';
import ReactNativeSettingsPage, {
  SectionRow,
  NavigateRow,
  SwitchRow,
} from 'react-native-settings-page';
import {connect} from 'react-redux';
import firebase from 'firebase';
import {
  mapStateToProps,
  mapDispatchToProps,
} from '../redux/actions/listesActions';
import {
  mapStateToPropsSettings,
  mapDispatchToPropsSettings,
} from '../redux/actions/settingsActions';
/**
 * Class to change user settings, synchronyze with cloud and log out
 */
class Settings extends React.Component {
  state = {
    check: false,
    switch: true,
    value: 40,
    isSetSync: false,
  };

  /**
   * Comes back to the main menu
   * 
   */
  _navigateToScreen = () => {
    const {navigation} = this.props;
    navigation.navigate('ShoppingList');
  };
  render() {
    return (
      <ReactNativeSettingsPage style={styles.container}>
        <SectionRow>
          <SwitchRow
            text="Synchronisation"
            iconName="cloud-upload"
            _value={this.props.isSetSync}
            _onValueChange={() => {
              this.setState({switch: !this.props.isSetSync});
              this.props.setSync(!this.state.switch);
            }}
          />

          <NavigateRow
            text="Déconnexion"
            iconName="sign-out"
            width={100}
            onPressCallback={() =>
            {
               this.props.saveToCloud();
              firebase.auth().signOut();
              }
             }
          />
        </SectionRow>
      </ReactNativeSettingsPage>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  connect(
    mapStateToPropsSettings,
    mapDispatchToPropsSettings,
  )(Settings),
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 10,
    height: 10,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
