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

export default class CommentViewModal extends React.Component {

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
    console.log("Component Did Mount of CommentViewModal")
    console.log(this.props.noteId)
    console.log(this.props.show)
    this.setState({noteId:this.props.noteId, typeOfAccess:this.props.type, access_token:this.props.access_token, modalVisible:this.props.show});
  //   if(this.state.noteId || (this.state.noteId && this.state.noteId!==nextProps.noteId)){
  //   this.setState({modalVisible: true})
  // }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log("Received Comment Props Again")
    console.log(nextProps.noteId)
    console.log(this.props.show)
      this.setState({noteId:nextProps.noteId, typeOfAccess:nextProps.type, access_token:nextProps.access_token, modalVisible:nextProps.show});
  //   if(this.state.noteId || (this.state.noteId && this.state.noteId!==nextProps.noteId)){
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

        <View style={{flex:1}}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              // Alert.alert('Modal has been closed.');
              this.setModalVisible(!this.state.modalVisible);
            }}>
            <View style={{marginTop: 0, flex:1}}>
              <View>
                <TouchableHighlight
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}>
                  <Icon size={40} name="ios-close" style={{marginLeft:7}}/>
                </TouchableHighlight>
              </View>
              <View style={{flex:1}}>
              <ShowComments noteId={this.state.noteId} access_token={this.state.access_token} updateComment={this.props.updateComment} />
              </View>
              </View>
          </Modal>


        </View>

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
