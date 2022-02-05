import * as React from 'react';
import {Alert, Text, View, StyleSheet, Modal} from 'react-native';
import DialogInput from 'react-native-dialog-input';
import * as Permissions from 'expo-permissions';
import {OpenFoodFactsApi} from 'openfoodfac-ts';
import {connect} from 'react-redux';
import {
  mapStateToProps,
  mapDispatchToProps,
} from '../redux/actions/listesActions';
import {BarCodeScanner} from 'expo-barcode-scanner';

const openFoodFactsApi = new OpenFoodFactsApi();

/**
 * This class implements the scanning features
 *
 *  @see https://docs.google.com/document/d/12vbFsvk-hLTKwN6IE-TMI164qkPLLNUUp2hQcukp92s/edit
 */
class ScannerScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    scanned: false,
    notAdded: true,
    product: '',
    dialogIsVisible: false,
    confirmVisible: false,
    lastProductSelected: {},
  };

  /**
   * Wait for the mounting of the component before asking for authorization
   */
  async componentDidMount() {
    this.getPermissionsAsync();
  }

  /**
   * Get permissions from user
   */
  getPermissionsAsync = async () => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});
  };

  /**
   * Alert a modal confirming the addition of the product and asking the user if he wants to come back to his current list.
   */
  backToList = () => {
    Alert.alert(
      this.state.product.product_name + ' ajouté',
      'Souhaitez-vous retourner dans la liste ?',
      [
        {
          text: 'Annuler',
          onPress: () => this.setState({scanned: false}),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => this.props.navigation.navigate('ListArticleScreen'),
        },
      ],
      {cancelable: false},
    );
  };


  /**
   * Alert a modal confirming the cancellation of the action and asking the user if he wants to come back to his current list.
   */
  backToListNoAddition = () => {
    Alert.alert(
      'Action annulée',
      'Souhaitez-vous retourner dans la liste ?',
      [
        {
          text: 'Annuler',
          onPress: () => this.setState({scanned: false}),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => this.props.navigation.navigate('ListArticleScreen'),
        },
      ],
      {cancelable: false},
    );
  };

  render() {
    const {hasCameraPermission, scanned, notAdded} = this.state;

    if (hasCameraPermission === null) {
      return <Text>Demande d'autorisation pour utiliser la caméra</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>Pas d'acccès à la caméra</Text>;
    }
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <DialogInput
          isDialogVisible={this.state.dialogIsVisible}
          title="Quantité"
          hintInput="1"
          submitText="Ajouter"
          cancelText="Annuler"
          textInputProps={{keyboardType: 'numeric'}}
          submitInput={(inputText) => {
            if (
              (inputText == NaN) |
              (inputText == undefined) |
              (inputText == '')
            ) {
              inputText = 1;
            }
            this.props.addToCart(
              this.state.lastProductSelected,
              this.props.route.params.id_list,
              parseInt(inputText, 10),
            );
            this.setState({dialogIsVisible: false});
            this.setState({confirmVisible: true});
            this.backToList();
          }}
          closeDialog={() => {
            this.setState({dialogIsVisible: false});
            this.backToListNoAddition();
          }}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.confirmVisible}
          onRequestClose={() => {
            this.setState({confirmVisible: false});
          }}
          onShow={() => {
            setTimeout(() => {
              this.setState({confirmVisible: false});
            }, 700);
          }}></Modal>
      </View>
    );
  }

  /**
   * Connect to openFoodFactsApi via openfoodfac-ts api in order to
   * search for the scaned Barcode
   * @param {Object} data
   */
  handleBarCodeScanned = async ({type, data}) => {
    this.setState({scanned: true});
    const product = await openFoodFactsApi.findProductByBarcode(data);
    product['isSelected'] = false;
    product['isUserProduct'] = false;
    await this.setState({product: product});
    this.setState({lastProductSelected: product, dialogIsVisible: true});
  };
}

const styles = StyleSheet.create({
  container: {
    //paddingTop: navbarHeight,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  modalConfirm: {
    alignItems: 'center',
    justifyContent: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    width: 200,
    height: 200,
    borderRadius: 12,
    borderWidth: 3,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ScannerScreen);
