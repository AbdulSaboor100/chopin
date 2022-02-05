import React, {useState, useEffect} from 'react';
import {
  View,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  Modal,
} from 'react-native';
import {Icon} from 'react-native-elements';
import DialogInput from 'react-native-dialog-input';
import {connect} from 'react-redux';
import * as Random from 'expo-random';
import 'firebase/firestore';
import {
  mapStateToProps,
  mapDispatchToProps,
} from '../redux/actions/listesActions';
import {
  MenuProvider,
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';
import FloatingActionButton from 'react-native-floating-action-button';
import { mapStateToPropsSettings, mapDispatchToPropsSettings } from '../redux/actions/settingsActions'

import {InputGroup} from 'native-base';
import PanMoveHandler from '../components/PanMoveHandler';
import cloneDeep from 'lodash/cloneDeep';
import firebase from 'firebase'

/**
 * Item list in the Flatlist of lists.
 * @param {Object} item - Object containing a list item datas.
 * @param {function} onPress - Action to execute when tapping the item without maintaining the touch. 
 * @param {Object} style - Style informations concerning the PanMoveHandler component.
 * @param {Object} props - All props inherited from the store and navigation.
 * @param {function} setconfirmVisible - For displaying the confirmation modal when adding to the GardeManger compoenent.
 */
const Item = ({item, onPress, style, props, setconfirmVisible}) => (
    firebase?.auth()?.currentUser?.uid === item?.uid ? (
      <PanMoveHandler
    transmit={style}
    itemId={item.id}
    props={props}
    myPress={onPress}>
    <Text style={styles.title}>{item.title}</Text>
    <View style={styles.options}>
      <Text style={styles.trackNumber}>
        {item.numberChecked}/{item.numberItems}
      </Text>

      <Menu onSelect={(value) => Alert.alert(value)}>
        <MenuTrigger>
          <Icon name="ellipsis-vertical" type="ionicon" color="tomato" />
        </MenuTrigger>

        <MenuOptions customStyles={{optionsContainer: {marginTop: -90}}}>
          <MenuOption
            value="Renommer"
            text="Renommer"
            onSelect={() => {
              props.setIdSelected(item.id);
              props.setDialogRenameVisible(true);
            }}
          />
          <MenuOption
            value="Supprimer"
            text="Supprimer"
            onSelect={() => {
              props.removeToLists(item.id);
               if (props.isSetSync) {
                 props.saveToCloud();
               }
            }}
          />

          <MenuOption
            value="Ajouter au garde manger"
            text="Ajouter au garde manger"
            onSelect={() => {
              for (let i of props.lists.filter((x) => x.id == item.id)[0]
                .cart) {
                props.addToGardeManger(cloneDeep(i));
                setconfirmVisible(true);
                 if (props.isSetSync) {
                  props.saveToCloudGm();
                 }
                
              }
            }}
          />

          <MenuOption
            value="Ajouter selection au garde manger"
            text="Ajouter selection au garde manger"
            onSelect={() => {
              for (let i of props.lists
                .filter((x) => x.id == item.id)[0]
                .cart.filter((y) => y.isSelected)) {
                props.addToGardeManger(cloneDeep(i));
                setconfirmVisible(true);
              }
            }}
          />
        </MenuOptions>
      </Menu>
    </View>
  </PanMoveHandler>
    ) : (
      <Text></Text>
    )
);

/**
 *  Component that implements user lists features.
 *
 *
 * @param {Object} props
 * @returns The lists view
 */
const ListesScreen = (props) => {
  const [selectedId, setSelectedId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [confirmVisible, setconfirmVisible] = useState(false);
  const renderItem = ({item}) => {
    // modify that to match the spec colors

    const backgroundColor = item.id === selectedId ? 'white' : 'white';
    
    return (
      <Item
        item={item}
        onPress={() => {
          
          props.setIdSelected(item.id);
          props.navigation.navigate('ListArticleScreen', {id_list: item.id});
        }}
        style={{backgroundColor}}
        props={props}
        setconfirmVisible={setconfirmVisible}
      />
    );
  };


  useEffect(() => {
    if (props.isSetSync) {
      props.loadListsFromCloud();
    
      const messagesListener = firebase.firestore().collection("users")
        .doc(firebase.auth().currentUser.uid).collection('User').onSnapshot(querySnapshot => {
          const messages = querySnapshot.docs.map(doc => {
            const firebaseData = doc.data();
            console.log(doc.data());
          });
          props.loadListsFromCloud();
        });

      return () => messagesListener();
    }
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <InputGroup style={styles.groupContainer}>
        <Text style={styles.textContainer}> Listes</Text>
      </InputGroup>

      <MenuProvider style={styles.container}>
        <FlatList
          data={props.lists}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={selectedId}
        />
        <DialogInput
          isDialogVisible={isDialogVisible}
          title={'Nouvelle liste'}
          message={'Entrer le nom de la liste'}
          hintInput={'Nom'}
          cancelText={'Annuler'}
          submitText={'Créer'}
          submitInput={(inputText) => {
            props.addToLists({
              id: Random.getRandomBytes(2).toString(),
              uid : firebase.auth().currentUser.uid,
              title: inputText,
              cart: [],
              numberItems: 0,
              numberChecked: 0,
            });
            setIsDialogVisible(false);
            if (props.isSetSync) {
               props.saveToCloud();

            }
          }}
          closeDialog={() => setIsDialogVisible(false)}></DialogInput>

        <DialogInput
          isDialogVisible={props.isRenameVisible}
          title={'Renommer la liste'}
          message={'Entrer le nom de la liste'}
          hintInput={'Name'}
          submitInput={(inputText) => {
            props.renameToLists(inputText);
            props.setDialogRenameVisible(false);
            if (props.isSetSync) {
                 props.saveToCloud();

            }
          }}
          closeDialog={() => props.setDialogRenameVisible(false)}></DialogInput>
        <FloatingActionButton
          iconName="plus"
          iconColor="white"
          size={50}
          iconSize={30}
          backgroundColor="tomato"
          shadowColor="black"
          animated={true}
          onPress={() => setIsDialogVisible(true)}
        />
      </MenuProvider>
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmVisible}
        onRequestClose={() => {
          setconfirmVisible(false);
        }}
        onShow={() => {
          setTimeout(() => {
            setconfirmVisible(false);
          }, 1200);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalConfirm}>
            <Text style={styles.textConfirm}>
              Articles ajoutés au Garde Manger !
            </Text>
            <Icon
              name="check-circle"
              type="material-community"
              color="tomato"
              size={50}
              onPress={() => {}}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  modalContainer: {
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
  textContainer: {
    textAlign: 'left',
    paddingLeft: 10,
    color: 'tomato',
    fontSize: 30,
    alignSelf: 'flex-start',
    paddingBottom: 10,
  },

  textConfirm: {
    textAlign: 'center',
    color: 'black',
    fontSize: 20,
    alignSelf: 'flex-start',
  },

  groupContainer: {
    justifyContent: 'space-between',
  },

  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  options: {
    marginVertical: 8,
    marginHorizontal: -10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 22,
  },

  trackNumber: {
    fontSize: 20,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)
  (connect(mapStateToPropsSettings, mapDispatchToPropsSettings)(ListesScreen))


