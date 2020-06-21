import React, { Component } from "react";
import {
  StyleSheet,
  Keyboard,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  KeyboardAvoidingView,
  AsyncStorage,
  Linking,
  Image,
  BackHandler,
  ScrollView,
  Modal,
  FlatList,
  DrawerActions,
  ProgressBarAndroid,
  findNodeHandle
} from "react-native";

import GestureRecognizer, {
  swipeDirections
} from "react-native-swipe-gestures";

import Drawer from "react-native-drawer";
import RNExitApp from "react-native-exit-app";
import { WebView } from "react-native-webview";
import DeepLinking from "react-native-deep-linking";
import { Container, Footer, FooterTab } from "native-base";
import { ActivityIndicator, Colors } from "react-native-paper";
import { Button, Divider } from "react-native-elements";
import Overlay from "react-native-modal-overlay";
import DropdownAlert from "react-native-dropdownalert";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ViewMoreText from "react-native-view-more-text";
import { StackActions, NavigationActions, Actions } from "react-navigation";
import moment from "moment";
import {
  ClassicHeader,
  AppleHeader,
  ModernHeader
} from "@freakycoder/react-native-header-view";
import {
  Card,
  CardTitle,
  CardContent,
  CardAction,
  CardButton,
  CardImage
} from "react-native-material-cards";
import Share from "react-native-share";


export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading:true,
      access_token:null,
      user:null,
      img_url:"https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg",
      activity_text:"Still Under Development!!\nStay Tuned"
    };
  }

  componentDidMount(){
    console.log("Inside componentDidMount of Settings")
    console.log(this.props.screenProps.img_url)
    // this.setState({access_token:this.props.screenProps.access_token, user:this.props.screenProps.user, img_url:this.props.screenProps.img_url})
    this.setState({access_token:this.props.screenProps.access_token, user:this.props.screenProps.user})
  }

  static navigationOptions = {
    drawerLabel: "Settings",
    drawerIcon: () => <Icon size={25} name="settings" />,
    tapToClose: "true"
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
            elevation={20}
          />
          <ClassicHeader
            headerTitle="Settings"
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack()
                }}
              >
                <Icon size={30} name="keyboard-backspace" style={{ marginLeft: 10, marginTop:3 }} />
              </TouchableOpacity>
            }
            rightComponent={
              <TouchableOpacity onPress={() => {this.props.navigation.openDrawer();}}>
                <Icon size={30} name="settings" style={{ marginRight: 10 }} />
              </TouchableOpacity>
            }
            height={60}
            statusBarHidden={true}
          />

          <ProgressBarAndroid
            styleAttr="Horizontal"
            indeterminate={true}
            color="#0476D9"
            style={[
              styles.loader,
              { marginLeft: 20, marginRight: 20, height: 20 }
            ]}
          />
          <Text
            style={{
              color: "blue",
              top: "40%",
              padding: 10,
              elevation: 5,
              textAlign: "center",
              fontSize:18
            }}
          >
            {this.state.activity_text}
          </Text>
        </View>
      );
    }
    else{
    return (
      <View style={styles.container}>
        <Text>I'm the Settings component</Text>
        <TouchableOpacity onPress={() => {this.props.screenProps.rootNav.navigate('Login1', {
          screenProps1:this.props.screenProps.rootNav
          })}}>
        <Icon name="ios-add" size={100} style={{marginTop:250, marginLeft:180}}/>
        </TouchableOpacity>
      </View>
    );
  }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loader: {
    alignItems: "center",
    justifyContent: "center",
    top: "40%"
  }
});
