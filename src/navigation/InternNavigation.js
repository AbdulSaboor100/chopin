import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ArticleSearchPage from '../screens/search/ArticleSearchPage'
import MoreInfoProduct from '../screens/MoreInfoProduct'
import ListArticleScreen from '../screens/ListArticleScreen'
import ScannerScreen from '../screens/ScannerScreen';
import ListesScreen from '../screens/ListesScreen';
import GardeMangerScreen from '../screens/GardeManger'
import { connect } from 'react-redux'
import {
  mapStateToProps,
  mapDispatchToProps,
} from '../redux/actions/listesActions';



const Stack = createStackNavigator();

/**
 * Class that handles the navigation inside a navigation branch.
 * 
 */
class InternNavigation extends Component {
  /**
   * 
   * @param {Object} props 
   */
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  /**
   * Defines which branch entry to use.
   * @param {Object} navigation 
   * @returns {Object}
   */
  entryComponent = (navigation) => {
    if (this.props.entry == "Listes") {
      return(
        <ListesScreen {...navigation}/>
      );
    }
    else if (this.props.entry == "Garde-Manger") {
      return(
        <GardeMangerScreen {...navigation}/>
      );
    }
  }

/**
 * Checks if the id of the list watched is the current id selected.
 * @param {Object} list 
 * @returns {Boolean}
 */
  checkId = (list) => {
    return this.props.lastIdSelected == list.id;
  }

  /**
   * Displays the name of the current list for screen further in navigation.
   * @returns {string}
   */
  displayTitle = () => {
    if (this.props.lists.find(this.checkId) == null){
      return ""
    }
    else {
      return this.props.lists.find(this.checkId).title
    }
  }

  render() {
    return (
        <Stack.Navigator initialRouteName="Intern" screenOptions={{headerTintColor: 'tomato'}}>
          
          <Stack.Screen options={{headerShown: false}} name="ListesScreen" children={(navigation) => this.entryComponent(navigation)}/>

          <Stack.Screen options={{title: this.displayTitle()}} name="HomeSearch" component={ArticleSearchPage} />

          <Stack.Screen options={{title: this.displayTitle()}} name="MoreInfoScreen" component={MoreInfoProduct} />
          <Stack.Screen options={{title: this.displayTitle()}} name="ListArticleScreen" component={ListArticleScreen} />

          <Stack.Screen options={{title: this.displayTitle()}} name="Scanner" component={ScannerScreen} />

        </Stack.Navigator>

    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InternNavigation);