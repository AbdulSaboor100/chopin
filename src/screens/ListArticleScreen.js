import React, {Component, useState} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {SwipeListView} from 'react-native-swipe-list-view';
import CheckBox from '@react-native-community/checkbox';
import {useNavigation} from '@react-navigation/native';
import AddButton from '../components/AddButton';
import {
  mapStateToProps,
  mapDispatchToProps,
} from '../redux/actions/listesActions';
import {
  mapStateToPropsSettings,
  mapDispatchToPropsSettings,
} from '../redux/actions/settingsActions';

const Item = ({
  image_front_thumb_url,
  product_name,
  nutriscore_grade,
  isUserProduct,
  product_desc,
  props,
  item,
}) => {
  const info = {
    image_front_thumb_url,
    product_name,
    nutriscore_grade,
    isUserProduct,
    product_desc,
  };
  const [isSelected, setSelection] = useState(item.isSelected);
  const navigation = useNavigation();

  return (
    <View style={styles.item}>
      <View style={styles.checkBoxContainer}>
        <CheckBox
          value={isSelected}
          onValueChange={setSelection}
          onChange={() => {
            props.checkUncheckItem(item, isSelected);
          }}
          style={styles.checkbox}
        />
      </View>
      <View style={styles.description}
      ><TouchableOpacity style={styles.description}
        onPress={() => { navigation.navigate("MoreInfoScreen", item) }}>
          <View style={styles.description}>
            <Text style={styles.product_name}>{item.product_name}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.counter_product}> x{item.product_quantity}</Text>

    </View>
  );
};
/**
 * A class that implements the cart of the user.
 *  It gathers all the products added in a Flat(List Component.
 */
class ListArticleScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    if (this.props.isSetSync) {
      this.props.saveToCloud();
    }
  }

  renderItem = ({ item }) => (
    <Item  props={this.props} item={item} />

  );
  renderHiddenItem = ({item}) => {
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={() => {
            this.props.setIdSelected(this.props.route.params.id_list);
            this.props.deleteItemCart(item.id, this.props.route.params.id_list)
            if (item.isSelected == true) {
              this.props.checkUncheckItem(item, item.isSelected)
            }
          }}>
          <Text style={styles.backTextWhite}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <SwipeListView
          style={styles.list}
          data={
            this.props.lists.filter(
              (x) => x.id == this.props.route.params.id_list,
            )[0].cart
          }
          renderItem={this.renderItem}
          keyExtractor={(item) => item.id}
          renderHiddenItem={this.renderHiddenItem}
          leftOpenValue={0}
          rightOpenValue={-75}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          // onRowDidOpen={onRowDidOpen}
        />
        <AddButton data={this.props} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  list: {},
  container: {
    flex: 1,
  },

  item: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 0.7,
    borderBottomColor: 'lightgrey',
    flexDirection: 'row',
  },
  image_front_thumb_url: {
    height: 90,
    width: 35,
  },
  product_name: {
    fontSize: 20,
  },
  counter_product: {
    fontSize: 20,
  },
  checkbox: {
    alignSelf: 'center',
    width: 50,
    color:'tomato'
  },
  checkBoxContainer: {
    alignSelf: 'center',
  },
  description: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nutriscore_grade: {
    flex: 1,
    fontSize: 20,
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  connect(
    mapStateToPropsSettings,
    mapDispatchToPropsSettings,
  )(ListArticleScreen),
);
