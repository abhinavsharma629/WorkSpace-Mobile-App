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

import GitPostViewScreen from './GitPostViewScreen';

var screen = Dimensions.get('window');

export default class GitPostViewModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      sliderValue: 0.3,
      noteId:this.props.noteId,
      modalVisible:false,
      access_token:this.props.access_token
    };
  }

  componentDidMount(){
    console.log("Component Did Mount of Git PostViewModal")
    console.log(this.props.noteId)
    this.setState({noteId:this.props.noteId, access_token:this.props.access_token, modalVisible:this.props.show});
  //   if(this.state.noteId || (this.state.noteId && this.state.noteId!==this.props.noteId)){
  //   this.setState({modalVisible: true})
  // }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log("Received Git Post Props Again")

    console.log(nextProps.noteId)
    this.setState({noteId:nextProps.noteId, access_token:nextProps.access_token, modalVisible:nextProps.show});
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
    this.props.setShow();
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
              <GitPostViewScreen noteId={this.props.noteId} access_token={this.props.access_token} gitHubData={this.props.gitHubData} gitHubData1={this.props.gitHubData1} auth_login_name={this.props.auth_login_name} loading={this.props.loading} />
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
