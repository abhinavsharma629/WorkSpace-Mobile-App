import React from 'react';
import Icon from "react-native-vector-icons/Ionicons";
import {
  Text,
  Button,
  StyleSheet,
  ScrollView,
  View,
  Dimensions,
  TextInput,
  Modal,
  TouchableHighlight,
  Alert
} from 'react-native';

import ShowComments from './ShowComments';
import ShowPostWithComments from './ShowPostWithComments';

var screen = Dimensions.get('window');

export default class PostViewModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      sliderValue: 0.3,
      noteId:this.props.noteId,
      modalVisible:false,
      typeOfAccess:this.props.type,
      access_token:this.props.access_token
    };
  }

  componentDidMount(){
    console.log("Component Did Mount of PostViewModal")
    console.log(this.props.noteId)
    this.setState({noteId:this.props.noteId, typeOfAccess:this.props.type, access_token:this.props.access_token, modalVisible:this.props.show});
  //   if(this.state.noteId || (this.state.noteId && this.state.noteId!==this.props.noteId)){
  //   this.setState({modalVisible: true})
  // }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log("Received Post Props Again in PostViewModal")
    console.log(nextProps.noteId)

      this.setState({noteId:nextProps.noteId, typeOfAccess:nextProps.type, access_token:nextProps.access_token, modalVisible:nextProps.show});
  //   if(nextProps.noteId || (this.state.noteId && this.state.noteId!==nextProps.noteId)){
  //   this.setState({modalVisible: true})
  // }

}

  onClose() {
    console.log('Modal just closed');
  }

  onOpen() {
    console.log('Modal just opened');
  }

  onClosingState(state) {
    console.log('the open/close of the swipeToClose just changed');
  }

  setModalVisible(visible) {
    this.props.setShow()
    this.setState({modalVisible: visible});
  }

  render() {

      return (
        <ScrollView style={{marginTop: 22}}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              // Alert.alert('Modal has been closed.');
              this.setModalVisible(!this.state.modalVisible);
            }}>
            <View style={{marginTop: 0}}>
              <View>
                <TouchableHighlight
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}>
                    <Icon size={40} name="ios-close" style={{marginLeft:7}}/>
                </TouchableHighlight>
              </View>
              <ShowPostWithComments noteId={this.state.noteId} access_token={this.state.access_token}/>
            </View>
          </Modal>


        </ScrollView>
      );

  }

}

const styles = StyleSheet.create({

  wrapper: {
    paddingTop: 50,
    flex: 1,
    zIndex:10
  },

  modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  modal2: {
    height: 230,
    backgroundColor: "#3B5998"
  },

  modal3: {
    height: 300,
    width: 300
  },

  modal4: {
    height: 300
  },

  btn: {
    margin: 10,
    backgroundColor: "#3B5998",
    color: "white",
    padding: 10
  },

  btnModal: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    backgroundColor: "transparent"
  },

  text: {
    color: "black",
    fontSize: 22
  }

});


// <Modal style={[styles.modal, styles.modal4]} position={"bottom"} ref={"modal4"}>
//   <Text style={styles.text}>Modal on bottom with backdrop</Text>
//   <Slider style={{width: 200}} value={this.state.sliderValue} onValueChange={(value) => this.setState({sliderValue: value})} />
// </Modal>
//
// <Modal isOpen={this.state.isOpen} onClosed={() => this.setState({isOpen: false})} style={[styles.modal, styles.modal4]} position={"center"} backdropPressToClose={false} backdropContent={BContent}>
//   <Text style={styles.text}>Modal with backdrop content</Text>
// </Modal>
//
// <Modal style={[styles.modal, styles.modal4]} position={"bottom"} ref={"modal6"} swipeArea={20}>
//   <ScrollView>
//     <View style={{width: screen.width, paddingLeft: 10}}>
//       {this.renderList()}
//     </View>
//   </ScrollView>
// </Modal>
