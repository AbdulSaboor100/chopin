import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Modal,
  Animated,
} from 'react-native';
import DialogInput from 'react-native-dialog-input';
import { Searchbar } from 'react-native-paper';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import {  InputGroup} from 'native-base';
import { LogBox } from 'react-native';
import { Component } from 'react';
import {
  mapStateToProps,
  mapDispatchToProps,
} from '../../redux/actions/listesActions';
import { Dimensions } from 'react-native';
import AwesomeButton from 'react-native-really-awesome-button';

/**
 * Create a card for an item (json object) to show product name and image
 * @param {Object} object - product info
 */
const Item = ({ product_name, product_image }) => (
  <View style={styles.item}>
    <Image
      source={{ uri: product_image == '' ? null : product_image }}
      style={styles.product_image}
    />
    <Text style={styles.product_name}>{product_name}</Text>
  </View>
);

const numColumns = 3; // number of elements to show in columns
const marginHoriz = 5; // margins between elements in the column
const itemWidth =
  (Dimensions.get('window').width - (numColumns + 3) * marginHoriz) /
  numColumns; // width of each single item elements

// Collapsing Search Bar
const searchbarHeight = 1;
const navbarHeight = 64;

// searchbar animation
const scrollAnim = new Animated.Value(0);
const offsetAnim = new Animated.Value(0);
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const AnimatedSearchbar = Animated.createAnimatedComponent(Searchbar);
const AnimatedInputGroup = Animated.createAnimatedComponent(InputGroup);
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * Component that implements the search feature using scan
 *  and search bar.
 */
class ArticleSearchPage extends Component {
  /**
   *
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      lastProductSelected: {},
      dialogIsVisible: false,
      dataSource: [],
      indexChecked: '0',
      ModalState: false,
      UserItemModalState: false,
      UserItemName: '',
      UserItemDesc: '',
      searchTerms: '',
      pageCount: 0,
      scrollAnim,
      offsetAnim,
      confirmVisible: false,
      clampedScroll: Animated.diffClamp(
        Animated.add(
          scrollAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-1, 0],
            extrapolateLeft: 'clamp',
          }),
          offsetAnim,
        ),
        0,
        (navbarHeight - searchbarHeight) * 1,
      ),
    };
  }

  /**
   * Wrapper component around Item to add Interactivity and press events and selection border
   * @param {Object} Item
   * @returns void
   */
  renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        this.setState({ lastProductSelected: item });
        this.setState({ ModalState: true });
      }}>
      <Item
        product_name={item.product_name}
        product_image={item.image_front_thumb_url}
      />
    </TouchableOpacity>
  );

  /**
   * Fetch data entered from url and parse the results
   * into dataSource state.
   *
   * @param {String} text
   * @param {Int} pageCount
   */
  getNextPage({ text, pageCount }) {
    if (text == '') {
      return;
    }
    const nextPage = pageCount + 1;
    this.setState({ pageCount: nextPage });
    //const url = 'https://world.openfoodfacts.org/cgi/search.pl?action=process&tagtype_0=categories&tag_contains_0=contains&json=true&search_terms=';
    const url =
      'https://fr.openfoodfacts.org/cgi/search.pl?&json=true&page_size=21&page=' +
      nextPage +
      '&search_terms=' +
      text;
    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        if (pageCount === 0) {
          for (let i = 0; i < responseJson.products.length; i++) {
            responseJson.products[i]['isSelected'] = false;
            responseJson.products[i]['isUserProduct'] = false;
          }
          this.setState({
            dataSource: responseJson.products, // if new request, make a new array
          });
        } else {
          this.setState({
            dataSource: [...this.state.dataSource, ...responseJson.products], // appends new fetched data to the previous one
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * Saves a user item.
   * @param {string} userItemName 
   * @param {string} userItemDesc 
   */
  saveNewUserItem(userItemName, userItemDesc) {
    if (userItemName == '') {
      return;
    }
    const customData = {
      product_name: userItemName,
      product_desc: userItemDesc,
      isSelected: false,
      isUserProduct: true,
      id: "user" + userItemName,//Random.getRandomBytes(8).toString(),
      image_front_thumb_url: '',
    };

    this.setState({ lastProductSelected: customData });
  }

  /**
   * Save search terms and launch the parsing of the search terms
   *
   * @param {String} text
   */
  fetchData(text) {
    this.setState({ pageCount: 0 }); // at each new request, reset page counter to 0
    this.setState({ searchTerms: text }); // save search terms
    this.getNextPage({ text: text, pageCount: 0 });
  }

  /**
   * Actions on scroll end reached.
   */
  handleLoadMore = () => {
    this.getNextPage({
      text: this.state.searchTerms,
      pageCount: this.state.pageCount,
    });
  };

  /**
   * helper function to detect end of scroll and make final action.
   */
  _onScrollEndDrag = () => {
    this._scrollEndTimer = setTimeout(this._onMomentumScrollEnd, 250);
  };

  /**
   * helper function to detect beginning of scroll and make initial action.
   */
  _onMomentumScrollBegin = () => {
    clearTimeout(this._scrollEndTimer);
  };

  /**
   * helper function called when the momentum scroll ends (scroll which occurs as the ScrollView glides to a stop).
   */
  _onMomentumScrollEnd = () => {
    // Code to handle scroll end animation will go here.
  };

  render() {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    const { clampedScroll } = this.state;

    const navbarTranslate = clampedScroll.interpolate({
      inputRange: [0, navbarHeight - searchbarHeight],
      outputRange: [0, -(navbarHeight - searchbarHeight) * 2],
      extrapolate: 'clamp',
    });
    const navbarOpacity = clampedScroll.interpolate({
      inputRange: [0, navbarHeight - searchbarHeight],
      outputRange: [1, 1],
      extrapolate: 'clamp',
    });
    return (
      <View style={styles.container}>
        <AnimatedFlatList
          data={this.state.dataSource}
          renderItem={this.renderItem}
          keyExtractor={(item) => item._id}
          numColumns={numColumns}
          onEndReachedThreshold={0.5}
          onEndReached={this.handleLoadMore}
          scrollEventThrottle={1}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollAnim } } }],
            { useNativeDriver: false },
          )}
          onMomentumScrollBegin={this._onMomentumScrollBegin}
          onMomentumScrollEnd={this._onMomentumScrollEnd}
          onScrollEndDrag={this._onScrollEndDrag}
          style={{ paddingTop: navbarHeight }}
        />

        <AnimatedInputGroup
          style={[
            styles.searchbar,
            { transform: [{ translateY: navbarTranslate }] },
          ]}>
          <AnimatedSearchbar
            placeholder="Rechercher un produit"
            onChangeText={(text) => {
              this.fetchData(text);
            }}
            style={[styles.searchbar_name, { opacity: navbarOpacity }]}
          />
          <AnimatedTouchable
            style={[
              styles.icon,
              {
                opacity: navbarOpacity,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 8,
              },
            ]}>
            <Icon
              name="add"
              type="ionicons"
              color="black"
              size={30}
              onPress={() => {
                if (this.state.searchTerms != '')
                  this.setState({
                    UserItemModalState: true,
                    UserItemName: this.state.searchTerms,
                  });
              }}
            />
            <Icon
              name="barcode-scan"
              type="material-community"
              color="black"
              size={30}
              onPress={() =>
                this.props.navigation.navigate('Scanner', {
                  id_list: this.props.route.params.id_list,
                })
              }
            />
          </AnimatedTouchable>
        </AnimatedInputGroup>

        <Modal
          visible={this.state.UserItemModalState}
          transparent={true}
          animationType="slide"
          style={styles.modal}
          coverScreen={false}>
          <View style={styles.container}>
            <View style={styles.modalContainer}>
              <TextInput
                value={this.state.UserItemName}
                onChangeText={(value) => this.setState({ UserItemName: value })}
                style={{
                  color: 'tomato',
                  fontSize: 30
                }}
              />
              <TextInput
                multiline
                numberOfLines={4}
                value={this.state.UserItemDesc}
                onChangeText={(value) => this.setState({ UserItemDesc: value })}
                placeholder="Description"
                placeholderTextColor="grey"
                editable
                maxLength={120}
                style={{
                  color: 'black',
                  fontSize: 18
                }}
              />
              <AwesomeButton
                progress
                type="primary"
                width={150}
                onPress={() => {
                  this.saveNewUserItem(
                    this.state.UserItemName,
                    this.state.UserItemDesc,
                  );
                  this.setState({
                    UserItemModalState: false,
                    /*UserItemName: '',
                    UserItemDesc: '',
                    confirmVisible: true,*/
                  });
                  this.setState({
                    dialogIsVisible: true
                  });
                }}>
                Ajouter
              </AwesomeButton>
              <AwesomeButton
                type="secondary"
                width={150}
                onPress={() =>
                  this.setState({
                    UserItemModalState: false,
                    UserItemName: '',
                    UserItemDesc: '',
                  })
                }>
                Annuler
              </AwesomeButton>
            </View>
          </View>
        </Modal>

        <Modal
          visible={this.state.ModalState}
          transparent={true}
          animationType="slide"
          style={styles.modal}
          coverScreen={false}>
          <View style={styles.container}>
            <View style={styles.modalContainer}>
              <AwesomeButton progress type="primary" width={150} onPress={() => {
                this.setState({ ModalState: false });
                this.setState({ dialogIsVisible: true });
              }}>Ajouter</AwesomeButton>
              <AwesomeButton type="secondary" width={150} onPress={() => {
                this.setState({ ModalState: false });
                this.props.navigation.navigate("MoreInfoScreen", this.state.lastProductSelected);
              }}>Plus d'infos</AwesomeButton>
              <AwesomeButton type="secondary" width={150} onPress={() => this.setState({ ModalState: false })}>Annuler</AwesomeButton>
            </View>
          </View>
        </Modal>
        <DialogInput
          isDialogVisible={this.state.dialogIsVisible}
          title="Quantité" hintInput="1"
          submitText="Ajouter"
          cancelText="Annuler"

          textInputProps={{ keyboardType: 'numeric' }}
          submitInput={(inputText) => {
            if (inputText == NaN | inputText == undefined | inputText == "") {
              inputText = 1;
            }
            this.props.addToCart(this.state.lastProductSelected, this.props.route.params.id_list, parseInt(inputText, 10));
            this.setState({ dialogIsVisible: false });
            this.setState({ confirmVisible: true });
          }}
          closeDialog={() => {
            this.setState({ dialogIsVisible: false });
          }}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.confirmVisible}
          onRequestClose={() => { this.setState({ confirmVisible: false }) }}
          onShow={() => {
            setTimeout(() => {
              this.setState({ confirmVisible: false })
            },
              700);
          }
          }
        >
          <View style={styles.container}>
            <View style={styles.modalConfirm}>
              <Text>Article ajouté !</Text>
              <Icon
                name="check-circle"
                type="material-community"
                color="tomato"
                size={50}
                onPress={() => { }}
              />
            </View>
          </View>
        </Modal>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //paddingTop: navbarHeight,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  searchbar: {
    position: 'absolute',
    top: 15,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#dedede',
    borderBottomWidth: 1,
    height: searchbarHeight,
    //justifyContent: 'center',
    paddingTop: navbarHeight - 30,
    flex: 1,
    flexDirection: 'row',
  },
  item: {
    backgroundColor: 'white',
    marginTop: 8,
    marginHorizontal: marginHoriz,
    height: itemWidth, // get a square
    width: itemWidth,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    width: 300,
    height: 300,
    borderRadius: 2,
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
  product_name: {
    fontSize: 12,
    color: 'grey',
    fontWeight: 'bold',
    flexWrap: 'wrap',
    flex: 1,
  },
  searchbar_name: {
    position: 'absolute',
    bottom: -10,
    left: 5,
    fontSize: 12,
    color: 'grey',
    fontWeight: 'bold',
    flexWrap: 'wrap',
    width: '79%',
  },
  product_image: {
    paddingTop: 5,
    width: itemWidth / 1.3,
    height: itemWidth / 1.3,
    resizeMode: 'contain',
    flexShrink: 1,
  },
  icon: {
    position: 'absolute',
    width: '19%',
    bottom: 0,
    right: 0,
    paddingLeft: 10,
    flex: 1,
    flexShrink: 1,
  },
  modal: {
    backgroundColor: 'white',
    alignSelf: 'center',
    alignItems: 'center',
    margin: 20,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ArticleSearchPage);
