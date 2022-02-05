import React, {  Component } from "react";
import { View,  StyleSheet, PanResponder} from "react-native";
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from '../redux/actions/listesActions'

/**
 * Component that makes another one slide.
 */
class PanMoveHandler extends Component {
/**
 * 
 * @param {Object} props 
 */

    constructor(props) {
        super(props)
        this.state = {
          topPosition: 0, //Value of the Y axe position of the item.
          myColor: 'white',
        }
        
        var time0;
        /**
         * Define the move handler.
         */
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => { //Detection of event (touch interaction) enabled. 
                return true;
            }, 
            onPanResponderStart: (evt, gestureState) => { //To apply only at the begining of the interaction.
                this.time0 = evt.timeStamp;
                setTimeout(
                () => {
                    this.setState({
                        myColor: 'lightgrey',
                        })
                    }, 
                700); //At 700 ms, the item grows to show the shift to the moving feature.
                props.setIdSelected(props.itemId);
            },
            onPanResponderMove: (evt, gestureState) => { //To apply all along the interaction
                let touches = evt.nativeEvent.touches;
                if (touches.length == 1) { 
                    if (evt.timeStamp - this.time0 >= 500){  
                        this.setState({
                        topPosition: touches[0].pageY - gestureState.y0,
                        })
                    }
                }
            },
            /**
                 * Component has to run at least the half of its height to change index.
                 *If it is the case we add 1 to the index move and substract height/2 to the considered distance run.
                 * Then we computed the equivalent distance in terms of entire item height
                 * If this latter value is not an integer, we add the total found to the index move.
                 * Else, the total-1 .
                 */
            onPanResponderEnd: (evt, gestureState) => {  ////To apply at the end of the interaction
                var realHeight = this.itemDim.height + styles.item.marginVertical;
                var semiHeight = realHeight/2;
                var deltaAbs = Math.abs(gestureState.dy); //Absolute value of the distance run by the component compared to its original coordonate y0.
                var nbIndex;
                
                if (evt.timeStamp - this.time0 < 700) //Either the press lasted less than 700 ms. In this case we want to enter in the item. Otherwise, we want to move the item
                {
                    setTimeout(
                        () => {
                            this.setState({
                                myColor: 'white',
                                })
                            }, 
                        705 - (evt.timeStamp - this.time0) );//If user stays want tu use the navigation feature, then item comes back to a normal size. The calculation is tought so that this instruction came after the previous enlargement in onPanResponderStart.
                    props.myPress();
                }
                else //Check that the item move more than this calculated threshold.
                    {
                        nbIndex = Math.floor((deltaAbs)/realHeight) ; //The absolute number of move in cases unite
                        var final = Math.pow(-1,(gestureState.dy <= 0))*nbIndex; //We compute the direction thank to the sign.

                        props.swapLists(final);
                        props.saveToCloud();
                        this.setState({
                            topPosition: 0,
                            myColor: 'white',
                            }) 
                    }
            },
        })
    }



    render() {
        return (
            <View
            onLayout = {(event) => {
                this.itemDim = event.nativeEvent.layout; //add in itemDim the dimensions and the particulars.
            }}
            {...this.panResponder.panHandlers}
            style={[styles.item, { top: this.state.topPosition, backgroundColor: this.state.myColor}]}
            >
            {this.props.children} 
            </View>
    )
}

}

const styles = StyleSheet.create({
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
});

export default connect(mapStateToProps, mapDispatchToProps)(PanMoveHandler)